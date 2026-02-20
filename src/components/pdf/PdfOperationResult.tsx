import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { saveFile } from '../../lib/storage/local';
import { generateThumbnail, getPageCount } from '../../lib/pdf/thumbnails';
import type { PdfOperation } from '../../types/pdf';

interface PdfOperationResultProps {
  results: Uint8Array[];
  originalName: string;
  operation: PdfOperation;
  onReset: () => void;
}

function downloadBlob(data: Uint8Array, filename: string) {
  const blob = new Blob([data], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function PdfOperationResult({
  results,
  originalName,
  operation,
  onReset,
}: PdfOperationResultProps) {
  const { t } = useTranslation();
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved'
  >('idle');
  const baseName = originalName.replace(/\.pdf$/i, '');

  const getFilename = (index: number) => {
    if (results.length === 1) return `${baseName}_${operation}.pdf`;
    return `${baseName}_${operation}_${index + 1}.pdf`;
  };

  const handleDownload = (index: number) => {
    downloadBlob(results[index], getFilename(index));
  };

  const handleDownloadAll = () => {
    results.forEach((_, i) => handleDownload(i));
  };

  const handleSave = async (index: number) => {
    setSaveStatus('saving');
    try {
      const data = results[index].buffer as ArrayBuffer;
      const pageCount = await getPageCount(data);
      const thumbnail = await generateThumbnail(data, 1, 0.3);

      await saveFile({
        name: getFilename(index),
        data,
        pageCount,
        thumbnail,
        operation,
        createdAt: new Date(),
        sizeBytes: results[index].byteLength,
        cloudSynced: false,
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('idle');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <p className="font-medium text-green-800 dark:text-green-300">
            {results.length === 1
              ? getFilename(0)
              : t('split.resultCount', { count: results.length })}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            {(results.reduce((s, r) => s + r.byteLength, 0) / 1024).toFixed(0)}{' '}
            KB
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {results.length === 1 ? (
          <>
            <button
              onClick={() => handleDownload(0)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              {t('actions.download')}
            </button>
            <button
              onClick={() => handleSave(0)}
              disabled={saveStatus !== 'idle'}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium disabled:opacity-50"
            >
              {saveStatus === 'saving'
                ? t('storage.savingLocal')
                : saveStatus === 'saved'
                  ? t('storage.saved')
                  : t('actions.save')}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleDownloadAll}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              {t('actions.downloadAll')}
            </button>
            {results.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDownload(i)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                Teil {i + 1}
              </button>
            ))}
          </>
        )}
      </div>

      <button
        onClick={onReset}
        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        {t('actions.reset')}
      </button>
    </div>
  );
}
