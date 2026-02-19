import { PDFDocument } from 'pdf-lib';

export async function extractPages(
  pdfFile: ArrayBuffer,
  pageNumbers: number[],
): Promise<Uint8Array> {
  const sourceDoc = await PDFDocument.load(pdfFile);
  const newDoc = await PDFDocument.create();

  const indices = [...new Set(pageNumbers)]
    .map((p) => p - 1)
    .filter((i) => i >= 0 && i < sourceDoc.getPageCount())
    .sort((a, b) => a - b);

  const copiedPages = await newDoc.copyPages(sourceDoc, indices);
  for (const page of copiedPages) {
    newDoc.addPage(page);
  }

  return newDoc.save();
}
