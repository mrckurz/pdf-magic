import { PDFDocument } from 'pdf-lib';

/**
 * Creates a test PDF with the given number of pages.
 * Each page contains text identifying its page number.
 */
export async function createTestPdf(pageCount: number): Promise<ArrayBuffer> {
  const doc = await PDFDocument.create();

  for (let i = 0; i < pageCount; i++) {
    const page = doc.addPage([200, 200]);
    page.drawText(`Page ${i + 1}`, { x: 50, y: 100, size: 16 });
  }

  const bytes = await doc.save();
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  );
}

/** Returns the page count of a PDF from its bytes. */
export async function pageCountOf(data: Uint8Array): Promise<number> {
  const doc = await PDFDocument.load(data);
  return doc.getPageCount();
}
