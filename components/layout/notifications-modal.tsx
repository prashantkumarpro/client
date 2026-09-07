'use client'

import React from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Bell, HardDrive, FileText, Share2, Check } from 'lucide-react'

export interface NotificationsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const notifications = [
    {
      id: '1',
      title: 'New shared resource',
      message: 'Prashant shared "Q3 Financial Review.pdf" with you',
      time: '10 minutes ago',
      icon: <Share2 className="w-4 h-4 text-[#6E60EE]" />,
      unread: true,
    },
    {
      id: '2',
      title: 'Storage threshold update',
      message: 'Your cloud storage reached 72% of allocated capacity',
      time: '2 hours ago',
      icon: <HardDrive className="w-4 h-4 text-amber-500" />,
      unread: true,
    },
    {
      id: '3',
      title: 'Upload completed',
      message: '"Brand Guidelines 2026.zip" was successfully uploaded to Design Assets',
      time: '1 day ago',
      icon: <FileText className="w-4 h-4 text-emerald-500" />,
      unread: false,
    },
  ]

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications"
      description="Recent workspace alerts and file updates"
      maxWidth="max-w-[440px]"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col divide-y divide-card-border/50 border border-card-border rounded-xl bg-card-bg max-h-72 overflow-y-auto">
          {notifications.map(item => (
            <div key={item.id} className="flex items-start gap-3 p-3.5 hover:bg-input-bg/40 transition-colors">
              <div className="w-8 h-8 rounded-full bg-input-bg flex items-center justify-center shrink-0 mt-0.5">
                {item.icon}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    {item.title}
                  </span>
                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-[#6E60EE] shrink-0" />
                  )}
                </div>
                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                  {item.message}
                </p>
                <span className="text-[10px] text-text-muted mt-1">
                  {item.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-card-border/60">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-9 px-3 text-xs font-semibold text-text-secondary hover:text-[#6E60EE] hover:bg-[#6E60EE]/10 flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onClose}
            className="h-9 px-4 text-xs font-semibold bg-[#6E60EE] hover:bg-[#6052E6] text-white shadow-xs"
          >
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
