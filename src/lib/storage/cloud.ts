import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabase) return supabase;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  supabase = createClient(url, key);
  return supabase;
}

export function isCloudAvailable(): boolean {
  return getSupabaseClient() !== null;
}

export async function uploadPdf(
  userId: string,
  fileName: string,
  data: ArrayBuffer,
): Promise<string> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Cloud storage not configured');

  const path = `${userId}/${Date.now()}_${fileName}`;
  const { error } = await client.storage
    .from('pdfs')
    .upload(path, data, { contentType: 'application/pdf' });

  if (error) throw error;
  return path;
}

export async function downloadPdf(path: string): Promise<ArrayBuffer> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Cloud storage not configured');

  const { data, error } = await client.storage.from('pdfs').download(path);

  if (error) throw error;
  return data.arrayBuffer();
}

export async function listUserPdfs(userId: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Cloud storage not configured');

  const { data, error } = await client.storage
    .from('pdfs')
    .list(userId, { sortBy: { column: 'created_at', order: 'desc' } });

  if (error) throw error;
  return data;
}

export async function deleteCloudPdf(path: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Cloud storage not configured');

  const { error } = await client.storage.from('pdfs').remove([path]);
  if (error) throw error;
}
