import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, ExternalLink, Heart, Bookmark } from "lucide-react";
import type { Track } from "@/types/music";
import { Button } from "@/components/ui/button";
import { cn, formatDuration } from "@/lib/utils";
import { usePreviewPlayback } from "@/hooks/usePreviewPlayback";

type Props = {
  track: Track | null;
  onClose: () => void;
  onLike?: () => void;
  onSave?: () => void;
};

type ServiceLink = {
  name: string;
  emoji: string;
  color: string;
  url: (t: Track) => string;
};

const SERVICES: ServiceLink[] = [
  { name: "Deezer", emoji: "🎧", color: "bg-[#a238ff] text-white", url: (t) => t.link },
  { name: "Spotify", emoji: "🟢", color: "bg-[#1db954] text-white", url: (t) => `https://open.spotify.com/search/${encodeURIComponent(`${t.title} ${t.artist}`)}` },
  { name: "YouTube", emoji: "▶️", color: "bg-[#ff0000] text-white", url: (t) => `https://www.youtube.com/results?search_query=${encodeURIComponent(`${t.artist} ${t.title}`)}` },
  { name: "YT Music", emoji: "🎵", color: "bg-[#ff0033] text-white", url: (t) => `https://music.youtube.com/search?q=${encodeURIComponent(`${t.artist} ${t.title}`)}` },
  { name: "Apple Music", emoji: "🎵", color: "bg-[#fa243c] text-white", url: (t) => `https://music.apple.com/search?term=${encodeURIComponent(`${t.artist} ${t.title}`)}` },
  { name: "SoundCloud", emoji: "☁️", color: "bg-[#ff5500] text-white", url: (t) => `https://soundcloud.com/search?q=${encodeURIComponent(`${t.artist} ${t.title}`)}` },
];

export function TrackDetail({ track, onClose, onLike, onSave }: Props) {
  const { audioRef, playing, startPlayback, stopPlayback } = usePreviewPlayback(track?.preview ?? null, {
    autoPlay: Boolean(track),
    durationSeconds: 30,
  });
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!track || !audioRef.current) {
      setTime(0);
      setDuration(0);
      return;
    }

    const audio = audioRef.current;
    const onTime = () => setTime(audio.currentTime);
    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onEnd = () => setTime(0);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, [audioRef, track]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      stopPlayback();
      return;
    }

    void startPlayback();
  };

  return (
    <AnimatePresence>
      {track && (
        <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="absolute inset-0 bg-vinyl/70 backdrop-blur-md" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            className="relative w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl shadow-card overflow-hidden border border-border/50 max-h-[92vh] overflow-y-auto"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            <button type="button" onClick={onClose} className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center shadow-sm" aria-label="Close">
              <X className="h-4 w-4" />
            </button>

            <div className="relative aspect-square w-full">
              <img src={track.cover} alt={`${track.title} by ${track.artist}`} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-vinyl via-vinyl/30 to-transparent" />
              <button type="button" onClick={toggle} className="absolute inset-0 flex items-center justify-center group" aria-label={playing ? "Pause" : "Play"}>
                <div className={cn("h-20 w-20 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-card transition-transform", "group-hover:scale-110 group-active:scale-95", playing && "animate-pulse-glow")}>
                  {playing ? <Pause className="h-9 w-9 text-foreground" /> : <Play className="h-9 w-9 text-foreground translate-x-0.5" fill="currentColor" />}
                </div>
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-primary-foreground">
                <h2 className="font-display text-2xl font-bold leading-tight drop-shadow-lg truncate">{track.title}</h2>
                <p className="text-base text-white/85 truncate">{track.artist}</p>
                <p className="text-xs text-white/60 truncate">{track.album}</p>
              </div>
            </div>

            <div className="px-5 pt-4">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-gradient-tinder transition-[width] duration-100" style={{ width: `${duration ? (time / duration) * 100 : 0}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5">
                <span>{formatDuration(time)}</span>
                <span>{formatDuration(duration)} preview</span>
              </div>
            </div>

            {(onLike || onSave) && (
              <div className="flex gap-2 px-5 pt-4">
                {onLike && (
                  <Button type="button" onClick={() => { onLike(); onClose(); }} className="flex-1 gap-2 bg-like hover:bg-like/90 text-primary-foreground">
                    <Heart className="h-4 w-4" fill="currentColor" /> Love
                  </Button>
                )}
                {onSave && (
                  <Button type="button" onClick={() => { onSave(); onClose(); }} variant="outline" className="flex-1 gap-2 border-superlike text-superlike hover:bg-superlike hover:text-vinyl">
                    <Bookmark className="h-4 w-4" fill="currentColor" /> Save
                  </Button>
                )}
              </div>
            )}

            <div className="px-5 py-5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Listen full track on</p>
              <div className="grid grid-cols-2 gap-2">
                {SERVICES.map((service) => (
                  <a
                    key={service.name}
                    href={service.url(track)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("flex items-center justify-between gap-2 rounded-xl px-3 py-3 font-semibold text-sm shadow-sm transition-transform hover:scale-[1.02] active:scale-95", service.color)}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span>{service.emoji}</span>
                      <span className="truncate">{service.name}</span>
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-80 shrink-0" />
                  </a>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-3 text-center">Opens a search in your chosen app for this song.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
