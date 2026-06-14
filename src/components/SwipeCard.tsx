import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Track, SwipeAction } from "@/types/music";
import { Maximize2, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeCardProps {
  track: Track;
  isTop: boolean;
  index: number;
  onSwipe: (action: SwipeAction) => void;
  onOpenDetails: () => void;
}

const SWIPE_THRESHOLD = 50;
const ROTATION_RANGE = 10;
const SWIPE_VELOCITY_THRESHOLD = 500;

export const SwipeCard = ({
  track,
  isTop,
  index,
  onSwipe,
  onOpenDetails,
}: SwipeCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!isTop && isPlaying) {
      setIsPlaying(false);
      audioRef.current?.pause();
    }
  }, [isTop, isPlaying]);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDragEnd = (
    _event: any,
    info: { offset: { x: number; y: number }; velocity: { x: number } }
  ) => {
    const swipe = Math.abs(info.offset.x);
    const velocity = Math.abs(info.velocity.x);
    const isSwipeRight = info.offset.x > 0;
    const isSwipeUp = Math.abs(info.offset.y) > Math.abs(info.offset.x) && info.offset.y < -50;

    if (swipe > SWIPE_THRESHOLD || velocity > SWIPE_VELOCITY_THRESHOLD) {
      if (isSwipeUp) {
        onSwipe("super");
      } else if (isSwipeRight) {
        onSwipe("like");
      } else {
        onSwipe("pass");
      }
    }
    setIsDragging(false);
  };

  return (
    <motion.div
      ref={dragRef}
      drag={isTop}
      dragElastic={0.2}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{
        opacity: isTop ? 1 : 0.5 + index * 0.15,
        scale: 1 - index * 0.05,
        y: index * 10,
        zIndex: 100 - index,
      }}
      exit={{ opacity: 0, scale: 0.8, y: 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "absolute w-full h-[520px] rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing",
        "shadow-lg transition-shadow duration-300",
        isDragging && "shadow-2xl"
      )}
    >
      {/* Background Image with Overlay */}
      <div className="relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-800">
        <img
          src={track.album.cover_medium}
          alt={track.title}
          className="w-full h-full object-cover"
          draggable={false}
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Audio preview */}
        {track.preview && (
          <audio
            ref={audioRef}
            src={track.preview}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          {/* Top Action Buttons */}
          <div className="flex items-center justify-between">
            {/* Play/Pause Button */}
            {track.preview && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayPause}
                className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                aria-label={isPlaying ? "Pause preview" : "Play preview"}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 text-slate-900" />
                ) : (
                  <Play className="h-5 w-5 text-slate-900 ml-0.5" />
                )}
              </motion.button>
            )}

            {/* Expand Details Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsPlaying(false);
                audioRef.current?.pause();
                onOpenDetails();
              }}
              className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              aria-label="View full track details"
            >
              <Maximize2 className="h-5 w-5 text-slate-900" />
            </motion.button>
          </div>

          {/* Bottom Track Info */}
          <div className="space-y-3">
            {/* Artist Name */}
            <div>
              <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">
                {track.artist.name}
              </p>
            </div>

            {/* Track Title */}
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-white leading-tight line-clamp-2">
                {track.title}
              </h2>
              <p className="text-sm text-white/70 line-clamp-1">{track.album.title}</p>
            </div>

            {/* Swipe Instructions */}
            <div className="pt-2 space-y-1 text-xs text-white/70">
              <p>
                <span className="inline-block bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full mr-2">
                  👉
                </span>
                <span className="font-semibold text-white">Love</span>
              </p>
              <p>
                <span className="inline-block bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full mr-2">
                  👆
                </span>
                <span className="font-semibold text-white">Save</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface SwipeActionsProps {
  onAction: (action: SwipeAction) => void;
  disabled: boolean;
}

export const SwipeActions = ({ onAction, disabled }: SwipeActionsProps) => {
  return (
    <div className="flex gap-3 justify-center">
      {/* Pass Button */}
      <motion.button
        whileHover={!disabled ? { scale: 1.08, y: -2 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        onClick={() => onAction("pass")}
        disabled={disabled}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg font-bold text-lg transition-all",
          "flex items-center justify-center",
          disabled
            ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
            : "bg-slate-200 text-slate-700 hover:bg-slate-300 active:shadow-md"
        )}
        aria-label="Skip track"
      >
        ✕
      </motion.button>

      {/* Like Button */}
      <motion.button
        whileHover={!disabled ? { scale: 1.12, y: -4 } : {}}
        whileTap={!disabled ? { scale: 0.93 } : {}}
        onClick={() => onAction("like")}
        disabled={disabled}
        className={cn(
          "h-16 w-16 rounded-full shadow-lg font-bold text-2xl transition-all",
          "flex items-center justify-center transform",
          disabled
            ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
            : "bg-gradient-to-br from-rose-400 to-rose-500 text-white hover:shadow-xl active:shadow-md"
        )}
        aria-label="Love track"
      >
        ❤️
      </motion.button>

      {/* Save Button */}
      <motion.button
        whileHover={!disabled ? { scale: 1.08, y: -2 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        onClick={() => onAction("super")}
        disabled={disabled}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg font-bold text-lg transition-all",
          "flex items-center justify-center",
          disabled
            ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
            : "bg-gradient-to-br from-amber-400 to-amber-500 text-white hover:bg-amber-500 active:shadow-md"
        )}
        aria-label="Save track"
      >
        ⭐
      </motion.button>
    </div>
  );
};