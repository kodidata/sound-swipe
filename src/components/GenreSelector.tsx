import { GENRES } from "@/data/genres";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Props = {
  value: string;
  onChange: (id: string) => void;
};

export function GenreSelector({ value, onChange }: Props) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 scrollbar-none">
      <div className="flex gap-2 w-max">
        {GENRES.map((g) => {
          const active = g.id === value;
          return (
            <button
              key={g.id}
              onClick={() => onChange(g.id)}
              className={cn(
                "relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-all",
                "border whitespace-nowrap",
                active
                  ? "border-transparent text-primary-foreground shadow-card"
                  : "border-border bg-card/70 text-foreground hover:bg-card"
              )}
            >
              {active && (
                <motion.div
                  layoutId="genre-pill"
                  className={cn("absolute inset-0 rounded-full bg-gradient-to-r", g.gradient)}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative">{g.emoji}</span>
              <span className="relative">{g.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
