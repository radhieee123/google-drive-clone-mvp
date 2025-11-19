export interface FolderType {
  folderId: string;
  select: string;
}

export interface Folder {
  id: string;
  name: string;
  isTrashed: boolean;
  isStarred?: boolean;
  fileExtension?: string;
  fileLink?: string;
}
