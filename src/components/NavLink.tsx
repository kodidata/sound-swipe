import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

export const NavLink = ({ to, icon, label, active }: NavLinkProps) => {
  return (
    <Link to={to}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative px-3 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1.5",
          active
            ? "text-foreground bg-background shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {active && (
          <motion.div
            layoutId="nav-highlight"
            className="absolute inset-0 rounded-full bg-background shadow-sm -z-10"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </motion.button>
    </Link>
  );
}