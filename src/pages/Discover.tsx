import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SwipeCard, SwipeActions } from "@/components/SwipeCard";
import { GenreSelector } from "@/components/GenreSelector";
import { CountrySelector } from "@/components/CountrySelector";
import { AppHeader } from "@/components/AppHeader";
import { TrackDetail } from "@/components/TrackDetail";
import { GENRES, getGenre } from "@/data/genres";
import { fetchTracksForGenre, shuffle } from "@/services/deezer";
import { recordSwipe, getSeenIds, undoSwipe, type SwipeHistoryEntry } from "@/services/storage";
import type { Track, SwipeAction } from "@/types/music";
import { Disc3, RefreshCw, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Discover = () => {
  const [genreId, setGenreId] = useState<string>("all");
  const [country, setCountry] = useState<string>(() => localStorage.getItem("ts_country") ?? "us");
  const [queue, setQueue] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailTrack, setDetailTrack] = useState<Track | null>(null);

  // Undo state: track + history of the last swipe so we can restore it
  const [lastSwipe, setLastSwipe] = useState<{ track: Track; history: SwipeHistoryEntry } | null>(null);
  const undoTimerRef = useRef<number | null>(null);

  const genre = useMemo(() => getGenre(genreId), [genreId]);

  const load = useCallback(async (gid: string, ctry: string, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const g = getGenre(gid);
      const fetched = await fetchTracksForGenre(g, 40, ctry);
      const seen = getSeenIds();
      const fresh = shuffle(fetched.filter((t) => !seen.has(t.id)));
      setQueue((prev) => (append ? [...prev, ...fresh] : fresh));
      if (!fresh.length && !append) {
        setError("No new tracks for this combo — try another genre or country.");
      }
    } catch (e) {
      console.error(e);
      setError("Couldn't load tracks. Check connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(genreId, country);
    localStorage.setItem("ts_country", country);
    setLastSwipe(null);
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
  }, [genreId, country, load]);

  const handleSwipe = (action: SwipeAction) => {
    const top = queue[0];
    if (!top) return;
    const { history } = recordSwipe(top, action);
    if (action === "like") toast("💖 Loved", { description: `${top.title} added to your library` });
    if (action === "super") toast("⭐ Saved", { description: `${top.title} saved for full listen` });
    setQueue((q) => q.slice(1));
    setLastSwipe({ track: top, history });

    // Auto-clear undo after 6s
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
    undoTimerRef.current = window.setTimeout(() => setLastSwipe(null), 6000);

    // Prefetch when running low
    if (queue.length <= 4 && !loading) load(genreId, country, true);
  };

  const handleUndo = () => {
    if (!lastSwipe) return;
    undoSwipe(lastSwipe.history);
    setQueue((q) => [lastSwipe.track, ...q]);
    setLastSwipe(null);
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
    toast("↩️ Undone", { description: `${lastSwipe.track.title} restored` });
  };

  const openDetails = () => {
    const top = queue[0];
    if (top) setDetailTrack(top);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-md flex-1 flex flex-col px-4 pt-3 pb-6">
        <div className="mb-3 space-y-2.5">
          <h1 className="sr-only">Discover music — TuneSwipe</h1>
          <CountrySelector value={country} onChange={setCountry} />
          <GenreSelector value={genreId} onChange={setGenreId} />
        </div>

        <div className="text-center mb-3 min-h-[18px]">
          <p className="text-[11px] text-muted-foreground">
            Swipe <span className="font-semibold text-foreground">→ love</span> · <span className="font-semibold text-foreground">↑ save</span> · <span className="font-semibold text-foreground">← skip</span> · tap card for full track
          </p>
        </div>

        {/* Card stack */}
        <div className="relative flex-1 min-h-[480px]">
          {loading && queue.length === 0 && (
            <EmptyState
              icon={<Disc3 className="h-14 w-14 animate-spin-vinyl text-vinyl" strokeWidth={1.2} />}
              title="Spinning up tracks..."
              hint={`Finding the best ${genre.name.toLowerCase()} for you`}
            />
          )}

          {!loading && queue.length === 0 && (
            <EmptyState
              icon={<Disc3 className="h-14 w-14 text-muted-foreground" strokeWidth={1.2} />}
              title={error ?? "You've seen them all!"}
              hint="Try another genre or refresh the queue."
              action={
                <Button onClick={() => load(genreId, country)} className="gap-2">
                  <RefreshCw className="h-4 w-4" /> Refresh
                </Button>
              }
            />
          )}

          <AnimatePresence>
            {queue.slice(0, 3).map((t, i) => (
              <SwipeCard
                key={t.id}
                track={t}
                isTop={i === 0}
                index={i}
                onSwipe={handleSwipe}
                onOpenDetails={openDetails}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Action buttons */}
        <div className="mt-5">
          <SwipeActions onAction={handleSwipe} disabled={queue.length === 0} />

          {/* Undo bar */}
          <div className="h-9 mt-3 flex items-center justify-center">
            <AnimatePresence>
              {lastSwipe && (
                <motion.button
                  key="undo"
                  onClick={handleUndo}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold shadow-sm hover:shadow-card transition-shadow"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                  Undo {actionLabel(lastSwipe.history.action)}
                  <span className="text-muted-foreground truncate max-w-[140px]">· {lastSwipe.track.title}</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <p className="text-center text-[11px] text-muted-foreground mt-1">
            Previews auto-play 9 sec · Tap for full track on Spotify, YouTube & more
          </p>
        </div>
      </main>

      <TrackDetail
        track={detailTrack}
        onClose={() => setDetailTrack(null)}
        onLike={detailTrack ? () => handleSwipe("like") : undefined}
        onSave={detailTrack ? () => handleSwipe("super") : undefined}
      />
    </div>
  );
};

function actionLabel(a: SwipeAction) {
  if (a === "like") return "love";
  if (a === "super") return "save";
  return "skip";
}

function EmptyState({
  icon, title, hint, action,
}: { icon: React.ReactNode; title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
      {icon}
      <p className="font-display text-xl font-bold">{title}</p>
      {hint && <p className="text-sm text-muted-foreground max-w-xs">{hint}</p>}
      {action}
    </div>
  );
}

export default Discover;
