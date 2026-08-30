'use client';

import React, { useState } from 'react';
import { useApp } from '../../../providers/app-provider';
import { Dialog } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { FileType } from '../../../types';

export function UploadModal() {
  const { activeModal, setActiveModal, uploadFile, createFolder, files } = useApp();

  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<FileType>('pdf');
  const [fileSizeStr, setFileSizeStr] = useState('2.5'); // in MB
  const [folderName, setFolderName] = useState('');

  const [error, setError] = useState('');

  const isFileOpen = activeModal === 'upload-file';
  const isFolderOpen = activeModal === 'upload-folder';

  const handleClose = () => {
    setFileName('');
    setFileType('pdf');
    setFileSizeStr('2.5');
    setFolderName('');
    setError('');
    setActiveModal(null);
  };

  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) {
      setError('File name is required');
      return;
    }

    const size = parseFloat(fileSizeStr) * 1024 * 1024; // convert MB to bytes
    if (isNaN(size) || size <= 0) {
      setError('Invalid file size');
      return;
    }

    uploadFile(fileName.trim(), size, fileType);
    handleClose();
  };

  const handleUploadFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) {
      setError('Folder name is required');
      return;
    }

    // Creating folder
    const newFolderId = createFolder(folderName.trim());

    // We can simulate adding files inside this folder after creation
    // To do this, we can search for the folder we just created and add files to it.
    // However, our provider handles `createFolder` with `activeFolderId`.
    // Let's add a couple of mock files directly into this new folder by manually invoking uploadFile
    setTimeout(() => {
      // Find the folder we just added (usually the first folder in files with that name)
      // Since it's mock, we will just call uploadFile with that folder ID
      uploadFile('Asset_Logo.png', 1.4 * 1024 * 1024, 'image', newFolderId);
      uploadFile('Overview_Docs.pdf', 3.2 * 1024 * 1024, 'pdf', newFolderId);
    }, 100);

    handleClose();
  };

  if (isFileOpen) {
    return (
      <Dialog isOpen={isFileOpen} onClose={handleClose} title="Upload New File">
        <form onSubmit={handleUploadFile} className="flex flex-col gap-4 pt-2">
          <Input
            label="File Name"
            placeholder="e.g. Q4 Presentation.pptx, logo.png"
            value={fileName}
            onChange={(e) => {
              setFileName(e.target.value);
              if (error) setError('');
            }}
            error={error}
            autoFocus
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#7e7e7e]">
              File Type
            </label>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value as FileType)}
              className="w-full bg-input-bg text-foreground border border-card-border rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-[1px] focus:outline-none focus:border-[#0056f7] focus:ring-2 focus:ring-[#0056f7]/10 cursor-pointer"
            >
              <option value="pdf">PDF Document</option>
              <option value="document">Word Document (.docx/.pptx)</option>
              <option value="image">Image File</option>
              <option value="video">Video File</option>
              <option value="other">Other Assets</option>
            </select>
          </div>

          <Input
            label="File Size (MB)"
            type="number"
            step="0.1"
            min="0.1"
            placeholder="e.g. 2.5, 35.6"
            value={fileSizeStr}
            onChange={(e) => setFileSizeStr(e.target.value)}
          />

          <div className="flex justify-end gap-3 mt-4">
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
              Upload File
            </Button>
          </div>
        </form>
      </Dialog>
    );
  }

  if (isFolderOpen) {
    return (
      <Dialog isOpen={isFolderOpen} onClose={handleClose} title="Upload Local Folder">
        <form onSubmit={handleUploadFolder} className="flex flex-col gap-5 pt-2">
          <Input
            label="Folder Name"
            placeholder="e.g. Marketing Collaterals, Code"
            value={folderName}
            onChange={(e) => {
              setFolderName(e.target.value);
              if (error) setError('');
            }}
            error={error}
            autoFocus
          />

          <div className="bg-[#0d0d0d] border border-[#262626] p-4 text-[11px] text-[#bbbbbb] leading-normal font-light">
            <span className="font-bold text-white uppercase tracking-[0.5px]">Simulation Notice:</span>
            <br />
            Uploading a folder will create a directory in your current workspace and automatically bundle two starter files inside it (`Asset_Logo.png` and `Overview_Docs.pdf`) to demonstrate folder depth navigation.
          </div>

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
              Upload Folder
            </Button>
          </div>
        </form>
      </Dialog>
    );
  }

  return null;
}
