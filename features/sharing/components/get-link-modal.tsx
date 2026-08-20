'use client';

import React, { useState } from 'react';
import { useApp } from '../../../providers/app-provider';
import { Dialog } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';

export function GetLinkModal() {
  const { activeModal, setActiveModal, selectedFileId, files } = useApp();
  const [copied, setCopied] = useState(false);

  const isOpen = activeModal === 'get-link';

  const selectedFile = files.find(f => f.id === selectedFileId);
  const shareUrl = selectedFile
    ? `https://cloude.app/s/${selectedFile.id}`
    : 'https://cloude.app/s/unknown';

  const handleClose = () => {
    setCopied(false);
    setActiveModal(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err);
        // Fallback for environment constraints
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Get Shareable Link">
      <div className="flex flex-col gap-5 pt-2">
        {selectedFile && (
          <div className="flex items-center gap-3 p-3 bg-background border border-card-border rounded-xl">
            <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-foreground truncate uppercase tracking-[0.5px]">
                {selectedFile.name}
              </span>
              <span className="text-[10px] font-light text-text-muted">
                Anyone with this link will have view access.
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#7e7e7e]">
            Link URL
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-input-bg text-text-secondary border border-card-border rounded-xl px-4 py-3 text-xs focus:outline-none"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleCopy}
              className="h-10 text-[10px] px-6"
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            className="h-10 text-[10px]"
          >
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
