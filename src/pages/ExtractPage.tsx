import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FileDropzone } from '../components/common/FileDropzone';
import { PageThumbnail } from '../components/common/PageThumbnail';
import { PageRangeSelector } from '../components/pdf/PageRangeSelector';
import { PdfOperationResult } from '../components/pdf/PdfOperationResult';
import { getPageCount, extractPages } from '../lib/pdf';

export function ExtractPage() {
  const { t } = useTranslation();
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
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
        setSelectedPages(new Set());
        setResult(null);
      } catch {
        setError(t('errors.loadFailed'));
      }
    },
    [t],
  );

  const togglePage = (page: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedPages(new Set(Array.from({ length: pageCount }, (_, i) => i + 1)));
  };

  const deselectAll = () => setSelectedPages(new Set());

  const handleExtract = async () => {
    if (!pdfData || selectedPages.size === 0) return;
    setIsProcessing(true);
    try {
      const extracted = await extractPages(pdfData, [...selectedPages]);
      setResult(extracted);
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
    setSelectedPages(new Set());
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('extract.title')}</h1>
        <p className="text-gray-500 mt-1">{t('extract.description')}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {!pdfData && <FileDropzone onFilesAccepted={handleFiles} />}

      {pdfData && !result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {t('pages.selected', { count: selectedPages.size })}
              </span>
              <button onClick={selectAll} className="text-sm text-primary hover:underline">
                {t('pages.selectAll')}
              </button>
              <button onClick={deselectAll} className="text-sm text-gray-500 hover:underline">
                {t('pages.deselectAll')}
              </button>
            </div>
            <PageRangeSelector
              totalPages={pageCount}
              onSelectionChange={setSelectedPages}
            />
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
              <PageThumbnail
                key={page}
                pdfData={pdfData}
                pageNumber={page}
                isSelected={selectedPages.has(page)}
                onClick={() => togglePage(page)}
              />
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleExtract}
              disabled={selectedPages.size === 0 || isProcessing}
              className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? t('actions.processing') : t('actions.extract')}
            </button>
            <button
              onClick={reset}
              className="px-4 py-2.5 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t('actions.reset')}
            </button>
          </div>
        </div>
      )}

      {result && (
        <PdfOperationResult
          results={[result]}
          originalName={fileName}
          operation="extract"
          onReset={reset}
        />
      )}
    </div>
  );
}
