import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from "framer-motion";
import { Heart, X, Bookmark, Play, Pause, ExternalLink, Disc3 } from "lucide-react";
import type { Track, SwipeAction } from "@/types/music";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PREVIEW_SECONDS = 9;

type Props = {
  track: Track;
  isTop: boolean;
  index: number;
  onSwipe: (action: SwipeAction) => void;
  onOpenDetails: () => void;
};

export function SwipeCard({ track, isTop, index, onSwipe, onOpenDetails }: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [20, 140], [0, 1]);
  const nopeOpacity = useTransform(x, [-140, -20], [1, 0]);
  const superOpacity = useTransform(y, [-140, -20], [1, 0]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1 of 9 sec
  const stopTimerRef = useRef<number | null>(null);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isTop) return;
    const a = new Audio(track.preview);
    a.crossOrigin = "anonymous";
    a.preload = "auto";
    audioRef.current = a;
    // Auto-start preview as soon as this card is on top
    const tryPlay = () => {
      a.currentTime = 0;
      a.play()
        .then(() => {
          setPlaying(true);
          const startedAt = Date.now();
          tickRef.current = window.setInterval(() => {
            const elapsed = (Date.now() - startedAt) / 1000;
            setProgress(Math.min(1, elapsed / PREVIEW_SECONDS));
          }, 80);
          stopTimerRef.current = window.setTimeout(() => {
            a.pause();
            setPlaying(false);
            if (tickRef.current) window.clearInterval(tickRef.current);
          }, PREVIEW_SECONDS * 1000);
        })
        .catch((e) => {
          // Browser blocked autoplay — user can tap play
          console.warn("Autoplay blocked", e);
        });
    };
    tryPlay();
    return () => {
      a.pause();
      audioRef.current = null;
      if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [isTop, track.preview]);

  const startPlayback = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.currentTime = 0;
      await a.play();
      setPlaying(true);
      const startedAt = Date.now();
      tickRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - startedAt) / 1000;
        setProgress(Math.min(1, elapsed / PREVIEW_SECONDS));
      }, 80);
      stopTimerRef.current = window.setTimeout(() => {
        a.pause();
        setPlaying(false);
        if (tickRef.current) window.clearInterval(tickRef.current);
      }, PREVIEW_SECONDS * 1000);
    } catch (e) {
      console.warn("Audio play blocked", e);
    }
  };

  const stopPlayback = () => {
    audioRef.current?.pause();
    setPlaying(false);
    setProgress(0);
    if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    if (tickRef.current) window.clearInterval(tickRef.current);
  };

  const togglePlay = () => (playing ? stopPlayback() : startPlayback());

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    const swipePower = Math.abs(offset.x) * Math.abs(velocity.x);
    const upPower = Math.abs(offset.y) * Math.abs(velocity.y);

    if (offset.y < -120 && upPower > 5000 || offset.y < -180) {
      stopPlayback();
      onSwipe("super");
      return;
    }
    if (offset.x > 120 || swipePower > 8000 && offset.x > 0) {
      stopPlayback();
      onSwipe("like");
      return;
    }
    if (offset.x < -120 || swipePower > 8000 && offset.x < 0) {
      stopPlayback();
      onSwipe("nope");
      return;
    }
  };

  // Auto-stop progress visual when audio ends naturally
  useEffect(() => {
    if (!playing) setProgress(0);
  }, [playing]);

  return (
    <motion.div
      className={cn(
        "absolute inset-0 select-none touch-none",
        !isTop && "pointer-events-none"
      )}
      style={{
        x: isTop ? x : 0,
        y: isTop ? y : 0,
        rotate: isTop ? rotate : 0,
        zIndex: 10 - index,
      }}
      drag={isTop}
      dragElastic={0.6}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.94, y: index * 8, opacity: 0 }}
      animate={{
        scale: isTop ? 1 : 1 - index * 0.04,
        y: isTop ? 0 : index * 10,
        opacity: 1,
      }}
      exit={{
        x: x.get() > 0 ? 600 : x.get() < 0 ? -600 : 0,
        y: y.get() < -50 ? -800 : 0,
        rotate: x.get() > 0 ? 30 : x.get() < 0 ? -30 : 0,
        opacity: 0,
        transition: { duration: 0.35 },
      }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] paper-card border border-border/40">
        {/* Cover background */}
        <div className="absolute inset-0">
          <img
            src={track.cover}
            alt={`${track.title} by ${track.artist}`}
            className="h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-vinyl via-vinyl/40 to-transparent" />
        </div>

        {/* Vinyl spinning out from behind cover */}
        <motion.div
          className="absolute -right-20 top-8 h-44 w-44 rounded-full vinyl-disc"
          animate={{ rotate: playing ? 360 : 0 }}
          transition={{
            duration: 4,
            ease: "linear",
            repeat: playing ? Infinity : 0,
          }}
        >
          <div className="absolute inset-[38%] rounded-full vinyl-label flex items-center justify-center">
            <Disc3 className="h-4 w-4 text-primary-foreground/80" />
          </div>
        </motion.div>

        {/* LIKE / NOPE / SUPER badges */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-10 left-6 -rotate-12 rounded-xl border-4 border-like px-4 py-2 text-2xl font-black tracking-wider text-like font-display"
        >
          LOVE IT
        </motion.div>
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-10 right-6 rotate-12 rounded-xl border-4 border-foreground/80 px-4 py-2 text-2xl font-black tracking-wider text-foreground font-display"
        >
          SKIP
        </motion.div>
        <motion.div
          style={{ opacity: superOpacity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl border-4 border-superlike px-6 py-3 text-3xl font-black tracking-wider text-superlike font-display"
        >
          SAVE ★
        </motion.div>

        {/* Play button overlay */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center group"
          aria-label={playing ? "Pause preview" : "Play 9 second preview"}
        >
          <div
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-card transition-transform",
              "group-hover:scale-110 group-active:scale-95",
              playing && "animate-pulse-glow"
            )}
          >
            {playing ? (
              <Pause className="h-9 w-9 text-foreground" />
            ) : (
              <Play className="h-9 w-9 text-foreground translate-x-0.5" fill="currentColor" />
            )}
          </div>
        </button>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
          {/* 9-sec progress */}
          <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full bg-gradient-tinder transition-[width] duration-75"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-3xl font-bold leading-tight drop-shadow-lg truncate">
                {track.title}
              </h2>
              <p className="mt-1 text-base font-medium text-white/85 truncate">
                {track.artist}
              </p>
              <p className="mt-0.5 text-xs text-white/60 truncate">
                {track.album}
              </p>
            </div>
            <Button
              size="icon"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails();
              }}
              className="rounded-full shrink-0 shadow-lg"
              aria-label="Open full track"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

type ActionsProps = {
  onAction: (a: SwipeAction) => void;
  disabled?: boolean;
};

export function SwipeActions({ onAction, disabled }: ActionsProps) {
  return (
    <div className="flex items-center justify-center gap-5">
      <ActionButton
        onClick={() => onAction("nope")}
        disabled={disabled}
        label="Skip"
        className="h-14 w-14 border-foreground/20 text-foreground hover:border-foreground hover:bg-foreground hover:text-background"
      >
        <X className="h-7 w-7" strokeWidth={3} />
      </ActionButton>

      <ActionButton
        onClick={() => onAction("super")}
        disabled={disabled}
        label="Save for later"
        className="h-16 w-16 border-superlike text-superlike hover:bg-superlike hover:text-vinyl shadow-glow-gold"
      >
        <Bookmark className="h-7 w-7" fill="currentColor" />
      </ActionButton>

      <ActionButton
        onClick={() => onAction("like")}
        disabled={disabled}
        label="Love it"
        className="h-14 w-14 border-like text-like hover:bg-like hover:text-primary-foreground shadow-glow-like"
      >
        <Heart className="h-7 w-7" fill="currentColor" />
      </ActionButton>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  label,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "flex items-center justify-center rounded-full border-2 bg-card transition-all duration-200",
        "active:scale-90 disabled:opacity-40 disabled:pointer-events-none",
        className
      )}
    >
      {children}
    </button>
  );
}

export { AnimatePresence };
