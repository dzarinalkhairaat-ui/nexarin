export interface FreeResource {
  id: string;
  title: string;
  slug: string;
  description: string;
  fileSize: string;
  format: string;
  badge: string;
  downloadUrl: string;
  downloadsCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}
