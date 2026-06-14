import { motion, AnimatePresence } from "framer-motion";
import { GENRES } from "@/data/genres";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface GenreSelectorProps {
  value: string;
  onChange: (genreId: string) => void;
}

export const GenreSelector = ({ value, onChange }: GenreSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedGenre = GENRES.find((g) => g.id === value);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-2xl bg-card hover:bg-card/80 border border-border transition-all shadow-sm flex items-center justify-between group"
      >
        <div className="flex items-center gap-3 text-left flex-1">
          <span className="text-xl">{selectedGenre?.emoji}</span>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Genre</p>
            <p className="font-semibold text-foreground">{selectedGenre?.name}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-card border border-border shadow-lg z-50 overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto">
              {GENRES.map((genre) => (
                <motion.button
                  key={genre.id}
                  onClick={() => {
                    onChange(genre.id);
                    setIsOpen(false);
                  }}
                  whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                  className={cn(
                    "w-full px-4 py-3 text-left flex items-center gap-3 transition-colors border-b border-border/50 last:border-0",
                    value === genre.id && "bg-muted"
                  )}
                >
                  <span className="text-lg">{genre.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{genre.name}</p>
                    {genre.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{genre.description}</p>
                    )}
                  </div>
                  {value === genre.id && (
                    <motion.div
                      layoutId="genre-check"
                      className="w-2 h-2 rounded-full bg-rose-500"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}