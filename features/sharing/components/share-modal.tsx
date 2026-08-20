'use client';

import React, { useState } from 'react';
import { useApp } from '../../../providers/app-provider';
import { Dialog } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

export function ShareModal() {
  const { activeModal, setActiveModal, selectedFileId, files, shareFile } = useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const isOpen = activeModal === 'share';

  const selectedFile = files.find(f => f.id === selectedFileId);

  const handleClose = () => {
    setEmail('');
    setError('');
    setActiveModal(null);
  };

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    if (selectedFileId) {
      shareFile(selectedFileId, [email.trim()]);
      alert(`Shared "${selectedFile?.name || 'File'}" successfully with ${email.trim()}`);
      handleClose();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Share Resource">
      <div className="flex flex-col gap-4 pt-2">
        {selectedFile && (
          <div className="flex items-center gap-3 p-3 bg-background border border-card-border rounded-xl">
            <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-foreground truncate uppercase tracking-[0.5px]">
                {selectedFile.name}
              </span>
              <span className="text-[10px] font-light text-text-muted">
                Owner: {selectedFile.owner}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleShare} className="flex flex-col gap-4">
          <Input
            label="Collaborator Email"
            type="email"
            placeholder="colleague@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            error={error}
            autoFocus
          />

          {selectedFile?.sharedWith && selectedFile.sharedWith.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#7e7e7e]">
                Shared With
              </span>
              <div className="flex flex-col gap-1 max-h-24 overflow-y-auto bg-background p-2 border border-card-border rounded-xl">
                {selectedFile.sharedWith.map((sh, idx) => (
                  <div key={idx} className="text-xs font-light text-text-secondary truncate">
                    {sh}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="h-10 text-[10px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="h-10 text-[10px]"
            >
              Share Access
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
