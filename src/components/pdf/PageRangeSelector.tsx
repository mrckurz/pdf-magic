import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface PageRangeSelectorProps {
  totalPages: number;
  onSelectionChange: (pages: Set<number>) => void;
}

function parsePageRanges(input: string, maxPages: number): Set<number> {
  const pages = new Set<number>();
  const parts = input.split(',');

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const rangeMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
        pages.add(i);
      }
    } else {
      const num = parseInt(trimmed, 10);
      if (!isNaN(num) && num >= 1 && num <= maxPages) {
        pages.add(num);
      }
    }
  }

  return pages;
}

export function PageRangeSelector({
  totalPages,
  onSelectionChange,
}: PageRangeSelectorProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');

  const handleChange = (value: string) => {
    setInput(value);
    const pages = parsePageRanges(value, totalPages);
    onSelectionChange(pages);
  };

  return (
    <div className="flex flex-col gap-1">
      <input
        type="text"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={t('pages.rangeInput')}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
      />
    </div>
  );
}
