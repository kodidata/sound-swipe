import { Disc3, Library, Flame } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="mx-auto max-w-md flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <Disc3 className="h-8 w-8 text-vinyl animate-spin-slow" strokeWidth={1.5} />
            <div className="absolute inset-[35%] rounded-full bg-gradient-tinder" />
          </div>
          <span className="font-display text-xl font-black tracking-tight">
            Tune<span className="text-gradient-tinder">Swipe</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <NavBtn to="/" active={pathname === "/"} icon={<Flame className="h-4 w-4" />} label="Discover" />
          <NavBtn to="/library" active={pathname === "/library"} icon={<Library className="h-4 w-4" />} label="Library" />
        </nav>
      </div>
    </header>
  );
}

function NavBtn({ to, active, icon, label }: { to: string; active: boolean; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
        active ? "bg-vinyl text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
