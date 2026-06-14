import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Bookmark, Play, Pause } from "lucide-react";
import type { LibraryTrack } from "@/hooks/useLibrary";
import { cn } from "@/lib/utils";

interface LibraryTrackCardProps {
  track: LibraryTrack;
}

export const LibraryTrackCard = ({ track }: LibraryTrackCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 shadow-md hover:shadow-lg transition-shadow"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={track.album.cover_small}
          alt={track.title}
          className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/70" />
      </div>

      {/* Content */}
      <div className="relative p-4 flex items-center gap-4 h-24 group-hover:h-28 transition-all duration-300">
        {/* Album Art */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden shadow-lg"
        >
          <img
            src={track.album.cover_small}
            alt={track.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white/70 uppercase tracking-wide truncate">
            {track.artist.name}
          </p>
          <h3 className="text-sm font-bold text-white truncate mt-0.5">{track.title}</h3>
          <p className="text-xs text-white/60 truncate mt-1">{track.album.title}</p>

          {/* Rating Display */}
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "h-1.5 rounded-full transition-colors",
                  i < track.rating
                    ? "w-3 bg-rose-500"
                    : "w-2 bg-white/20"
                )}
              />
            ))}
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-col gap-2">
          {track.liked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-500/90 shadow-lg"
              title="Loved"
            >
              <Heart className="h-4 w-4 text-white fill-current" />
            </motion.div>
          )}
          {track.superliked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/90 shadow-lg"
              title="Saved"
            >
              <Bookmark className="h-4 w-4 text-white fill-current" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Hover Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute top-2 right-2 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayPause}
          className="h-10 w-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-slate-900" />
          ) : (
            <Play className="h-5 w-5 text-slate-900 ml-0.5" />
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}