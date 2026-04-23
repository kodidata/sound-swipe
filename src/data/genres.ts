import type { Genre } from "@/types/music";

// Deezer genre IDs from https://api.deezer.com/genre
export const GENRES: Genre[] = [
  { id: "all",        name: "All Mix",     emoji: "🎧", deezerId: 0,   query: "top hits",     gradient: "from-rose-500 via-fuchsia-500 to-violet-500" },
  { id: "pop",        name: "Pop",         emoji: "💖", deezerId: 132, query: "pop hits",     gradient: "from-pink-500 to-rose-500" },
  { id: "rock",       name: "Rock",        emoji: "🎸", deezerId: 152, query: "rock anthem",  gradient: "from-stone-700 to-red-700" },
  { id: "rap",        name: "Rap / Hip-Hop", emoji: "🎤", deezerId: 116, query: "hip hop",    gradient: "from-amber-600 to-yellow-500" },
  { id: "electronic", name: "Electronic",  emoji: "🎛️", deezerId: 106, query: "electronic",  gradient: "from-cyan-500 to-violet-600" },
  { id: "rnb",        name: "R&B / Soul",  emoji: "🌹", deezerId: 165, query: "rnb soul",     gradient: "from-purple-600 to-pink-500" },
  { id: "jazz",       name: "Jazz",        emoji: "🎷", deezerId: 129, query: "jazz",         gradient: "from-amber-700 to-stone-800" },
  { id: "classical",  name: "Classical",   emoji: "🎻", deezerId: 98,  query: "classical",    gradient: "from-yellow-700 to-amber-900" },
  { id: "latin",      name: "Latin",       emoji: "💃", deezerId: 197, query: "latin hits",   gradient: "from-orange-500 to-red-600" },
  { id: "reggae",     name: "Reggae",      emoji: "🌴", deezerId: 144, query: "reggae",       gradient: "from-green-600 to-yellow-500" },
  { id: "metal",      name: "Metal",       emoji: "🤘", deezerId: 464, query: "metal",        gradient: "from-zinc-900 to-red-900" },
  { id: "indie",      name: "Indie",       emoji: "🌙", deezerId: 85,  query: "indie alternative", gradient: "from-indigo-600 to-purple-700" },
  { id: "country",    name: "Country",     emoji: "🤠", deezerId: 84,  query: "country",      gradient: "from-orange-700 to-amber-600" },
  { id: "kpop",       name: "K-Pop",       emoji: "✨", deezerId: 0,   query: "kpop",         gradient: "from-pink-400 to-violet-500" },
  { id: "lofi",       name: "Lo-Fi",       emoji: "📼", deezerId: 0,   query: "lofi chill beats", gradient: "from-teal-600 to-blue-700" },
];

export const getGenre = (id: string) => GENRES.find((g) => g.id === id) ?? GENRES[0];
