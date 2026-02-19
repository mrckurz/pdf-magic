import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileDropzone } from '../components/common/FileDropzone';
import { PdfOperationResult } from '../components/pdf/PdfOperationResult';
import { getPageCount, mergePdfs } from '../lib/pdf';

interface MergeFile {
  id: string;
  name: string;
  data: ArrayBuffer;
  pageCount: number;
}

function SortableFileItem({
  file,
  onRemove,
}: {
  file: MergeFile;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>
      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-primary font-bold text-xs">PDF</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{file.pageCount} Seiten</p>
      </div>
      <button
        onClick={onRemove}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function MergePage() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<MergeFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleFiles = useCallback(
    async (newFiles: File[]) => {
      setError(null);
      try {
        const loaded: MergeFile[] = [];
        for (const file of newFiles) {
          const buffer = await file.arrayBuffer();
          const count = await getPageCount(buffer);
          loaded.push({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            name: file.name,
            data: buffer,
            pageCount: count,
          });
        }
        setFiles((prev) => [...prev, ...loaded]);
      } catch {
        setError(t('errors.loadFailed'));
      }
    },
    [t],
  );

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFiles((prev) => {
        const oldIndex = prev.findIndex((f) => f.id === active.id);
        const newIndex = prev.findIndex((f) => f.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const merged = await mergePdfs(files.map((f) => f.data));
      setResult(merged);
    } catch {
      setError(t('errors.processingFailed'));
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
  };

  const totalPages = files.reduce((s, f) => s + f.pageCount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('merge.title')}</h1>
        <p className="text-gray-500 mt-1">{t('merge.description')}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {!result && (
        <div className="space-y-4">
          <FileDropzone onFilesAccepted={handleFiles} multiple />

          {files.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {t('merge.filesLoaded', { count: files.length })} ·{' '}
                  {totalPages} Seiten
                </p>
                {files.length > 1 && (
                  <p className="text-xs text-gray-400">{t('merge.reorderHint')}</p>
                )}
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={files.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {files.map((file) => (
                      <SortableFileItem
                        key={file.id}
                        file={file}
                        onRemove={() => removeFile(file.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleMerge}
                  disabled={files.length < 2 || isProcessing}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing
                    ? t('actions.processing')
                    : `${t('actions.merge')} (${files.length} PDFs)`}
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('actions.reset')}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {result && (
        <PdfOperationResult
          results={[result]}
          originalName="merged"
          operation="merge"
          onReset={reset}
        />
      )}
    </div>
  );
}
