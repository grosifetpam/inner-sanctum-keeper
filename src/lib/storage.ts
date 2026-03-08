import { supabase } from '@/integrations/supabase/client';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export async function uploadImage(
  bucket: 'avatars' | 'inner-world',
  userId: string,
  file: File
): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;
}

export async function deleteImage(bucket: 'avatars' | 'inner-world', url: string): Promise<void> {
  const prefix = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/`;
  if (!url.startsWith(prefix)) return;
  const path = url.slice(prefix.length);
  await supabase.storage.from(bucket).remove([path]);
}
