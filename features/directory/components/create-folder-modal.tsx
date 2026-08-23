'use client';

import React, { useState } from 'react';
import { useApp } from '../../../providers/app-provider';
import { Dialog } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

export function CreateFolderModal() {
  const { activeModal, setActiveModal, createFolder } = useApp();
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState('');

  const isOpen = activeModal === 'create-folder';

  const handleClose = () => {
    setFolderName('');
    setError('');
    setActiveModal(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) {
      setError('Folder name is required');
      return;
    }
    createFolder(folderName.trim());
    handleClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Create New Folder">
      <form onSubmit={handleCreate} className="flex flex-col gap-5 pt-2">
        <Input
          label="Folder Name"
          placeholder="e.g. Design Assets, Documents"
          value={folderName}
          onChange={(e) => {
            setFolderName(e.target.value);
            if (error) setError('');
          }}
          error={error}
          autoFocus
        />

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
            Create
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
