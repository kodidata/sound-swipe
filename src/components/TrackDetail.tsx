import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Bookmark, X, Share2, Pause, Play, Music } from "lucide-react";
import type { Track } from "@/types/music";
import { cn } from "@/lib/utils";

interface TrackDetailProps {
  track: Track | null;
  onClose: () => void;
  onLike?: () => void;
  onSave?: () => void;
}

export const TrackDetail = ({
  track,
  onClose,
  onLike,
  onSave,
}: TrackDetailProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!track) return;
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [track]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleShare = async () => {
    if (!track) return;
    const text = `Check out "${track.title}" by ${track.artist.name} on TuneSwipe! 🎵`;
    const url = track.link;

    if (navigator.share) {
      try {
        await navigator.share({ title: track.title, text, url });
      } catch (e) {
        console.error("Share failed", e);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `${text}\n${url}`;
      navigator.clipboard.writeText(shareText);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      {track && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-gradient-to-t from-slate-950 via-slate-900 to-slate-800 rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3">
              <div className="w-12 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              aria-label="Close"
            >
              <X className="h-6 w-6 text-white" />
            </motion.button>

            <div className="p-6 space-y-6">
              {/* Album Art */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl"
              >
                <img
                  src={track.album.cover_big}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>

              {/* Track Info */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-white/60 uppercase tracking-wide">
                  {track.artist.name}
                </p>
                <h2 className="text-2xl font-black text-white">{track.title}</h2>
                <p className="text-sm text-white/70">{track.album.title}</p>
              </div>

              {/* Audio Player */}
              {track.preview && (
                <div className="space-y-4">
                  <audio
                    ref={audioRef}
                    src={track.preview}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                  />

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-rose-400 to-rose-500"
                        style={{ width: `${progressPercent}%` }}
                        layoutId="progress-bar"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-white/60">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Play Button */}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlayPause}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-5 w-5" />
                        Pause Preview
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 ml-0.5" />
                        Play Preview (9 sec)
                      </>
                    )}
                  </motion.button>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 text-center">
                  <p className="text-xs text-white/60 uppercase tracking-wide">Duration</p>
                  <p className="text-xl font-bold text-white mt-1">{formatTime(duration)}</p>
                </div>
                <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 text-center">
                  <p className="text-xs text-white/60 uppercase tracking-wide">Release</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {new Date(track.release_date).getFullYear()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {/* Share Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                  aria-label="Share track"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </motion.button>

                {/* Like Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onLike?.();
                    onClose();
                  }}
                  className="py-3 rounded-xl bg-gradient-to-br from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                  aria-label="Love track"
                >
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Love</span>
                </motion.button>

                {/* Save Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onSave?.();
                    onClose();
                  }}
                  className="py-3 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                  aria-label="Save track"
                >
                  <Bookmark className="h-4 w-4" />
                  <span className="hidden sm:inline">Save</span>
                </motion.button>
              </div>

              {/* Open in Streaming Services */}
              <div className="pt-4">
                <p className="text-xs text-white/60 uppercase tracking-wide mb-3">Listen on</p>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={track.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Music className="h-4 w-4" />
                  Open on Spotify / YouTube
                </motion.a>
              </div>

              {/* Spacer for scroll */}
              <div className="h-4" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}