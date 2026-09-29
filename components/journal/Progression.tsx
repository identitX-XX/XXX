"use client";

import { useEffect, useState } from "react";

/** Filet de progression de lecture, sous l'en-tête. */
export function Progression() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const maj = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    maj();
    window.addEventListener("scroll", maj, { passive: true });
    return () => window.removeEventListener("scroll", maj);
  }, []);
  return (
    <div aria-hidden className="fixed inset-x-0 top-[4.5rem] z-30 xl:top-[5.5rem] h-0.5 origin-left bg-bordeaux" style={{ transform: `scaleX(${p})` }} />
  );
}
