'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useFiles } from '@/features/files/hooks/use-files'
import { formatBytes } from '@/lib/utils/format'
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
  FileQuestion
} from 'lucide-react'

export interface PreviewableFile {
  id?: string
  _id?: string
  name: string
  extension?: string
  size?: number
}

interface FilePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  file: PreviewableFile | null
}

type PreviewCategory = 'image' | 'pdf' | 'video' | 'audio' | 'text' | 'unsupported'

function getFileCategory(filename: string, ext?: string, mimeType?: string): PreviewCategory {
  const extension = (ext || filename.split('.').pop() || '').replace('.', '').toLowerCase()

  if (mimeType?.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico', 'bmp'].includes(extension)) {
    return 'image'
  }
  if (mimeType === 'application/pdf' || extension === 'pdf') {
    return 'pdf'
  }
  if (mimeType?.startsWith('video/') || ['mp4', 'webm', 'ogg', 'mov', 'mkv', 'avi'].includes(extension)) {
    return 'video'
  }
  if (mimeType?.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(extension)) {
    return 'audio'
  }
  if (
    mimeType?.startsWith('text/') ||
    mimeType === 'application/json' ||
    ['txt', 'md', 'js', 'jsx', 'ts', 'tsx', 'json', 'html', 'css', 'scss', 'py', 'java', 'c', 'cpp', 'rs', 'go', 'php', 'sql', 'csv', 'log', 'env', 'yml', 'yaml', 'xml', 'sh'].includes(extension)
  ) {
    return 'text'
  }
  return 'unsupported'
}

export function FilePreviewModal({ isOpen, onClose, file }: FilePreviewModalProps) {
  const { getBlob, download } = useFiles()

  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [textContent, setTextContent] = useState<string | null>(null)
  const [blobType, setBlobType] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fileId = file?.id || file?._id

  useEffect(() => {
    if (!isOpen || !fileId || !file) {
      setBlobUrl(prev => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      setTextContent(null)
      setError(null)
      setIsLoading(false)
      return
    }

    let isSubscribed = true
    let createdUrl: string | null = null

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

        const category = getFileCategory(file.name, file.extension, blob.type)
        if (category === 'text') {
          const text = await blob.text()
          if (isSubscribed) {
            setTextContent(text)
          }
        }
      } catch (err) {
        if (isSubscribed) {
          console.error('Failed to load file preview:', err)
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
  }, [isOpen, fileId, file, getBlob])

  const category = useMemo(() => {
    if (!file) return 'unsupported'
    return getFileCategory(file.name, file.extension, blobType)
  }, [file, blobType])

  const handleDownload = () => {
    if (fileId && file) {
      download(fileId, file.name)
    }
  }

  const handleOpenInNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, '_blank')
    }
  }

  if (!file) return null

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-4xl"
      className="p-4 sm:p-6"
    >
      <div className="flex flex-col gap-4">
        {/* Modal Top Info Bar */}
        <div className="flex items-center justify-between border-b border-card-border pb-3 -mt-1 select-none flex-wrap gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-[#6E60EE]/10 text-[#6E60EE] flex items-center justify-center shrink-0">
              {category === 'image' && <ImageIcon className="w-4 h-4" />}
              {category === 'pdf' && <FileText className="w-4 h-4 text-rose-500" />}
              {category === 'video' && <VideoIcon className="w-4 h-4 text-purple-500" />}
              {category === 'audio' && <Music className="w-4 h-4 text-amber-500" />}
              {category === 'text' && <Code className="w-4 h-4 text-cyan-500" />}
              {category === 'unsupported' && <FileIcon className="w-4 h-4 text-text-secondary" />}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-foreground truncate" title={file.name}>
                {file.name}
              </span>
              {typeof file.size === 'number' && file.size > 0 && (
                <span className="text-[11px] text-text-secondary">
                  {formatBytes(file.size)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {blobUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
                className="h-8 px-2.5 text-[11px] flex items-center gap-1.5"
                title="Open in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Open in Tab</span>
              </Button>
            )}
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleDownload}
              className="h-8 px-3 text-[11px] bg-[#6E60EE] hover:bg-[#6052E6] text-white flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </Button>
          </div>
        </div>

        {/* Modal Main Preview Content Area */}
        <div className="w-full min-h-[300px] max-h-[70vh] flex items-center justify-center bg-input-bg/40 border border-card-border rounded-xl overflow-hidden relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-text-muted">
              <Loader2 className="w-7 h-7 animate-spin text-[#6E60EE]" />
              <span className="text-xs font-semibold">Loading preview...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-xs text-rose-500 font-medium">{error}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="mt-2 text-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download file to view
              </Button>
            </div>
          ) : blobUrl ? (
            <>
              {/* IMAGE PREVIEW */}
              {category === 'image' && (
                <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 overflow-auto max-h-[70vh]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={blobUrl}
                    alt={file.name}
                    className="max-h-[65vh] max-w-full object-contain rounded-lg shadow-xs select-none"
                  />
                </div>
              )}

              {/* PDF PREVIEW */}
              {category === 'pdf' && (
                <iframe
                  src={blobUrl}
                  title={file.name}
                  className="w-full h-[65vh] border-0 rounded-lg bg-white"
                />
              )}

              {/* VIDEO PREVIEW */}
              {category === 'video' && (
                <div className="w-full h-full flex items-center justify-center p-2 bg-black/80">
                  <video
                    src={blobUrl}
                    controls
                    autoPlay={false}
                    className="max-h-[65vh] max-w-full rounded-lg shadow-lg"
                  >
                    Your browser does not support HTML5 video.
                  </video>
                </div>
              )}

              {/* AUDIO PREVIEW */}
              {category === 'audio' && (
                <div className="w-full flex flex-col items-center justify-center p-8 gap-5 max-w-md mx-auto">
                  <div className="w-20 h-20 rounded-full bg-[#6E60EE]/10 border border-[#6E60EE]/30 flex items-center justify-center text-[#6E60EE] shadow-sm animate-pulse">
                    <Music className="w-9 h-9" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-bold text-foreground truncate max-w-[280px]">
                      {file.name}
                    </h4>
                    <p className="text-xs text-text-secondary mt-0.5">Audio playback</p>
                  </div>
                  <audio src={blobUrl} controls className="w-full mt-2" />
                </div>
              )}

              {/* TEXT / CODE PREVIEW */}
              {category === 'text' && (
                <div className="w-full h-full max-h-[65vh] overflow-auto p-4 bg-[#0d0d0d] text-[#e0e0e0] font-mono text-xs leading-relaxed select-text">
                  <pre className="whitespace-pre-wrap break-words font-mono">
                    <code>{textContent ?? 'Loading file contents...'}</code>
                  </pre>
                </div>
              )}

              {/* UNSUPPORTED BINARY FORMAT */}
              {category === 'unsupported' && (
                <div className="flex flex-col items-center justify-center gap-3 p-8 text-center max-w-sm">
                  <div className="w-14 h-14 rounded-2xl bg-input-bg border border-card-border flex items-center justify-center text-text-secondary mb-1">
                    <FileQuestion className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground">
                    Preview not available
                  </h4>
                  <p className="text-xs text-text-secondary leading-normal">
                    This file format cannot be previewed directly in the browser. You can download the file to open it with your device application.
                  </p>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleDownload}
                    className="mt-2 bg-[#6E60EE] hover:bg-[#6052E6] text-white flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download file ({file.name.split('.').pop()?.toUpperCase() || 'FILE'})</span>
                  </Button>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </Dialog>
  )
}
