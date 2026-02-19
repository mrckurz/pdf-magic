import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export async function generateThumbnail(
  pdfData: ArrayBuffer,
  pageNumber: number,
  scale = 0.5,
): Promise<string> {
  const pdf = await pdfjsLib.getDocument({ data: pdfData.slice(0) }).promise;
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext('2d')!;

  await page.render({ canvasContext: context, viewport }).promise;
  const dataUrl = canvas.toDataURL('image/png');

  pdf.destroy();
  return dataUrl;
}

export async function getPageCount(pdfData: ArrayBuffer): Promise<number> {
  const pdf = await pdfjsLib.getDocument({ data: pdfData.slice(0) }).promise;
  const count = pdf.numPages;
  pdf.destroy();
  return count;
}
