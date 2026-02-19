import Dexie, { type Table } from 'dexie';
import type { StoredPdf } from '../../types/storage';

class PdfMagicDB extends Dexie {
  storedPdfs!: Table<StoredPdf>;

  constructor() {
    super('pdf-magic-db');
    this.version(1).stores({
      storedPdfs: '++id, name, operation, createdAt, cloudSynced',
    });
  }
}

export const db = new PdfMagicDB();
