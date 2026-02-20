import { describe, it, expect } from 'vitest';
import { splitPdf } from '../split';
import { createTestPdf, pageCountOf } from './helpers';

describe('splitPdf', () => {
  it('splits a 4-page PDF after page 2', async () => {
    const pdf = await createTestPdf(4);

    const results = await splitPdf(pdf, [2]);

    expect(results).toHaveLength(2);
    expect(await pageCountOf(results[0])).toBe(2);
    expect(await pageCountOf(results[1])).toBe(2);
  });

  it('splits at multiple points', async () => {
    const pdf = await createTestPdf(6);

    const results = await splitPdf(pdf, [2, 4]);

    expect(results).toHaveLength(3);
    expect(await pageCountOf(results[0])).toBe(2);
    expect(await pageCountOf(results[1])).toBe(2);
    expect(await pageCountOf(results[2])).toBe(2);
  });

  it('handles unsorted and duplicate split points', async () => {
    const pdf = await createTestPdf(6);

    const results = await splitPdf(pdf, [4, 2, 2]);

    expect(results).toHaveLength(3);
    expect(await pageCountOf(results[0])).toBe(2);
    expect(await pageCountOf(results[1])).toBe(2);
    expect(await pageCountOf(results[2])).toBe(2);
  });

  it('ignores split points beyond total pages', async () => {
    const pdf = await createTestPdf(3);

    const results = await splitPdf(pdf, [10]);

    expect(results).toHaveLength(1);
    expect(await pageCountOf(results[0])).toBe(3);
  });

  it('returns the full document when split point is at the end', async () => {
    const pdf = await createTestPdf(3);

    const results = await splitPdf(pdf, [3]);

    expect(results).toHaveLength(1);
    expect(await pageCountOf(results[0])).toBe(3);
  });
});
