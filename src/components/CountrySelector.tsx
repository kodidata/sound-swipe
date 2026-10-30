import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COUNTRIES, getCountry } from "@/data/countries";
import { cn } from "@/lib/utils";
import { ChevronDown, X, Search, Globe2 } from "lucide-react";

type Props = {
  value: string;
  onChange: (code: string) => void;
};

const QUICK = ["us", "ge", "gb", "fr", "jp", "kr", "br"];

export function CountrySelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const current = getCountry(value);
  const quick = COUNTRIES.filter((c) => QUICK.includes(c.code)).sort(
    (a, b) => QUICK.indexOf(a.code) - QUICK.indexOf(b.code),
  );
  const marqueeCountries = [...COUNTRIES, ...COUNTRIES];

  const filtered = q.trim()
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(q.trim().toLowerCase()))
    : COUNTRIES;

  const pick = (code: string) => {
    onChange(code);
    setOpen(false);
    setQ("");
  };

  return (
    <div className="space-y-2.5">
      <div className="relative overflow-hidden -mx-4 px-4">
        <div className="marquee-track flex w-max items-center gap-2 py-1">
          {[...quick, ...quick].map((c, index) => {
            const active = c.code === value;
            return (
              <button
                key={`${c.code}-${index}`}
                type="button"
                onClick={() => onChange(c.code)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold whitespace-nowrap shrink-0",
                  active
                    ? "border-foreground bg-foreground/10 text-foreground"
                    : "border-border bg-card/80 text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="text-base leading-none" aria-hidden>{c.flag}</span>
                <span>{c.name.split(" / ")[0]}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-dashed border-border px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground whitespace-nowrap shrink-0"
          >
            <Globe2 className="h-3.5 w-3.5" />
            All
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 -mx-4 px-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-foreground text-background px-3 py-2 text-xs font-bold whitespace-nowrap shadow-sm shrink-0"
        >
          <span className="text-base leading-none" aria-hidden>{current.flag}</span>
          <span className="truncate max-w-[120px]">{current.name}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0" />
        </button>
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground px-1 shrink-0">
          from
        </span>
      </div>

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
              className="relative w-full max-w-md sm:max-w-lg bg-card rounded-t-3xl sm:rounded-3xl shadow-card border border-border/50 max-h-[85vh] overflow-hidden flex flex-col"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
            >
              <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-border/60">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Music origin
                  </p>
                  <h2 className="font-display text-xl sm:text-2xl font-black leading-tight truncate">
                    Pick a country
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="h-9 w-9 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center shrink-0"
                  aria-label="Close country chooser"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-4 pt-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    autoFocus
                    value={q}
                    onChange={(event) => setQ(event.target.value)}
                    placeholder="Search country..."
                    className="w-full rounded-full bg-muted/60 border border-border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30"
                  />
                </div>
              </div>

              <div className="overflow-y-auto p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filtered.map((c) => {
                  const active = c.code === value;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => pick(c.code)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all border min-h-[68px]",
                        active
                          ? "border-foreground bg-foreground text-background shadow-sm"
                          : "border-border bg-card hover:bg-muted/50",
                      )}
                    >
                      <span className="text-2xl leading-none shrink-0" aria-hidden>{c.flag}</span>
                      <span className="font-semibold text-sm truncate">{c.name}</span>
                    </button>
                  );
                })}

                {filtered.length === 0 && (
                  <p className="col-span-full text-center text-sm text-muted-foreground py-6">
                    No countries match “{q}”
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
