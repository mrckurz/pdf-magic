import { useEffect, useRef, useState } from 'react';
import { generateThumbnail } from '../../lib/pdf/thumbnails';

interface PageThumbnailProps {
  pdfData: ArrayBuffer;
  pageNumber: number;
  isSelected?: boolean;
  onClick?: () => void;
  label?: string;
  showCheckbox?: boolean;
}

export function PageThumbnail({
  pdfData,
  pageNumber,
  isSelected = false,
  onClick,
  label,
  showCheckbox = true,
}: PageThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let cancelled = false;

    generateThumbnail(pdfData, pageNumber, 0.4).then((url) => {
      if (!cancelled) setThumbnail(url);
    });

    return () => {
      cancelled = true;
    };
  }, [pdfData, pageNumber, isVisible]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
        isSelected
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`Page ${pageNumber}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="animate-pulse bg-gray-200 w-full h-full" />
        )}
      </div>

      {showCheckbox && (
        <div
          className={`absolute top-2 right-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            isSelected
              ? 'bg-primary border-primary'
              : 'bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600 group-hover:border-primary/50'
          }`}
        >
          {isSelected && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      )}

      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs text-center py-1">
        {label || pageNumber}
      </div>
    </div>
  );
}
