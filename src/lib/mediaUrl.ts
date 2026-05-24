const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/**
 * Converts a profilePicture value from the backend into a usable <img> src.
 *
 * The backend may return:
 *  - A relative path like  "images/profilePicture/abc-photo.jpg"  (new format)
 *  - An absolute Windows path like "D:/NEST JS/.../profilePicture/abc-photo.jpg" (legacy)
 *  - null / undefined / empty
 *
 * All formats are resolved to:  http://localhost:4000/media/images/profilePicture/...
 */
export function getMediaUrl(rawPath?: string | null): string {
  if (!rawPath) return "/unknown.webp";

  // Already a full URL (http/https) — use as-is
  if (/^https?:\/\//i.test(rawPath)) return rawPath;

  // Legacy absolute Windows path — extract the part after lib\media or lib/media
  const match = rawPath.match(/[/\\]media[/\\](.+)/i);
  if (match) {
    const relative = match[1].replace(/\\/g, "/");
    return `${API_BASE}/media/${relative}`;
  }

  // Relative path (new format, already starts with "images/...")
  const clean = rawPath.replace(/^[/\\]+/, "").replace(/\\/g, "/");
  return `${API_BASE}/media/${clean}`;
}
