import { FileItem, ActivityItem, StorageStats } from '../../types';

// In bytes:
// 1 KB = 1024
// 1 MB = 1024 * 1024
// 1 GB = 1024 * 1024 * 1024

export const INITIAL_FILES: FileItem[] = [
  {
    id: 'file-1',
    name: 'Project Proposal.pdf',
    type: 'pdf',
    size: 2.4 * 1024 * 1024, // 2.4 MB
    parentFolderId: null,
    starred: false,
    deleted: false,
    createdAt: '2026-08-19T10:30:00Z',
    updatedAt: '2026-08-19T10:30:00Z',
    owner: 'Prashant',
  },
  {
    id: 'file-2',
    name: 'IMG_2024_0831.jpg',
    type: 'image',
    size: 4.1 * 1024 * 1024, // 4.1 MB
    parentFolderId: null,
    starred: false,
    deleted: false,
    createdAt: '2026-08-18T16:21:00Z',
    updatedAt: '2026-08-18T16:21:00Z',
    owner: 'Prashant',
  },
  {
    id: 'file-3',
    name: 'Product Roadmap.docx',
    type: 'document',
    size: 1.2 * 1024 * 1024, // 1.2 MB
    parentFolderId: null,
    starred: true,
    deleted: false,
    createdAt: '2026-08-17T11:00:00Z',
    updatedAt: '2026-08-17T11:00:00Z',
    owner: 'Prashant',
  },
  {
    id: 'file-4',
    name: 'Marketing Video.mp4',
    type: 'video',
    size: 35.6 * 1024 * 1024, // 35.6 MB
    parentFolderId: null,
    starred: false,
    deleted: false,
    createdAt: '2026-08-16T10:00:00Z',
    updatedAt: '2026-08-16T10:00:00Z',
    owner: 'Prashant',
  },
  {
    id: 'folder-1',
    name: 'Design Assets',
    type: 'folder',
    size: -1, // Folders size is represented as -1
    parentFolderId: null,
    starred: false,
    deleted: false,
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-08-15T09:00:00Z',
    owner: 'Prashant',
  },
  // Files inside the 'Design Assets' folder for mock navigation depth
  {
    id: 'file-5',
    name: 'Logo Source.ai',
    type: 'other',
    size: 14.2 * 1024 * 1024, // 14.2 MB
    parentFolderId: 'folder-1',
    starred: true,
    deleted: false,
    createdAt: '2026-08-15T09:15:00Z',
    updatedAt: '2026-08-15T09:15:00Z',
    owner: 'Prashant',
  },
  {
    id: 'file-6',
    name: 'Banner Template.psd',
    type: 'image',
    size: 28.9 * 1024 * 1024, // 28.9 MB
    parentFolderId: 'folder-1',
    starred: false,
    deleted: false,
    createdAt: '2026-08-15T09:20:00Z',
    updatedAt: '2026-08-15T09:20:00Z',
    owner: 'Prashant',
  },
  // Some mock files in Shared and Trash
  {
    id: 'file-shared-1',
    name: 'Brand Guidelines.pdf',
    type: 'pdf',
    size: 8.5 * 1024 * 1024,
    parentFolderId: null,
    starred: false,
    deleted: false,
    createdAt: '2026-08-18T15:00:00Z',
    updatedAt: '2026-08-18T15:00:00Z',
    owner: 'Ananya Sharma',
    sharedWith: ['Prashant'],
  },
  {
    id: 'file-deleted-1',
    name: 'Old Presentation.pptx',
    type: 'document',
    size: 15.4 * 1024 * 1024,
    parentFolderId: null,
    starred: false,
    deleted: true,
    createdAt: '2026-08-10T12:00:00Z',
    updatedAt: '2026-08-16T12:00:00Z',
    owner: 'Prashant',
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'upload',
    details: 'Project Proposal.pdf and 2 more',
    timestamp: '2026-08-19T10:30:00Z',
    user: 'Prashant',
    assetName: 'Project Proposal.pdf',
  },
  {
    id: 'act-2',
    type: 'share',
    details: 'Brand Guidelines.pdf',
    timestamp: '2026-08-18T15:00:00Z',
    user: 'Ananya Sharma',
    assetName: 'Brand Guidelines.pdf',
  },
  {
    id: 'act-3',
    type: 'create_folder',
    details: 'Design Assets',
    timestamp: '2026-08-18T09:00:00Z',
    user: 'Prashant',
    assetName: 'Design Assets',
  },
  {
    id: 'act-4',
    type: 'star',
    details: 'Product Roadmap.docx',
    timestamp: '2026-08-17T11:00:00Z',
    user: 'Prashant',
    assetName: 'Product Roadmap.docx',
  },
  {
    id: 'act-5',
    type: 'delete',
    details: 'Old Presentation.pptx',
    timestamp: '2026-08-16T12:00:00Z',
    user: 'Prashant',
    assetName: 'Old Presentation.pptx',
  },
];

export const INITIAL_STORAGE: StorageStats = {
  documents: 28 * 1024 * 1024 * 1024, // 28 GB
  images: 22 * 1024 * 1024 * 1024, // 22 GB
  videos: 12 * 1024 * 1024 * 1024, // 12 GB
  other: 10 * 1024 * 1024 * 1024, // 10 GB
  totalUsed: 72 * 1024 * 1024 * 1024, // 72 GB
  totalCapacity: 100 * 1024 * 1024 * 1024, // 100 GB
};
