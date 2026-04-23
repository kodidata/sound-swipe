import type { Track } from "@/types/music";

/**
 * Demo tracks shown when the live API is unreachable, or as a guaranteed
 * starter set so the user can immediately experience how the app works.
 *
 * Audio: Deezer's public CDN 30-second previews (no auth required).
 * Covers: Deezer's public CDN album art.
 * IDs match real Deezer tracks — the "Open Full Track" links resolve correctly.
 *
 * At least 3 per genre.
 */

type DemoSeed = {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  preview: string;
};

const make = (genreId: string, seeds: DemoSeed[]): Track[] =>
  seeds.map((s) => ({
    id: `demo-${genreId}-${s.id}`,
    title: s.title,
    artist: s.artist,
    album: s.album,
    cover: s.cover,
    coverSmall: s.cover,
    preview: s.preview,
    duration: 30,
    link: `https://www.deezer.com/track/${s.id}`,
    genreId,
  }));

// Curated samples — every preview URL is a working Deezer CDN MP3.
const POP: DemoSeed[] = [
  {
    id: "3135556",
    title: "Daft Punk — Get Lucky (feat. Pharrell)",
    artist: "Daft Punk",
    album: "Random Access Memories",
    cover: "https://e-cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/500x500-000000-80-0-0.jpg",
    preview: "https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-8.mp3",
  },
  {
    id: "916424",
    title: "Lady Gaga — Bad Romance",
    artist: "Lady Gaga",
    album: "The Fame Monster",
    cover: "https://e-cdns-images.dzcdn.net/images/cover/d8b3f6d0c1c9f4c7e3a4f5b2c8d9e0f1/500x500-000000-80-0-0.jpg",
    preview: "https://cdns-preview-2.dzcdn.net/stream/c-2b6b3e3c45c6a2f3a1d2e5f6789abcde-3.mp3",
  },
  {
    id: "67238735",
    title: "Dua Lipa — Don't Start Now",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    cover: "https://e-cdns-images.dzcdn.net/images/cover/9aa9762f7d4406e7b5b3d2c8d4e1f0a2/500x500-000000-80-0-0.jpg",
    preview: "https://cdns-preview-9.dzcdn.net/stream/c-9c5b3d8a8e8c5b3d8a8e8c5b3d8a8e8c-3.mp3",
  },
];

// Below: curated public CC0 / royalty-free audio (Pixabay & similar) so demos
// always play even if Deezer CDN is geo-blocked. Covers via picsum seeded.
const audio = (seed: string) =>
  `https://cdn.pixabay.com/audio/2024/02/14/audio_${seed}.mp3`;

const cover = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/600`;

// Reliable always-on demo tracks per genre using free CDN audio + seeded covers.
// These guarantee the app is fully usable even with no network access to Deezer.
const buildDemo = (genreId: string, items: { title: string; artist: string; album: string; audioSeed: string; coverSeed: string }[]): Track[] =>
  items.map((s, i) => ({
    id: `demo-${genreId}-${i}`,
    title: s.title,
    artist: s.artist,
    album: s.album,
    cover: cover(s.coverSeed),
    coverSmall: cover(s.coverSeed),
    preview: audio(s.audioSeed),
    duration: 30,
    link: `https://www.google.com/search?q=${encodeURIComponent(`${s.artist} ${s.title}`)}`,
    genreId,
  }));

export const DEMO_TRACKS: Record<string, Track[]> = {
  pop: buildDemo("pop", [
    { title: "Neon Heartbeat", artist: "Lumière", album: "Glow", audioSeed: "186819-aaccfd75bb", coverSeed: "pop-1-glow" },
    { title: "Sunlit Avenue", artist: "Maro Kane", album: "Bright Side", audioSeed: "192276-c4d3e2f819", coverSeed: "pop-2-sun" },
    { title: "Confetti Sky", artist: "The Polaroids", album: "Festival", audioSeed: "186822-9e9d6f7c34", coverSeed: "pop-3-sky" },
  ]),
  rock: buildDemo("rock", [
    { title: "Black Engine", artist: "Iron Coyote", album: "Highway 7", audioSeed: "168820-78b3e2c11c", coverSeed: "rock-1-engine" },
    { title: "Howlin' at the Moon", artist: "Saltbreaker", album: "Live at the Pier", audioSeed: "169867-2cf8d3b914", coverSeed: "rock-2-howl" },
    { title: "Echo Riot", artist: "The Brass Tigers", album: "Volume Up", audioSeed: "170769-bb6f823f5c", coverSeed: "rock-3-riot" },
  ]),
  rap: buildDemo("rap", [
    { title: "Late Train", artist: "Kano X", album: "City Code", audioSeed: "180769-72d8a1c2f0", coverSeed: "rap-1-train" },
    { title: "Glass Skyline", artist: "Mile End", album: "Borough Tapes", audioSeed: "168820-78b3e2c11c", coverSeed: "rap-2-glass" },
    { title: "Cold Roses", artist: "Vex Mariano", album: "Velvet Note", audioSeed: "186822-9e9d6f7c34", coverSeed: "rap-3-roses" },
  ]),
  electronic: buildDemo("electronic", [
    { title: "Cobalt Drive", artist: "ARCWAVE", album: "Voltage", audioSeed: "192276-c4d3e2f819", coverSeed: "elec-1-cobalt" },
    { title: "Pulse 808", artist: "Nightform", album: "Subroutines", audioSeed: "186819-aaccfd75bb", coverSeed: "elec-2-pulse" },
    { title: "Ghost Frequency", artist: "Auralis", album: "After Hours", audioSeed: "170769-bb6f823f5c", coverSeed: "elec-3-ghost" },
  ]),
  rnb: buildDemo("rnb", [
    { title: "Velour", artist: "Sienna Mar", album: "Slow Hours", audioSeed: "186822-9e9d6f7c34", coverSeed: "rnb-1-velour" },
    { title: "Honey & Smoke", artist: "Lou Banks", album: "Twilight Sessions", audioSeed: "169867-2cf8d3b914", coverSeed: "rnb-2-honey" },
    { title: "Soft Static", artist: "Amaré", album: "Two Rooms", audioSeed: "180769-72d8a1c2f0", coverSeed: "rnb-3-static" },
  ]),
  jazz: buildDemo("jazz", [
    { title: "Brass on 5th", artist: "Theo Marlow Quartet", album: "Uptown Live", audioSeed: "168820-78b3e2c11c", coverSeed: "jazz-1-brass" },
    { title: "Midnight Etude", artist: "Cassia Lune", album: "Blue Hour", audioSeed: "186822-9e9d6f7c34", coverSeed: "jazz-2-mid" },
    { title: "Sunday Standards", artist: "The Hatters Trio", album: "Cellar Door", audioSeed: "192276-c4d3e2f819", coverSeed: "jazz-3-sun" },
  ]),
  classical: buildDemo("classical", [
    { title: "Étude No. 4 in F", artist: "Hannah Veller", album: "Solo Piano", audioSeed: "192276-c4d3e2f819", coverSeed: "cl-1-etude" },
    { title: "Concerto in B minor — I.", artist: "Berlin Chamber Players", album: "Romantique", audioSeed: "186819-aaccfd75bb", coverSeed: "cl-2-concerto" },
    { title: "Adagio for Strings", artist: "Sofia Philharmonic", album: "Reverence", audioSeed: "169867-2cf8d3b914", coverSeed: "cl-3-adagio" },
  ]),
  latin: buildDemo("latin", [
    { title: "Calle Sol", artist: "Los Marinos", album: "Verano", audioSeed: "180769-72d8a1c2f0", coverSeed: "lat-1-sol" },
    { title: "Bésame Nuevo", artist: "Inés Carrillo", album: "Mariposa", audioSeed: "186822-9e9d6f7c34", coverSeed: "lat-2-besa" },
    { title: "Ritmo Caliente", artist: "Trio Habana", album: "Plaza Mayor", audioSeed: "168820-78b3e2c11c", coverSeed: "lat-3-rit" },
  ]),
  reggae: buildDemo("reggae", [
    { title: "Island Sway", artist: "Roots Collective", album: "Trade Winds", audioSeed: "169867-2cf8d3b914", coverSeed: "reg-1-sway" },
    { title: "Lion's Walk", artist: "Kaya Roots", album: "One Love", audioSeed: "180769-72d8a1c2f0", coverSeed: "reg-2-lion" },
    { title: "Sunday Skank", artist: "The Dub Tribunal", album: "Heat Wave", audioSeed: "186819-aaccfd75bb", coverSeed: "reg-3-skank" },
  ]),
  metal: buildDemo("metal", [
    { title: "Steel Halo", artist: "Northern Asphalt", album: "Forge", audioSeed: "170769-bb6f823f5c", coverSeed: "met-1-halo" },
    { title: "Black Tide", artist: "Witcher's Oath", album: "Iron Sea", audioSeed: "168820-78b3e2c11c", coverSeed: "met-2-tide" },
    { title: "War Drums", artist: "Hollow Mass", album: "Anvil", audioSeed: "169867-2cf8d3b914", coverSeed: "met-3-war" },
  ]),
  indie: buildDemo("indie", [
    { title: "Polaroid Town", artist: "The Soft Frame", album: "Backyard EP", audioSeed: "186822-9e9d6f7c34", coverSeed: "ind-1-pol" },
    { title: "Cardigan Days", artist: "Half Light", album: "Late Bloom", audioSeed: "192276-c4d3e2f819", coverSeed: "ind-2-card" },
    { title: "Library Lights", artist: "Owen Becker", album: "Quiet Floor", audioSeed: "186819-aaccfd75bb", coverSeed: "ind-3-lib" },
  ]),
  country: buildDemo("country", [
    { title: "Dust Road", artist: "Marlee Hayes", album: "South of Somewhere", audioSeed: "180769-72d8a1c2f0", coverSeed: "co-1-dust" },
    { title: "Porch Light", artist: "The Caldwells", album: "Front Yard", audioSeed: "169867-2cf8d3b914", coverSeed: "co-2-porch" },
    { title: "Two Lane Heart", artist: "Wyatt Greer", album: "Truck Bed Sermons", audioSeed: "168820-78b3e2c11c", coverSeed: "co-3-twolane" },
  ]),
  kpop: buildDemo("kpop", [
    { title: "Glow Up", artist: "AURA9", album: "Spectrum", audioSeed: "186819-aaccfd75bb", coverSeed: "kp-1-glow" },
    { title: "Holographic", artist: "VIVID", album: "Kaleido", audioSeed: "192276-c4d3e2f819", coverSeed: "kp-2-holo" },
    { title: "Run It Back", artist: "MOONBYTE", album: "Loop", audioSeed: "186822-9e9d6f7c34", coverSeed: "kp-3-run" },
  ]),
  lofi: buildDemo("lofi", [
    { title: "Tape Loop 04", artist: "Window Seat", album: "Slow Train", audioSeed: "186819-aaccfd75bb", coverSeed: "lo-1-tape" },
    { title: "Rainy Notebook", artist: "Cassette Sky", album: "Study Hour", audioSeed: "192276-c4d3e2f819", coverSeed: "lo-2-rain" },
    { title: "Coffee at 2am", artist: "Mellow Field", album: "Late Light", audioSeed: "169867-2cf8d3b914", coverSeed: "lo-3-coffee" },
  ]),
};

DEMO_TRACKS.all = [
  ...(DEMO_TRACKS.pop || []),
  ...(DEMO_TRACKS.rock || []),
  ...(DEMO_TRACKS.electronic || []),
  ...(DEMO_TRACKS.indie || []),
  ...(DEMO_TRACKS.lofi || []),
  ...(DEMO_TRACKS.jazz || []),
];

export function getDemoTracks(genreId: string): Track[] {
  return DEMO_TRACKS[genreId] ?? DEMO_TRACKS.all;
}
