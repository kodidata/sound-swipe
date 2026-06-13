import type { Track, Genre } from "@/types/music";

/**
 * iTunes Search API — supports CORS natively and provides 30-second
 * preview MP3s that play directly in the browser. No proxy required.
 * Docs: https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/
 */
const ITUNES_ENDPOINT = "https://itunes.apple.com/search";

type ITunesTrack = {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName?: string;
  artworkUrl100?: string;
  artworkUrl60?: string;
  previewUrl?: string;
  trackTimeMillis?: number;
  trackViewUrl?: string;
};

function upscaleArtwork(url: string | undefined, size = 600): string {
  if (!url) return "";
  // iTunes returns 100x100; swap for higher res
  return url.replace(/\/\d+x\d+bb\.(jpg|png)/, `/${size}x${size}bb.$1`);
}

function mapTrack(t: ITunesTrack, genreId: string): Track | null {
  if (!t.previewUrl) return null;
  return {
    id: String(t.trackId),
    title: t.trackName,
    artist: t.artistName,
    album: t.collectionName ?? "",
    cover: upscaleArtwork(t.artworkUrl100, 600),
    coverSmall: t.artworkUrl100 ?? t.artworkUrl60 ?? "",
    preview: t.previewUrl,
    duration: Math.round((t.trackTimeMillis ?? 0) / 1000),
    link: t.trackViewUrl ?? "",
    genreId,
  };
}

export async function fetchTracksForGenre(
  genre: Genre,
  limit = 40,
  country = "us"
): Promise<Track[]> {
  try {
    const url = `${ITUNES_ENDPOINT}?term=${encodeURIComponent(
      genre.query
    )}&media=music&entity=song&limit=${limit}&country=${encodeURIComponent(country)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { results: ITunesTrack[] };
    return (data.results ?? [])
      .map((t) => mapTrack(t, genre.id))
      .filter(Boolean) as Track[];
  } catch (e) {
    console.error("iTunes fetch failed", e);
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
