export interface StoredPdf {
  id?: number;
  name: string;
  data: ArrayBuffer;
  pageCount: number;
  thumbnail: string;
  operation: string;
  createdAt: Date;
  sizeBytes: number;
  cloudSynced: boolean;
  cloudPath?: string;
}
