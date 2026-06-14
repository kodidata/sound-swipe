import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Music, Library } from "lucide-react";
import { NavLink } from "./NavLink";
import { cn } from "@/lib/utils";

export const AppHeader = () => {
  const location = useLocation();
  const isDiscover = location.pathname === "/";
  const isLibrary = location.pathname === "/library";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-sm"
    >
      <div className="mx-auto w-full max-w-md px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 8 }}
              className="text-2xl font-black bg-gradient-to-r from-rose-500 to-rose-400 bg-clip-text text-transparent"
            >
              TuneSwipe
            </motion.div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1 bg-muted rounded-full p-1">
            <NavLink
              to="/"
              icon={<Music className="h-4 w-4" />}
              label="Discover"
              active={isDiscover}
            />
            <NavLink
              to="/library"
              icon={<Library className="h-4 w-4" />}
              label="Library"
              active={isLibrary}
            />
          </nav>
        </div>
      </div>
    </motion.header>
  );
}