"use client";

import { useEffect, useRef, useState } from "react";

// Seule pièce cliente de la page : un fondu opacity 0→1 sur 400ms, déclenché
// UNE seule fois à l'entrée dans le viewport (IntersectionObserver natif,
// aucune dépendance). Désactivé si prefers-reduced-motion — le contenu paraît
// alors immédiatement, sans transition.
export function FadeIn({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReduced(true);
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect(); // une seule fois
            break;
          }
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transition: reduced ? "none" : "opacity 400ms ease",
      }}
    >
      {children}
    </div>
  );
}
