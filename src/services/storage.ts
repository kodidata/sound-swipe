import type { SavedTrack, Track, SwipeAction } from "@/types/music";

const KEY_LIBRARY = "tuneswipe.library.v1";
const KEY_SEEN = "tuneswipe.seen.v1";
const KEY_NOPE = "tuneswipe.nope.v1";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function getLibrary(): SavedTrack[] {
  return read<SavedTrack[]>(KEY_LIBRARY, []);
}

export function saveLibrary(items: SavedTrack[]) {
  write(KEY_LIBRARY, items);
  window.dispatchEvent(new CustomEvent("tuneswipe:library"));
}

export function recordSwipe(track: Track, action: SwipeAction): SavedTrack | null {
  const seen = new Set(read<string[]>(KEY_SEEN, []));
  seen.add(track.id);
  write(KEY_SEEN, Array.from(seen));

  if (action === "nope") {
    const noped = new Set(read<string[]>(KEY_NOPE, []));
    noped.add(track.id);
    write(KEY_NOPE, Array.from(noped));
    return null;
  }

  const lib = getLibrary();
  const existing = lib.find((t) => t.id === track.id);
  if (existing) {
    if (action === "super") existing.superliked = true;
    if (action === "like") existing.liked = true;
    saveLibrary(lib);
    return existing;
  }

  const saved: SavedTrack = {
    ...track,
    savedAt: Date.now(),
    rating: 0,
    liked: action === "like",
    superliked: action === "super",
    plays: 0,
  };
  saveLibrary([saved, ...lib]);
  return saved;
}

export function getSeenIds(): Set<string> {
  return new Set(read<string[]>(KEY_SEEN, []));
}

export function rateTrack(id: string, rating: number) {
  const lib = getLibrary();
  const t = lib.find((x) => x.id === id);
  if (!t) return;
  t.rating = rating;
  saveLibrary(lib);
}

export function removeTrack(id: string) {
  saveLibrary(getLibrary().filter((t) => t.id !== id));
}

export function incrementPlays(id: string) {
  const lib = getLibrary();
  const t = lib.find((x) => x.id === id);
  if (!t) return;
  t.plays += 1;
  saveLibrary(lib);
}

export function clearSeen() {
  localStorage.removeItem(KEY_SEEN);
  localStorage.removeItem(KEY_NOPE);
}
