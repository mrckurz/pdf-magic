import { describe, it, expect } from 'vitest';
import { mergePdfs } from '../merge';
import { createTestPdf, pageCountOf } from './helpers';

describe('mergePdfs', () => {
  it('merges two PDFs into one', async () => {
    const pdf1 = await createTestPdf(2);
    const pdf2 = await createTestPdf(3);

    const result = await mergePdfs([pdf1, pdf2]);

    expect(await pageCountOf(result)).toBe(5);
  });

  it('merges a single PDF unchanged', async () => {
    const pdf = await createTestPdf(4);

    const result = await mergePdfs([pdf]);

    expect(await pageCountOf(result)).toBe(4);
  });

  it('merges multiple PDFs in order', async () => {
    const pdf1 = await createTestPdf(1);
    const pdf2 = await createTestPdf(2);
    const pdf3 = await createTestPdf(1);

    const result = await mergePdfs([pdf1, pdf2, pdf3]);

    expect(await pageCountOf(result)).toBe(4);
  });

});
