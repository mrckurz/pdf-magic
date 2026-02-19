import { PDFDocument } from 'pdf-lib';

export async function trimPages(
  pdfFile: ArrayBuffer,
  pagesToRemove: number[],
): Promise<Uint8Array> {
  const sourceDoc = await PDFDocument.load(pdfFile);
  const totalPages = sourceDoc.getPageCount();

  const removeSet = new Set(pagesToRemove.map((p) => p - 1));
  const keepIndices = Array.from({ length: totalPages }, (_, i) => i).filter(
    (i) => !removeSet.has(i),
  );

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(sourceDoc, keepIndices);
  for (const page of copiedPages) {
    newDoc.addPage(page);
  }

  return newDoc.save();
}
