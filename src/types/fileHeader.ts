export interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
}

export interface FileHeaderType {
  headerName?: string;
  breadcrumbs?: BreadcrumbItem[];
}
