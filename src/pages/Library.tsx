import { useState, useMemo } from "react";
import { AppHeader } from "@/components/AppHeader";
import { LibraryTrackCard } from "@/components/LibraryTrackCard";
import { useLibrary } from "@/hooks/useLibrary";
import { GENRES, getGenre } from "@/data/genres";
import { Disc3, Bookmark, Heart, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Filter = "all" | "loved" | "saved";

const Library = () => {
  const items = useLibrary();
  const [filter, setFilter] = useState<Filter>("all");
  const [genreId, setGenreId] = useState<string>("all");

  const filtered = useMemo(() => {
    return items
      .filter((t) => (filter === "loved" ? t.liked : filter === "saved" ? t.superliked : true))
      .filter((t) => (genreId === "all" ? true : t.genreId === genreId))
      .sort((a, b) => b.rating - a.rating || b.savedAt - a.savedAt);
  }, [items, filter, genreId]);

  // Top-rated track per active set
  const topRated = filtered.find((t) => t.rating >= 4);

  // Genres present in library
  const presentGenres = useMemo(() => {
    const ids = new Set(items.map((t) => t.genreId));
    return GENRES.filter((g) => g.id === "all" || ids.has(g.id));
  }, [items]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-5">
        <div className="mb-5">
          <h1 className="font-display text-3xl font-black">Your Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} track{items.length === 1 ? "" : "s"} · Rate them with hearts to build your taste
          </p>
        </div>

        {topRated && (
          <div className="mb-5 relative overflow-hidden rounded-2xl bg-gradient-tinder p-4 text-primary-foreground shadow-card">
            <div className="absolute -right-4 -bottom-4 h-28 w-28 rounded-full vinyl-disc opacity-90 animate-spin-slow" />
            <p className="text-xs font-semibold uppercase tracking-wider opacity-90">Top of your charts</p>
            <p className="font-display text-xl font-bold mt-1 truncate">{topRated.title}</p>
            <p className="text-sm opacity-90 truncate">{topRated.artist}</p>
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: topRated.rating }).map((_, i) => (
                <Heart key={i} className="h-3.5 w-3.5" fill="currentColor" />
              ))}
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-1.5 mb-3 p-1 bg-muted rounded-full">
          <FilterTab active={filter === "all"} onClick={() => setFilter("all")} icon={<Music2 className="h-3.5 w-3.5" />} label="All" />
          <FilterTab active={filter === "loved"} onClick={() => setFilter("loved")} icon={<Heart className="h-3.5 w-3.5" fill="currentColor" />} label="Loved" />
          <FilterTab active={filter === "saved"} onClick={() => setFilter("saved")} icon={<Bookmark className="h-3.5 w-3.5" fill="currentColor" />} label="Saved" />
        </div>

        {/* Genre filter (only those user has) */}
        {presentGenres.length > 1 && (
          <div className="-mx-4 overflow-x-auto px-4 pb-2 mb-3">
            <div className="flex gap-2 w-max">
              {presentGenres.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGenreId(g.id)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold border whitespace-nowrap transition-colors",
                    genreId === g.id
                      ? "bg-foreground text-background border-foreground"
                      : "border-border bg-card text-foreground"
                  )}
                >
                  {g.emoji} {g.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 gap-3">
            <Disc3 className="h-14 w-14 text-muted-foreground" strokeWidth={1.2} />
            <p className="font-display text-lg font-bold">Empty groove</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Swipe right (love) or up (save) on Discover to fill your library.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((t) => (
              <LibraryTrackCard key={t.id} track={t} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

function FilterTab({
  active, onClick, icon, label,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-1.5 rounded-full py-1.5 text-sm font-semibold transition-all",
        active ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
      )}
    >
      {icon} {label}
    </button>
  );
}

export default Library;
