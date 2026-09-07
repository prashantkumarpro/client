'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useFiles } from '@/features/files/hooks/use-files'
import { formatBytes } from '@/lib/utils/format'
import { getFileTypeInfo, FileCategory } from '../utils/file-preview'
import { cn } from '@/lib/utils/cn'
import {
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  Music,
  Code,
  File as FileIcon,
  Download,
  ExternalLink,
  Loader2,
  AlertCircle,
  FileQuestion,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  FileSpreadsheet,
  Presentation,
  Archive
} from 'lucide-react'

export interface PreviewableFile {
  id?: string
  _id?: string
  name: string
  extension?: string
  size?: number
  url?: string
  thumbnailUrl?: string
  mimeType?: string
  type?: string
  updatedAt?: string | Date
  createdAt?: string | Date
}

export interface FilePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  file: PreviewableFile | null
  files?: PreviewableFile[]
  onNavigate?: (file: PreviewableFile) => void
}

const isValidObjectId = (id?: string | null): boolean => {
  return Boolean(id && typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id))
}

// Sample fallback URLs for mock files during development/testing
const MOCK_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=85'

export function FilePreviewModal({
  isOpen,
  onClose,
  file,
  files,
  onNavigate
}: FilePreviewModalProps) {
  const { getBlob, download } = useFiles()

  const [activeFile, setActiveFile] = useState<PreviewableFile | null>(file)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [textContent, setTextContent] = useState<string | null>(null)
  const [blobType, setBlobType] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState<boolean>(false)

  // Image viewer transform controls
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [rotation, setRotation] = useState<number>(0)

  // Sync active file with prop
  useEffect(() => {
    setActiveFile(file)
    setZoomLevel(1)
    setRotation(0)
  }, [file])

  const currentFile = activeFile || file
  const fileId = currentFile?.id || currentFile?._id

  // Determine collection navigation bounds
  const fileCollection = useMemo(() => {
    if (!files || files.length === 0) return []
    // Filter out folder items if any
    return files.filter(f => f.type !== 'folder' && !f.name.endsWith('/'))
  }, [files])

  const currentIndex = useMemo(() => {
    if (!currentFile || fileCollection.length === 0) return -1
    return fileCollection.findIndex(
      f => (f.id || f._id) === (currentFile.id || currentFile._id) || f.name === currentFile.name
    )
  }, [currentFile, fileCollection])

  const hasMultipleFiles = fileCollection.length > 1
  const hasPrev = hasMultipleFiles && currentIndex > 0
  const hasNext = hasMultipleFiles && currentIndex < fileCollection.length - 1

  const handlePrev = useCallback(() => {
    if (!hasMultipleFiles) return
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : fileCollection.length - 1
    const nextFile = fileCollection[prevIdx]
    if (nextFile) {
      setActiveFile(nextFile)
      setZoomLevel(1)
      setRotation(0)
      if (onNavigate) onNavigate(nextFile)
    }
  }, [hasMultipleFiles, currentIndex, fileCollection, onNavigate])

  const handleNext = useCallback(() => {
    if (!hasMultipleFiles) return
    const nextIdx = currentIndex < fileCollection.length - 1 ? currentIndex + 1 : 0
    const nextFile = fileCollection[nextIdx]
    if (nextFile) {
      setActiveFile(nextFile)
      setZoomLevel(1)
      setRotation(0)
      if (onNavigate) onNavigate(nextFile)
    }
  }, [hasMultipleFiles, currentIndex, fileCollection, onNavigate])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Global keyboard shortcuts (Left/Right arrows for nav, Escape for close)
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return
      }

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, handlePrev, handleNext])

  // Fetch or resolve file blob / content
  useEffect(() => {
    if (!isOpen || !currentFile) {
      setBlobUrl(prev => {
        if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev)
        return null
      })
      setTextContent(null)
      setError(null)
      setIsLoading(false)
      return
    }

    let isSubscribed = true
    let createdUrl: string | null = null

    const typeInfo = getFileTypeInfo(currentFile.name, currentFile.extension, currentFile.mimeType)

    // If file already has a direct URL or thumbnailUrl
    const explicitUrl = currentFile.url || currentFile.thumbnailUrl
    if (explicitUrl) {
      setBlobUrl(explicitUrl)
      setBlobType(currentFile.mimeType || '')
      setIsLoading(false)
      setError(null)
      return
    }

    // If not a valid ObjectId (e.g. mock file during dev/demo)
    if (!fileId || !isValidObjectId(fileId)) {
      if (typeInfo.category === 'image') {
        setBlobUrl(MOCK_IMAGE_FALLBACK)
      } else if (typeInfo.category === 'code' || typeInfo.category === 'document') {
        setTextContent(`// Sample Preview for ${currentFile.name}\n// Size: ${formatBytes(currentFile.size || 1024)}\n\nfunction samplePreview() {\n  console.log("Viewing ${currentFile.name}");\n}\n\nexport default samplePreview;`)
      }
      setIsLoading(false)
      setError(null)
      return
    }

    const loadContent = async () => {
      try {
        setIsLoading(true)
        setError(null)
        setTextContent(null)

        const blob = await getBlob(fileId)
        if (!isSubscribed) return

        setBlobType(blob.type)
        createdUrl = URL.createObjectURL(blob)
        setBlobUrl(createdUrl)

        const category = getFileTypeInfo(currentFile.name, currentFile.extension, blob.type).category
        if (category === 'code' || blob.type.startsWith('text/') || blob.type === 'application/json') {
          const text = await blob.text()
          if (isSubscribed) {
            setTextContent(text)
          }
        }
      } catch (err) {
        if (isSubscribed) {
          console.error('[FilePreviewModal] Failed to load file preview:', err)
          setError('Unable to load file content for preview.')
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false)
        }
      }
    }

    loadContent()

    return () => {
      isSubscribed = false
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl)
      }
    }
  }, [isOpen, fileId, currentFile, getBlob])

  const typeInfo = useMemo(() => {
    if (!currentFile) return getFileTypeInfo('')
    return getFileTypeInfo(currentFile.name, currentFile.extension, blobType || currentFile.mimeType)
  }, [currentFile, blobType])

  const category: FileCategory = typeInfo.category

  const handleDownload = () => {
    if (fileId && currentFile) {
      if (isValidObjectId(fileId)) {
        download(fileId, currentFile.name)
      } else if (blobUrl) {
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = currentFile.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }

  const handleOpenInNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleCopyText = async () => {
    if (textContent) {
      try {
        await navigator.clipboard.writeText(textContent)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy text:', err)
      }
    }
  }

  if (!isOpen || !currentFile) return null

  // Render Header Category Icon with polished badge
  const renderHeaderIcon = () => {
    const iconClass = 'w-4 h-4 shrink-0'
    switch (category) {
      case 'image':
        return (
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
            <ImageIcon className={iconClass} />
          </div>
        )
      case 'pdf':
        return (
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
            <FileText className={iconClass} />
          </div>
        )
      case 'video':
        return (
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
            <VideoIcon className={iconClass} />
          </div>
        )
      case 'audio':
        return (
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
            <Music className={iconClass} />
          </div>
        )
      case 'document':
        if (typeInfo.docType === 'sheet') {
          return (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <FileSpreadsheet className={iconClass} />
            </div>
          )
        }
        if (typeInfo.docType === 'slide') {
          return (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0">
              <Presentation className={iconClass} />
            </div>
          )
        }
        return (
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#6E60EE]/15 text-[#8E82F8] flex items-center justify-center shrink-0">
            <FileText className={iconClass} />
          </div>
        )
      case 'code':
        return (
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0">
            <Code className={iconClass} />
          </div>
        )
      case 'archive':
        return (
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
            <Archive className={iconClass} />
          </div>
        )
      default:
        return (
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 text-white/70 flex items-center justify-center shrink-0">
            <FileIcon className={iconClass} />
          </div>
        )
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/85 backdrop-blur-[2px] transition-opacity duration-200 text-white select-none overflow-hidden animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`File preview for ${currentFile.name}`}
    >
      {/* Top Compact Bar */}
      <header className="h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between border-b border-white/10 bg-[#0B0B0E]/80 backdrop-blur-md z-30 shrink-0 gap-2 sm:gap-4 select-none">
        {/* Left: File Icon + Name + Size + Collection Counter */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {renderHeaderIcon()}

          <div className="flex items-center gap-2 min-w-0">
            <h2
              className="text-sm sm:text-base font-semibold text-white tracking-tight truncate max-w-[180px] xs:max-w-[240px] sm:max-w-md md:max-w-lg lg:max-w-xl"
              title={currentFile.name}
            >
              {currentFile.name}
            </h2>

            {typeof currentFile.size === 'number' && currentFile.size > 0 && (
              <span className="hidden sm:inline-flex text-[11px] text-white/60 bg-white/10 px-2 py-0.5 rounded-full font-medium shrink-0">
                {formatBytes(currentFile.size)}
              </span>
            )}

            {hasMultipleFiles && currentIndex !== -1 && (
              <span className="hidden md:inline-flex text-[11px] text-white/75 bg-white/10 px-2.5 py-0.5 rounded-full font-medium shrink-0 tracking-wide">
                {currentIndex + 1} of {fileCollection.length}
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions (Open in Tab, Download, Close) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {blobUrl && (
            <button
              type="button"
              onClick={handleOpenInNewTab}
              className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E60EE]"
              title="Open in new tab"
              aria-label="Open in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open in tab</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDownload}
            className="h-8 sm:h-9 px-3 sm:px-3.5 rounded-lg text-xs sm:text-sm font-semibold bg-[#6E60EE] hover:bg-[#6052E6] text-white flex items-center gap-1.5 shadow-md shadow-[#6E60EE]/20 transition-all duration-150 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E60EE]"
            title="Download file"
            aria-label="Download file"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="font-semibold">Download</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 active:scale-95 transition-all cursor-pointer ml-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E60EE]"
            title="Close preview (Esc)"
            aria-label="Close preview"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Main Preview Canvas Area */}
      <main
        className="flex-1 w-full h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] flex items-center justify-center p-2 sm:p-6 md:p-10 relative overflow-hidden select-none"
        onClick={e => {
          // If clicking background backdrop, close modal
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        {/* Floating Previous Navigation Button */}
        {hasMultipleFiles && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              handlePrev()
            }}
            className="fixed left-2 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-[#6E60EE] border border-white/15 text-white/90 hover:text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E60EE]"
            title="Previous file (Left Arrow)"
            aria-label="Previous file"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Floating Next Navigation Button */}
        {hasMultipleFiles && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              handleNext()
            }}
            className="fixed right-2 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-[#6E60EE] border border-white/15 text-white/90 hover:text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E60EE]"
            title="Next file (Right Arrow)"
            aria-label="Next file"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Content Viewer based on File Category */}
        <div
          className="w-full h-full flex items-center justify-center relative overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 p-8 text-white/60">
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-[#6E60EE]" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/80">
                Loading preview...
              </span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-4 p-8 text-center max-w-md bg-[#121218]/90 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md">
              <div className="w-12 h-12 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">Preview unavailable</h3>
                <p className="text-xs text-white/60 mt-1">{error}</p>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="mt-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[#6E60EE] hover:bg-[#6052E6] text-white flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download file to view
              </button>
            </div>
          ) : (
            <>
              {/* 1. IMAGE PREVIEW */}
              {category === 'image' && blobUrl && (
                <div className="w-full h-full flex flex-col items-center justify-center relative select-none">
                  <div className="relative max-h-[80vh] max-w-[88vw] flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blobUrl}
                      alt={currentFile.name}
                      style={{
                        transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                        transition: 'transform 200ms cubic-bezier(0.2, 0, 0, 1)'
                      }}
                      className="max-h-[78vh] sm:max-h-[82vh] max-w-[88vw] object-contain rounded-lg shadow-2xl select-none"
                    />
                  </div>

                  {/* Floating Image Controls Pill */}
                  <div className="absolute bottom-3 sm:bottom-4 z-20 flex items-center gap-1 bg-[#15151F]/80 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full shadow-2xl text-white/80">
                    <button
                      type="button"
                      onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.25))}
                      disabled={zoomLevel <= 0.5}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      title="Zoom out"
                      aria-label="Zoom out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono font-medium px-1 min-w-[36px] text-center">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(z => Math.min(3, z + 0.25))}
                      disabled={zoomLevel >= 3}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      title="Zoom in"
                      aria-label="Zoom in"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-[1px] h-3.5 bg-white/20 mx-1" />
                    <button
                      type="button"
                      onClick={() => setRotation(r => (r + 90) % 360)}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:text-white hover:bg-white/10 transition-colors"
                      title="Rotate 90 degrees"
                      aria-label="Rotate"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    {(zoomLevel !== 1 || rotation !== 0) && (
                      <button
                        type="button"
                        onClick={() => {
                          setZoomLevel(1)
                          setRotation(0)
                        }}
                        className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-white hover:bg-white/25 ml-1 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 2. PDF PREVIEW */}
              {category === 'pdf' && blobUrl && (
                <div className="w-full h-full max-w-5xl flex items-center justify-center">
                  <iframe
                    src={blobUrl}
                    title={currentFile.name}
                    className="w-full h-[78vh] sm:h-[82vh] border-0 rounded-xl shadow-2xl bg-white"
                  />
                </div>
              )}

              {/* 3. VIDEO PREVIEW */}
              {category === 'video' && blobUrl && (
                <div className="w-full h-full flex items-center justify-center p-2">
                  <video
                    src={blobUrl}
                    controls
                    autoPlay={false}
                    playsInline
                    className="max-h-[78vh] sm:max-h-[82vh] max-w-[88vw] rounded-xl shadow-2xl bg-black border border-white/10"
                  >
                    Your browser does not support HTML5 video.
                  </video>
                </div>
              )}

              {/* 4. AUDIO PREVIEW */}
              {category === 'audio' && (
                <div className="w-full max-w-md bg-[#121218]/90 border border-white/15 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl backdrop-blur-md">
                  {/* Glowing Animated Waveform Circle */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#6E60EE]/15 border-2 border-[#6E60EE]/40 flex items-center justify-center text-[#6E60EE] shadow-[0_0_40px_rgba(110,96,238,0.3)] mb-5 relative group">
                    <Music className="w-10 h-10 sm:w-12 sm:h-12" />
                    <div className="absolute inset-0 rounded-full border border-[#6E60EE]/30 animate-ping opacity-30" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-[280px]">
                    {currentFile.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-white/60">
                    <span className="uppercase font-semibold tracking-wider text-[#8E82F8]">
                      {typeInfo.extension || 'AUDIO'}
                    </span>
                    {typeof currentFile.size === 'number' && (
                      <>
                        <span>•</span>
                        <span>{formatBytes(currentFile.size)}</span>
                      </>
                    )}
                  </div>

                  {blobUrl ? (
                    <audio
                      src={blobUrl}
                      controls
                      className="w-full mt-6 accent-[#6E60EE] rounded-lg"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="mt-6 px-4 py-2 rounded-lg text-xs font-semibold bg-[#6E60EE] hover:bg-[#6052E6] text-white flex items-center gap-2 transition-all active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download to play
                    </button>
                  )}
                </div>
              )}

              {/* 5. CODE / TEXT / JSON PREVIEW */}
              {category === 'code' && (
                <div className="w-full max-w-4xl max-h-[78vh] sm:max-h-[82vh] bg-[#0E0E14] border border-[#232330] rounded-xl shadow-2xl flex flex-col overflow-hidden text-left">
                  {/* Code Editor Header */}
                  <div className="h-10 px-4 bg-[#14141D] border-b border-[#232330] flex items-center justify-between shrink-0 select-none">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-mono font-semibold text-white/90">
                        {currentFile.name}
                      </span>
                      <span className="text-[10px] font-mono uppercase bg-cyan-500/15 text-cyan-300 px-1.5 py-0.5 rounded font-bold">
                        {typeInfo.extension || 'TXT'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyText}
                      className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                      title="Copy code to clipboard"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Monospace Code Body */}
                  <div className="flex-1 overflow-auto p-4 sm:p-5 text-xs font-mono text-[#E4E4EB] leading-relaxed select-text bg-[#0E0E14]">
                    <pre className="whitespace-pre-wrap break-words font-mono">
                      <code>{textContent ?? 'Loading text contents...'}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* 6. DOCUMENT PREVIEW (Word, Excel, PPT, etc.) */}
              {category === 'document' && (
                <div className="w-full max-w-md bg-[#121218]/90 border border-white/15 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl backdrop-blur-md">
                  <div className={cn('w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl mb-4', typeInfo.bgClass, typeInfo.colorClass)}>
                    {typeInfo.docType === 'sheet' ? (
                      <FileSpreadsheet className="w-10 h-10" />
                    ) : typeInfo.docType === 'slide' ? (
                      <Presentation className="w-10 h-10" />
                    ) : (
                      <FileText className="w-10 h-10" />
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-[280px]">
                    {currentFile.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-1.5 text-xs text-white/60">
                    <span className="uppercase font-semibold tracking-wider text-[#8E82F8]">
                      {typeInfo.extension?.toUpperCase() || 'DOCUMENT'}
                    </span>
                    {typeof currentFile.size === 'number' && (
                      <>
                        <span>•</span>
                        <span>{formatBytes(currentFile.size)}</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-white/60 mt-3 max-w-[280px] leading-relaxed">
                    This document format is ready to download or view in your desktop application.
                  </p>

                  <div className="flex items-center gap-3 mt-6">
                    {blobUrl && (
                      <button
                        type="button"
                        onClick={handleOpenInNewTab}
                        className="px-3.5 py-2 rounded-lg text-xs font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
                      >
                        Open in tab
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#6E60EE] hover:bg-[#6052E6] text-white flex items-center gap-2 shadow-md shadow-[#6E60EE]/25 transition-all active:scale-95 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download document
                    </button>
                  </div>
                </div>
              )}

              {/* 7. ARCHIVE & UNSUPPORTED BINARY FORMATS */}
              {(category === 'archive' || category === 'other') && (
                <div className="w-full max-w-md bg-[#121218]/90 border border-white/15 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl backdrop-blur-md">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white/70 shadow-xl mb-4">
                    {category === 'archive' ? (
                      <Archive className="w-9 h-9 text-amber-400" />
                    ) : (
                      <FileQuestion className="w-9 h-9 text-white/60" />
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-[280px]">
                    {currentFile.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-1.5 text-xs text-white/60">
                    <span className="uppercase font-semibold tracking-wider text-[#8E82F8]">
                      {typeInfo.extension?.toUpperCase() || 'FILE'}
                    </span>
                    {typeof currentFile.size === 'number' && (
                      <>
                        <span>•</span>
                        <span>{formatBytes(currentFile.size)}</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-white/60 mt-3 max-w-[300px] leading-relaxed">
                    Preview is not available for this file type in the browser. You can download the file to open it with your local software.
                  </p>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="mt-6 px-4 py-2 rounded-lg text-xs font-semibold bg-[#6E60EE] hover:bg-[#6052E6] text-white flex items-center gap-2 shadow-md shadow-[#6E60EE]/25 transition-all active:scale-95 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download file ({typeInfo.extension?.toUpperCase() || 'FILE'})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
