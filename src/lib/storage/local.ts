import { db } from './db';
import type { StoredPdf } from '../../types/storage';

export async function saveFile(file: Omit<StoredPdf, 'id'>): Promise<number> {
  return db.storedPdfs.add(file as StoredPdf);
}

export async function getAllFiles(): Promise<StoredPdf[]> {
  return db.storedPdfs.orderBy('createdAt').reverse().toArray();
}

export async function deleteFile(id: number): Promise<void> {
  return db.storedPdfs.delete(id);
}

export async function getFile(id: number): Promise<StoredPdf | undefined> {
  return db.storedPdfs.get(id);
}
