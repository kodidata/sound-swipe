import type { SavedTrack, Track, SwipeAction } from "@/types/music";

const KEY_LIBRARY = "tuneswipe.library.v1";
const KEY_SEEN = "tuneswipe.seen.v1";
const KEY_NOPE = "tuneswipe.nope.v1";

export type SwipeHistoryEntry = {
  trackId: string;
  action: SwipeAction;
  wasInLibrary: boolean;
  prevSaved: SavedTrack | null;
};

function isSavedTrack(value: unknown): value is SavedTrack {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.artist === "string" &&
    typeof candidate.album === "string" &&
    typeof candidate.cover === "string" &&
    typeof candidate.preview === "string" &&
    typeof candidate.genreId === "string" &&
    typeof candidate.savedAt === "number" &&
    typeof candidate.rating === "number" &&
    typeof candidate.liked === "boolean" &&
    typeof candidate.superliked === "boolean" &&
    typeof candidate.plays === "number"
  );
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    return parsed === null ? fallback : (parsed as T);
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Storage write failed", error);
  }
}

function normalizeLibrary(value: unknown): SavedTrack[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isSavedTrack);
}

export function getLibrary(): SavedTrack[] {
  return normalizeLibrary(read<SavedTrack[]>(KEY_LIBRARY, []));
}

export function saveLibrary(items: SavedTrack[]) {
  write(KEY_LIBRARY, items);
  window.dispatchEvent(new CustomEvent("tuneswipe:library"));
}

export function recordSwipe(track: Track, action: SwipeAction): {
  saved: SavedTrack | null;
  history: SwipeHistoryEntry;
} {
  const lib = getLibrary();
  const existingBefore = lib.find((t) => t.id === track.id) ?? null;
  const history: SwipeHistoryEntry = {
    trackId: track.id,
    action,
    wasInLibrary: !!existingBefore,
    prevSaved: existingBefore ? { ...existingBefore } : null,
  };

  const seen = new Set(read<string[]>(KEY_SEEN, []));
  seen.add(track.id);
  write(KEY_SEEN, Array.from(seen));

  if (action === "nope") {
    const noped = new Set(read<string[]>(KEY_NOPE, []));
    noped.add(track.id);
    write(KEY_NOPE, Array.from(noped));
    return { saved: null, history };
  }

  if (existingBefore) {
    const updated = existingBefore;
    if (action === "super") updated.superliked = true;
    if (action === "like") updated.liked = true;
    saveLibrary(lib);
    return { saved: updated, history };
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
  return { saved, history };
}

export function undoSwipe(history: SwipeHistoryEntry) {
  const seen = new Set(read<string[]>(KEY_SEEN, []));
  seen.delete(history.trackId);
  write(KEY_SEEN, Array.from(seen));

  const noped = new Set(read<string[]>(KEY_NOPE, []));
  noped.delete(history.trackId);
  write(KEY_NOPE, Array.from(noped));

  const lib = getLibrary().filter((t) => t.id !== history.trackId);
  if (history.wasInLibrary && history.prevSaved) {
    lib.unshift(history.prevSaved);
  }

  saveLibrary(lib);
}

export function getSeenIds(): Set<string> {
  return new Set(read<string[]>(KEY_SEEN, []));
}

export function rateTrack(id: string, rating: number) {
  const lib = getLibrary();
  const item = lib.find((track) => track.id === id);
  if (!item) return;

  item.rating = rating;
  saveLibrary(lib);
}

export function removeTrack(id: string) {
  saveLibrary(getLibrary().filter((track) => track.id !== id));
}

export function incrementPlays(id: string) {
  const lib = getLibrary();
  const item = lib.find((track) => track.id === id);
  if (!item) return;

  item.plays += 1;
  saveLibrary(lib);
}

export function clearSeen() {
  localStorage.removeItem(KEY_SEEN);
  localStorage.removeItem(KEY_NOPE);
}
