import type { SavedTrack, Track, SwipeAction } from "@/types/music";

const KEY_LIBRARY = "tuneswipe.library.v1";
const KEY_SEEN = "tuneswipe.seen.v1";
const KEY_NOPE = "tuneswipe.nope.v1";

export type SwipeHistoryEntry = {
  trackId: string;
  action: SwipeAction;
  /** Did the track exist in library before this swipe? */
  wasInLibrary: boolean;
  /** Snapshot of the saved track before this swipe (for restoring exact prior state) */
  prevSaved: SavedTrack | null;
};

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
    if (action === "super") existingBefore.superliked = true;
    if (action === "like") existingBefore.liked = true;
    saveLibrary(lib);
    return { saved: existingBefore, history };
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

/** Undo the swipe described by `history`, restoring prior library/seen state. */
export function undoSwipe(history: SwipeHistoryEntry) {
  // Remove from seen
  const seen = new Set(read<string[]>(KEY_SEEN, []));
  seen.delete(history.trackId);
  write(KEY_SEEN, Array.from(seen));

  // Remove from nope set if present
  const noped = new Set(read<string[]>(KEY_NOPE, []));
  noped.delete(history.trackId);
  write(KEY_NOPE, Array.from(noped));

  // Restore library exactly
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
