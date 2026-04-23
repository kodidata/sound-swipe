import { Heart, ExternalLink, Star, Trash2, Play, Pause } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { SavedTrack } from "@/types/music";
import { rateTrack, removeTrack, incrementPlays } from "@/services/storage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = { track: SavedTrack };

export function LibraryTrackCard({ track }: Props) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => audioRef.current?.pause();
  }, []);

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(track.preview);
      audioRef.current.addEventListener("ended", () => setPlaying(false));
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setPlaying(true);
        incrementPlays(track.id);
      });
    }
  };

  return (
    <div className="group flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm border border-border/60 hover:shadow-card transition-shadow">
      <button
        onClick={toggle}
        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl"
        aria-label={playing ? "Pause" : "Play"}
      >
        <img src={track.coverSmall} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-vinyl/40 opacity-0 group-hover:opacity-100 transition-opacity">
          {playing ? <Pause className="h-6 w-6 text-white" fill="white" /> : <Play className="h-6 w-6 text-white" fill="white" />}
        </div>
        {track.superliked && (
          <div className="absolute top-1 right-1 h-5 w-5 rounded-full bg-superlike flex items-center justify-center">
            <Star className="h-3 w-3 text-vinyl" fill="currentColor" />
          </div>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className="font-semibold truncate text-sm">{track.title}</p>
        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
        <RatingStars trackId={track.id} value={track.rating} />
      </div>

      <div className="flex flex-col gap-1 shrink-0">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => window.open(track.link, "_blank", "noopener,noreferrer")}
          aria-label="Open in Deezer"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => removeTrack(track.id)}
          aria-label="Remove"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function RatingStars({ trackId, value }: { trackId: string; value: number }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  return (
    <div className="mt-1 flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => rateTrack(trackId, n === value ? 0 : n)}
          aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5 transition-colors",
              n <= display ? "text-like" : "text-muted-foreground/40"
            )}
            fill={n <= display ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  );
}
