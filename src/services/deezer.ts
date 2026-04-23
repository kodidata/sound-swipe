import type { Track, Genre } from "@/types/music";

/**
 * Deezer's API does not send CORS headers, so we route metadata requests
 * through a chain of free CORS proxies. The 30-second preview MP3s on
 * `cdnt-preview.dzcdn.net` DO send `Access-Control-Allow-Origin: *`, so they
 * play directly in the browser without a proxy.
 */
const PROXIES = [
  (url: string) => `https://cors.eu.org/${url}`,
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
];

type DeezerTrack = {
  id: number;
  title: string;
  duration: number;
  preview: string;
  link: string;
  artist: { name: string };
  album: { title: string; cover_medium: string; cover_big: string; cover_xl: string };
};

async function deezerFetch<T>(path: string): Promise<T> {
  const target = "https://api.deezer.com" + path;
  let lastErr: unknown;
  for (const wrap of PROXIES) {
    try {
      const res = await fetch(wrap(target));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as T;
    } catch (e) {
      lastErr = e;
      // try next proxy
    }
  }
  throw lastErr ?? new Error("All proxies failed");
}

function mapTrack(t: DeezerTrack, genreId: string): Track | null {
  if (!t.preview) return null;
  return {
    id: String(t.id),
    title: t.title,
    artist: t.artist.name,
    album: t.album.title,
    cover: t.album.cover_xl || t.album.cover_big,
    coverSmall: t.album.cover_medium,
    preview: t.preview,
    duration: t.duration,
    link: t.link,
    genreId,
  };
}

export async function fetchTracksForGenre(genre: Genre, limit = 30): Promise<Track[]> {
  try {
    if (genre.deezerId > 0) {
      const data = await deezerFetch<{ tracks: { data: DeezerTrack[] } }>(
        `/chart/${genre.deezerId}?limit=${limit}`
      );
      const out = (data.tracks?.data ?? []).map((t) => mapTrack(t, genre.id)).filter(Boolean) as Track[];
      if (out.length) return out;
    }
    // Fallback: search
    const search = await deezerFetch<{ data: DeezerTrack[] }>(
      `/search?q=${encodeURIComponent(genre.query)}&limit=${limit}&order=RANKING`
    );
    return (search.data ?? []).map((t) => mapTrack(t, genre.id)).filter(Boolean) as Track[];
  } catch (e) {
    console.error("Deezer fetch failed", e);
    return [];
  }
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
