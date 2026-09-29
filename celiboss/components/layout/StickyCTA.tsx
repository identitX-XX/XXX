"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CTA } from "@/components/ui/CTA";

// Mobile uniquement : le bouton unique reste à portée de pouce une fois le
// premier écran passé. Masqué sur /appel (on y est déjà) et près du pied de page.
export function StickyCTA() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const maj = () => {
      const bas = window.innerHeight + window.scrollY > document.body.scrollHeight - 320;
      setVisible(window.scrollY > window.innerHeight * 0.8 && !bas);
    };
    maj();
    window.addEventListener("scroll", maj, { passive: true });
    return () => window.removeEventListener("scroll", maj);
  }, [pathname]);

  if (pathname.startsWith("/appel")) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-champagne/35 bg-nuit/95 p-3 backdrop-blur transition-[transform,visibility] duration-300 md:hidden ${
        visible ? "visible translate-y-0" : "invisible translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <CTA ton="or" pleine />
    </div>
  );
}
