import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { db } from '../lib/storage/db';
import { deleteFile } from '../lib/storage/local';
import { useState } from 'react';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: Date, lang: string): string {
  return new Intl.DateTimeFormat(lang, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function MyFilesPage() {
  const { t, i18n } = useTranslation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const files = useLiveQuery(() =>
    db.storedPdfs.orderBy('createdAt').reverse().toArray(),
  );

  const handleDownload = (file: { name: string; data: ArrayBuffer }) => {
    const blob = new Blob([file.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('myFiles.confirmDelete'))) return;
    setDeletingId(id);
    await deleteFile(id);
    setDeletingId(null);
  };

  const operationLabels: Record<string, { label: string; color: string }> = {
    merge: { label: t('nav.merge'), color: 'bg-blue-100 text-blue-700' },
    split: { label: t('nav.split'), color: 'bg-amber-100 text-amber-700' },
    extract: { label: t('nav.extract'), color: 'bg-green-100 text-green-700' },
    trim: { label: t('nav.trim'), color: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('myFiles.title')}</h1>
        <p className="text-gray-500 mt-1">{t('myFiles.description')}</p>
      </div>

      {!files || files.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">{t('myFiles.noFiles')}</p>
          <p className="text-sm text-gray-400 mt-1">{t('myFiles.noFilesHint')}</p>
          <Link
            to="/"
            className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
          >
            {t('actions.backToHome')}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file) => {
            const op = operationLabels[file.operation] || {
              label: file.operation,
              color: 'bg-gray-100 text-gray-700',
            };
            return (
              <div
                key={file.id}
                className={`flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 transition-opacity ${
                  deletingId === file.id ? 'opacity-50' : ''
                }`}
              >
                <div className="w-12 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-50">
                  {file.thumbnail ? (
                    <img
                      src={file.thumbnail}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      PDF
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>{formatBytes(file.sizeBytes)}</span>
                    <span>·</span>
                    <span>{file.pageCount} Seiten</span>
                    <span>·</span>
                    <span>{formatDate(file.createdAt, i18n.language)}</span>
                  </div>
                  <div className="mt-1.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${op.color}`}
                    >
                      {op.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleDownload(file)}
                    className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-50"
                    title={t('actions.download')}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => file.id && handleDelete(file.id)}
                    disabled={deletingId === file.id}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-50"
                    title={t('actions.delete')}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
