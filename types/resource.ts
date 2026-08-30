export interface FreeResource {
  id: string;
  title: string;
  slug: string;
  description: string;
  fileSize: string;
  format: string;
  badge: string;
  category?: string;
  thumbnail?: string;
  tags?: string[];
  features?: string[];
  downloadUrl: string;
  downloadsCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}
