export interface DriveFile {
  id: string;
  fileName: string;
  fileExtension: string;
  fileLink: string;
  isStarred: boolean;
  isTrashed: boolean;
  folderId?: string;
  createdAt?: string;
  updatedAt?: string;
  size?: number;
  ownerId?: string;
}

export interface DriveFolder {
  id: string;
  folderName: string;
  isStarred: boolean;
  isTrashed: boolean;
  parentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  ownerId?: string;
}

export interface FileDropDownItem {
  folderName: string;
  isFolder: boolean;
  isStarred: boolean;
  isTrashed: boolean;
  id: string;
  fileLink: string;
  fileName: string;
  fileExtension: string;
  folderId: string;
}

export interface GetFilesResponse {
  files: DriveFile[];
  folders: DriveFolder[];
}
