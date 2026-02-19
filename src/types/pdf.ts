export interface PdfFile {
  id: string;
  name: string;
  data: ArrayBuffer;
  pageCount: number;
  thumbnails: Map<number, string>;
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  error: string | null;
}

export type PdfOperation = 'merge' | 'split' | 'extract' | 'trim';
