import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

interface FileDropzoneProps {
  onFilesAccepted: (files: File[]) => void;
  multiple?: boolean;
  disabled?: boolean;
}

export function FileDropzone({
  onFilesAccepted,
  multiple = false,
  disabled = false,
}: FileDropzoneProps) {
  const { t } = useTranslation();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFilesAccepted(acceptedFiles);
      }
    },
    [onFilesAccepted],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: { 'application/pdf': ['.pdf'] },
      multiple,
      disabled,
    });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
        disabled
          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
          : isDragActive
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center ${isDragActive ? 'bg-primary/10' : 'bg-gray-100'}`}
        >
          <svg
            className={`w-7 h-7 ${isDragActive ? 'text-primary' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">
          {multiple ? t('dropzone.instructionMulti') : t('dropzone.instruction')}
        </p>
        <p className="text-sm text-gray-400">PDF</p>
      </div>
      {fileRejections.length > 0 && (
        <p className="mt-3 text-sm text-red-500">{t('dropzone.invalidType')}</p>
      )}
    </div>
  );
}
