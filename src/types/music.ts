export type Genre = {
  id: string;
  name: string;
  emoji: string;
  /** Deezer chart genre id — see https://api.deezer.com/genre */
  deezerId: number;
  /** Fallback search query if chart is empty */
  query: string;
  gradient: string; // tailwind class
  description: string;
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string; // 500x500
  coverSmall: string;
  preview: string; // 30s mp3 — we play 9s
  duration: number;
  link: string; // deezer link
  genreId: string;
};

export type SavedTrack = Track & {
  savedAt: number;
  rating: number; // 1-5 stars (heart taps)
  liked: boolean; // right swipe = liked
  superliked: boolean; // up swipe = saved-for-later
  plays: number;
};

export type SwipeAction = "like" | "nope" | "super";
