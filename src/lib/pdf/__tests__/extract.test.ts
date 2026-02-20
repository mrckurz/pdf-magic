import { describe, it, expect } from 'vitest';
import { extractPages } from '../extract';
import { createTestPdf, pageCountOf } from './helpers';

describe('extractPages', () => {
  it('extracts specific pages from a PDF', async () => {
    const pdf = await createTestPdf(5);

    const result = await extractPages(pdf, [1, 3, 5]);

    expect(await pageCountOf(result)).toBe(3);
  });

  it('extracts a single page', async () => {
    const pdf = await createTestPdf(3);

    const result = await extractPages(pdf, [2]);

    expect(await pageCountOf(result)).toBe(1);
  });

  it('deduplicates page numbers', async () => {
    const pdf = await createTestPdf(3);

    const result = await extractPages(pdf, [1, 1, 2, 2]);

    expect(await pageCountOf(result)).toBe(2);
  });

  it('sorts pages in ascending order regardless of input order', async () => {
    const pdf = await createTestPdf(5);

    const result = await extractPages(pdf, [5, 1, 3]);

    expect(await pageCountOf(result)).toBe(3);
  });
});
