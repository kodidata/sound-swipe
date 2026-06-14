import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GENRES, getGenre } from "@/data/genres";
import { cn } from "@/lib/utils";
import { ChevronDown, X, Sparkles } from "lucide-react";

type Props = {
  value: string;
  onChange: (id: string) => void;
};

// Quick-access pills shown inline (most popular)
const QUICK_IDS = ["all", "pop", "rock", "rap", "electronic", "indie", "lofi"];

export function GenreSelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const current = getGenre(value);
  const quick = GENRES.filter((g) => QUICK_IDS.includes(g.id)).sort(
    (a, b) => QUICK_IDS.indexOf(a.id) - QUICK_IDS.indexOf(b.id)
  );

  const handlePick = (id: string) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div className="space-y-2.5">
      {/* Hero current-genre pill + "Browse all" trigger */}
      <div className="flex items-stretch gap-2">
        <button
          onClick={() => setOpen(true)}
          className={cn(
            "group relative flex-1 overflow-hidden rounded-2xl px-4 py-3 text-left shadow-card",
            "bg-gradient-to-r text-primary-foreground transition-transform active:scale-[0.98]",
            current.gradient
          )}
          aria-label="Change genre"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-3xl drop-shadow" aria-hidden>
                {current.emoji}
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-80">
                  Now playing genre
                </p>
                <p className="font-display text-xl font-black leading-tight">
                  {current.name}
                </p>
                <p className="text-[11px] opacity-80 leading-tight mt-0.5">
                  {current.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-background text-foreground px-3 py-1.5 text-[11px] font-bold shrink-0 shadow-md">
              Switch genre <ChevronDown className="h-3.5 w-3.5" />
            </div>
          </div>
        </button>
      </div>

      {/* Quick-access horizontal pills */}
      <div className="-mx-4 overflow-x-auto px-4 scrollbar-none">
        <div className="flex gap-1.5 w-max pb-1">
          {quick.map((g) => {
            const active = g.id === value;
            return (
              <button
                key={g.id}
                onClick={() => onChange(g.id)}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap border",
                  active
                    ? "border-foreground bg-foreground text-background shadow-sm"
                    : "border-border bg-card/80 text-foreground hover:bg-card"
                )}
              >
                <span aria-hidden>{g.emoji}</span>
                <span>{g.name}</span>
              </button>
            );
          })}
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-dashed border-border bg-transparent px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-foreground/40 whitespace-nowrap transition-colors"
          >
            <Sparkles className="h-3 w-3" /> All genres
          </button>
        </div>
      </div>

      {/* Bottom-sheet genre grid */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex items-end sm:items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-vinyl/70 backdrop-blur-md"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl shadow-card border border-border/50 max-h-[85vh] overflow-hidden flex flex-col"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border/60">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Pick your vibe
                  </p>
                  <h2 className="font-display text-2xl font-black">All Genres</h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="h-9 w-9 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 p-4 overflow-y-auto">
                {GENRES.map((g) => {
                  const active = g.id === value;
                  return (
                    <motion.button
                      key={g.id}
                      onClick={() => handlePick(g.id)}
                      whileTap={{ scale: 0.96 }}
                      className={cn(
                        "relative min-h-[110px] overflow-hidden rounded-2xl text-left p-3 shadow-sm",
                        "bg-gradient-to-br text-primary-foreground transition-all",
                        g.gradient,
                        active && "ring-4 ring-foreground ring-offset-2 ring-offset-card"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-white/10" />
                      <div className="relative flex flex-col justify-between h-full">
                        <span className="text-3xl drop-shadow" aria-hidden>
                          {g.emoji}
                        </span>
                        <div className="mt-2">
                          <p className="font-display text-base font-black leading-tight drop-shadow">
                            {g.name}
                          </p>
                          <p className="text-[10px] leading-tight opacity-90 mt-1 line-clamp-2">
                            {g.description}
                          </p>
                          {active && (
                            <p className="text-[10px] font-bold uppercase tracking-wider opacity-90 mt-1.5">
                              ● Selected
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
