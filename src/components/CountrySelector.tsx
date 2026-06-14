import { motion, AnimatePresence } from "framer-motion";
import { COUNTRIES } from "@/data/countries";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";

interface CountrySelectorProps {
  value: string;
  onChange: (countryCode: string) => void;
}

export const CountrySelector = ({ value, onChange }: CountrySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selectedCountry = COUNTRIES.find((c) => c.code === value);

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-2xl bg-card hover:bg-card/80 border border-border transition-all shadow-sm flex items-center justify-between group"
      >
        <div className="flex items-center gap-3 text-left flex-1">
          <span className="text-2xl">{selectedCountry?.flag}</span>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Region</p>
            <p className="font-semibold text-foreground">{selectedCountry?.name}</p>
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
            {/* Search Input */}
            <div className="sticky top-0 p-3 bg-card border-b border-border/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  autoFocus
                />
              </div>
            </div>

            {/* Country List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <motion.button
                    key={country.code}
                    onClick={() => {
                      onChange(country.code);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                    className={cn(
                      "w-full px-4 py-3 text-left flex items-center gap-3 transition-colors border-b border-border/50 last:border-0",
                      value === country.code && "bg-muted"
                    )}
                  >
                    <span className="text-xl">{country.flag}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{country.name}</p>
                      <p className="text-xs text-muted-foreground">{country.code.toUpperCase()}</p>
                    </div>
                    {value === country.code && (
                      <motion.div
                        layoutId="country-check"
                        className="w-2 h-2 rounded-full bg-rose-500"
                      />
                    )}
                  </motion.button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  No countries found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}