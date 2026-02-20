import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FileDropzone } from '../components/common/FileDropzone';
import { PageThumbnail } from '../components/common/PageThumbnail';
import { PdfOperationResult } from '../components/pdf/PdfOperationResult';
import { getPageCount, splitPdf } from '../lib/pdf';

export function SplitPage() {
  const { t } = useTranslation();
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [splitPoints, setSplitPoints] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<Uint8Array[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    async (files: File[]) => {
      const file = files[0];
      try {
        setError(null);
        const buffer = await file.arrayBuffer();
        const count = await getPageCount(buffer);
        setPdfData(buffer);
        setFileName(file.name);
        setPageCount(count);
        setSplitPoints(new Set());
        setResults(null);
      } catch {
        setError(t('errors.loadFailed'));
      }
    },
    [t],
  );

  const toggleSplitPoint = (afterPage: number) => {
    setSplitPoints((prev) => {
      const next = new Set(prev);
      if (next.has(afterPage)) next.delete(afterPage);
      else next.add(afterPage);
      return next;
    });
  };

  const handleSplit = async () => {
    if (!pdfData || splitPoints.size === 0) return;
    setIsProcessing(true);
    try {
      const parts = await splitPdf(pdfData, [...splitPoints]);
      setResults(parts);
    } catch {
      setError(t('errors.processingFailed'));
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setPdfData(null);
    setFileName('');
    setPageCount(0);
    setSplitPoints(new Set());
    setResults(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('split.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('split.description')}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {!pdfData && <FileDropzone onFilesAccepted={handleFiles} />}

      {pdfData && !results && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('split.resultCount', { count: splitPoints.size + 1 })}
          </p>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
              <div key={page} className="relative">
                <PageThumbnail
                  pdfData={pdfData}
                  pageNumber={page}
                  isSelected={false}
                  showCheckbox={false}
                />
                {page < pageCount && (
                  <button
                    onClick={() => toggleSplitPoint(page)}
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
                      splitPoints.has(page)
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-700'
                    }`}
                    title={t('pages.splitAfter', { page })}
                  >
                    {splitPoints.has(page) ? '✂' : '···'}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSplit}
              disabled={splitPoints.size === 0 || isProcessing}
              className="px-6 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing
                ? t('actions.processing')
                : `${t('actions.split')} (${splitPoints.size + 1} Teile)`}
            </button>
            <button
              onClick={reset}
              className="px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {t('actions.reset')}
            </button>
          </div>
        </div>
      )}

      {results && (
        <PdfOperationResult
          results={results}
          originalName={fileName}
          operation="split"
          onReset={reset}
        />
      )}
    </div>
  );
}
