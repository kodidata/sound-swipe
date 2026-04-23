import { useEffect, useState } from "react";
import { getLibrary } from "@/services/storage";
import type { SavedTrack } from "@/types/music";

export function useLibrary() {
  const [items, setItems] = useState<SavedTrack[]>(() => getLibrary());

  useEffect(() => {
    const refresh = () => setItems(getLibrary());
    window.addEventListener("tuneswipe:library", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("tuneswipe:library", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return items;
}
