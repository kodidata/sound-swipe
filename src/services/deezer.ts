import type { Track, Genre } from "@/types/music";

/**
 * Deezer's API does not send CORS headers. We use a free JSONP-style proxy
 * (api.allorigins.win) which returns JSON wrapped — a battle-tested pattern
 * for browser-only Deezer access. No keys required.
 */
const PROXY = "https://corsproxy.io/?url=";

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
  const url = `${PROXY}${encodeURIComponent("https://api.deezer.com" + path)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Deezer ${res.status}`);
  return res.json() as Promise<T>;
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
