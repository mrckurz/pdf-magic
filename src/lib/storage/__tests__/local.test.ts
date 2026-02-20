import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../db';
import { saveFile, getAllFiles, getFile, deleteFile } from '../local';
import type { StoredPdf } from '../../../types/storage';

function makePdf(overrides: Partial<StoredPdf> = {}): Omit<StoredPdf, 'id'> {
  return {
    name: 'test.pdf',
    data: new ArrayBuffer(8),
    pageCount: 1,
    thumbnail: 'data:image/png;base64,abc',
    operation: 'merge',
    createdAt: new Date(),
    sizeBytes: 1024,
    cloudSynced: false,
    ...overrides,
  };
}

beforeEach(async () => {
  await db.storedPdfs.clear();
});

describe('saveFile', () => {
  it('saves a file and returns an id', async () => {
    const id = await saveFile(makePdf());

    expect(id).toBeGreaterThan(0);
  });
});

describe('getFile', () => {
  it('retrieves a saved file by id', async () => {
    const id = await saveFile(makePdf({ name: 'hello.pdf' }));

    const file = await getFile(id);

    expect(file).toBeDefined();
    expect(file!.name).toBe('hello.pdf');
  });

  it('returns undefined for a non-existent id', async () => {
    const file = await getFile(999);

    expect(file).toBeUndefined();
  });
});

describe('getAllFiles', () => {
  it('returns files ordered by createdAt descending', async () => {
    await saveFile(makePdf({ name: 'old.pdf', createdAt: new Date('2024-01-01') }));
    await saveFile(makePdf({ name: 'new.pdf', createdAt: new Date('2024-06-01') }));

    const files = await getAllFiles();

    expect(files).toHaveLength(2);
    expect(files[0].name).toBe('new.pdf');
    expect(files[1].name).toBe('old.pdf');
  });

  it('returns an empty array when no files exist', async () => {
    const files = await getAllFiles();

    expect(files).toHaveLength(0);
  });
});

describe('deleteFile', () => {
  it('removes a file by id', async () => {
    const id = await saveFile(makePdf());
    await deleteFile(id);

    const file = await getFile(id);

    expect(file).toBeUndefined();
  });
});
