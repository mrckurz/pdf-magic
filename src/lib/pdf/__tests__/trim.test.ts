import { describe, it, expect } from 'vitest';
import { trimPages } from '../trim';
import { createTestPdf, pageCountOf } from './helpers';

describe('trimPages', () => {
  it('removes specified pages from a PDF', async () => {
    const pdf = await createTestPdf(5);

    const result = await trimPages(pdf, [2, 4]);

    expect(await pageCountOf(result)).toBe(3);
  });

  it('removes a single page', async () => {
    const pdf = await createTestPdf(3);

    const result = await trimPages(pdf, [1]);

    expect(await pageCountOf(result)).toBe(2);
  });

  it('handles duplicate page numbers', async () => {
    const pdf = await createTestPdf(4);

    const result = await trimPages(pdf, [2, 2, 3, 3]);

    expect(await pageCountOf(result)).toBe(2);
  });

  it('ignores out-of-range page numbers', async () => {
    const pdf = await createTestPdf(3);

    const result = await trimPages(pdf, [0, 5, 99]);

    expect(await pageCountOf(result)).toBe(3);
  });

});
