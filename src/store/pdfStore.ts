import { create } from 'zustand';
import type { PdfFile } from '../types/pdf';

interface PdfStore {
  files: PdfFile[];
  selectedPages: Set<number>;
  isProcessing: boolean;
  error: string | null;

  addFile: (file: PdfFile) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  reorderFiles: (fromIndex: number, toIndex: number) => void;

  togglePage: (page: number) => void;
  setSelectedPages: (pages: Set<number>) => void;
  clearSelection: () => void;

  setProcessing: (state: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const usePdfStore = create<PdfStore>((set) => ({
  files: [],
  selectedPages: new Set(),
  isProcessing: false,
  error: null,

  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  removeFile: (id) =>
    set((state) => ({ files: state.files.filter((f) => f.id !== id) })),
  clearFiles: () => set({ files: [], selectedPages: new Set() }),
  reorderFiles: (fromIndex, toIndex) =>
    set((state) => {
      const files = [...state.files];
      const [moved] = files.splice(fromIndex, 1);
      files.splice(toIndex, 0, moved);
      return { files };
    }),

  togglePage: (page) =>
    set((state) => {
      const next = new Set(state.selectedPages);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return { selectedPages: next };
    }),
  setSelectedPages: (pages) => set({ selectedPages: pages }),
  clearSelection: () => set({ selectedPages: new Set() }),

  setProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      files: [],
      selectedPages: new Set(),
      isProcessing: false,
      error: null,
    }),
}));
