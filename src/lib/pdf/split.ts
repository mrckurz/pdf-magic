import { PDFDocument } from 'pdf-lib';

export async function splitPdf(
  pdfFile: ArrayBuffer,
  splitAfterPages: number[],
): Promise<Uint8Array[]> {
  const sourceDoc = await PDFDocument.load(pdfFile);
  const totalPages = sourceDoc.getPageCount();

  const sortedSplits = [...new Set(splitAfterPages)].sort((a, b) => a - b);

  const ranges: [number, number][] = [];
  let start = 0;
  for (const splitAfter of sortedSplits) {
    if (splitAfter > start && splitAfter <= totalPages) {
      ranges.push([start, splitAfter]);
      start = splitAfter;
    }
  }
  if (start < totalPages) {
    ranges.push([start, totalPages]);
  }

  const results: Uint8Array[] = [];
  for (const [rangeStart, rangeEnd] of ranges) {
    const newDoc = await PDFDocument.create();
    const pageIndices = Array.from(
      { length: rangeEnd - rangeStart },
      (_, i) => rangeStart + i,
    );
    const copiedPages = await newDoc.copyPages(sourceDoc, pageIndices);
    for (const page of copiedPages) {
      newDoc.addPage(page);
    }
    results.push(await newDoc.save());
  }

  return results;
}
