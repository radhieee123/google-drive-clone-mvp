export interface FileItem {
  id: string;
  fileName: string;
  fileLink: string;
  fileExtension?: string;
  folderName?: string;
  folderId?: string;
  isFolder?: boolean;
  isStarred?: boolean;
  isTrashed?: boolean;
}
export interface File {
  folderId: string;
  select: string;
}
