import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Signs every path in one request per bucket and returns path → URL. Signing
 * file by file costs a full round trip each, and the database sits far enough
 * away that a profile with a few uploads spent seconds on it.
 */
export async function createSignedUrlMap(
  supabase: SupabaseClient,
  bucket: string,
  paths: string[],
  expiresIn = 3600,
): Promise<Map<string, string>> {
  const urls = new Map<string, string>();
  const unique = [...new Set(paths)];
  if (unique.length === 0) return urls;

  const { data } = await supabase.storage
    .from(bucket)
    .createSignedUrls(unique, expiresIn);

  for (const item of data ?? []) {
    if (item.path && item.signedUrl && !item.error) {
      urls.set(item.path, item.signedUrl);
    }
  }
  return urls;
}
