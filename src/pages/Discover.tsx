import { useEffect, useState, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { SwipeCard, SwipeActions } from "@/components/SwipeCard";
import { GenreSelector } from "@/components/GenreSelector";
import { AppHeader } from "@/components/AppHeader";
import { GENRES, getGenre } from "@/data/genres";
import { fetchTracksForGenre, shuffle } from "@/services/deezer";
import { recordSwipe, getSeenIds } from "@/services/storage";
import type { Track, SwipeAction } from "@/types/music";
import { Disc3, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Discover = () => {
  const [genreId, setGenreId] = useState<string>("all");
  const [queue, setQueue] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const genre = useMemo(() => getGenre(genreId), [genreId]);

  const load = useCallback(async (gid: string, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const g = getGenre(gid);
      const fetched = await fetchTracksForGenre(g, 40);
      const seen = getSeenIds();
      const fresh = shuffle(fetched.filter((t) => !seen.has(t.id)));
      setQueue((prev) => (append ? [...prev, ...fresh] : fresh));
      if (!fresh.length && !append) {
        setError("No new tracks for this genre — try another or refresh.");
      }
    } catch (e) {
      console.error(e);
      setError("Couldn't load tracks. Check connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(genreId);
  }, [genreId, load]);

  const handleSwipe = (action: SwipeAction) => {
    const top = queue[0];
    if (!top) return;
    const saved = recordSwipe(top, action);
    if (action === "like") toast("💖 Loved", { description: `${top.title} added to your library` });
    if (action === "super") toast("⭐ Saved", { description: `${top.title} saved for full listen` });
    setQueue((q) => q.slice(1));

    // Prefetch when running low
    if (queue.length <= 4 && !loading) load(genreId, true);
  };

  const openExternal = () => {
    const top = queue[0];
    if (top) window.open(top.link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-md flex-1 flex flex-col px-4 pt-3 pb-6">
        <div className="mb-3">
          <h1 className="sr-only">Discover music — TuneSwipe</h1>
          <GenreSelector value={genreId} onChange={setGenreId} />
        </div>

        <div className="text-center mb-3">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{genre.emoji} {genre.name}</span> · Swipe right to love · up to save · left to skip
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
                <Button onClick={() => load(genreId)} className="gap-2">
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
                onOpenDetails={openExternal}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Action buttons */}
        <div className="mt-5">
          <SwipeActions onAction={handleSwipe} disabled={queue.length === 0} />
          <p className="text-center text-[11px] text-muted-foreground mt-3">
            Full tracks open in Deezer · Previews are 9 seconds
          </p>
        </div>
      </main>
    </div>
  );
};

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
