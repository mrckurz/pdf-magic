import { PDFDocument } from 'pdf-lib';

export async function mergePdfs(pdfFiles: ArrayBuffer[]): Promise<Uint8Array> {
  const mergedDoc = await PDFDocument.create();

  for (const fileData of pdfFiles) {
    const sourceDoc = await PDFDocument.load(fileData);
    const copiedPages = await mergedDoc.copyPages(
      sourceDoc,
      sourceDoc.getPageIndices(),
    );
    for (const page of copiedPages) {
      mergedDoc.addPage(page);
    }
  }

  return mergedDoc.save();
}
