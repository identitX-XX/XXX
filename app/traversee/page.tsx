"use client";

// Banc d'essai — APERÇU des deux signatures visuelles (étape 1). Route neuve,
// non reliée : la racine `/` (l'ancien produit) reste intacte. Ici on ne
// « vit » pas les jours (ce sera la boucle de l'étape 2) : on simule l'évolution
// pour voir, d'un seul geste, le portrait se révéler et la constellation se
// simplifier de J1 à J30. ?day=N respecté.

import { useEffect, useState } from "react";
import { Portrait } from "../../traversee/components/Portrait";
import { Constellation } from "../../traversee/components/Constellation";
import { Etoile } from "../../traversee/types";
import { TERRITOIRE_KEYS, territoireByKey } from "../../traversee/content/territoires";
import { jourN, acteDuJour, ACTES } from "../../traversee/content/jours";
import { composerSignal, voiceClarity, registre } from "../../traversee/lib/voice";

// Netteté d'aperçu : 0 au J1 → 100 au J30 (le sweep complet).
const clarityApercu = (jour: number) => Math.round(((jour - 1) / 29) * 100);

// Constellation d'aperçu : pour chaque jour jusqu'à `jour`, on applique le geste
// sur le territoire du jour (alterné pour montrer les deux effets). Déterministe.
function apercuEtoiles(jour: number): Etoile[] {
  const et: Etoile[] = [];
  for (const t of TERRITOIRE_KEYS)
    for (let i = 0; i < 3; i++) et.push({ id: `${t}-${i}`, territoire: t, etat: "diffuse" });
  for (let d = 1; d <= jour; d++) {
    const j = jourN(d);
    if (!j) continue;
    const verbe = d % 2 === 0 ? "emporter" : "laisser";
    const terr = j.territoire;
    if (verbe === "laisser") {
      const c = et.find((e) => e.territoire === terr && e.etat === "diffuse");
      if (c) c.etat = "eteinte";
    } else {
      const c =
        et.find((e) => e.territoire === terr && e.etat === "diffuse") ??
        et.find((e) => e.territoire === terr);
      if (c) c.etat = "intense";
    }
  }
  return et;
}

const REG_LABEL: Record<string, string> = { brume: "Brume", assure: "Assuré", intime: "Intime" };

export default function BancTraversee() {
  const [jour, setJour] = useState(1);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("day");
    const n = p ? parseInt(p, 10) : NaN;
    if (!Number.isNaN(n)) setJour(Math.max(1, Math.min(30, n)));
  }, []);

  const contenu = jourN(jour);
  const clarity = clarityApercu(jour);
  const etoiles = apercuEtoiles(jour);
  const acte = ACTES.find((a) => a.key === acteDuJour(jour))!;
  const terr = contenu ? territoireByKey[contenu.territoire] : null;
  const reg = registre(voiceClarity(jour));
  const signal = contenu
    ? composerSignal(contenu, { prenom: "Marina", renoncements: ["le regard des autres"] })
    : "";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflowY: "auto",
        background:
          "radial-gradient(1000px 560px at 50% -6%, #17122a 0%, rgba(23,18,42,0) 60%), #08060f",
        color: "#ece8f4",
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px 160px", textAlign: "center" }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#e8823f",
            fontWeight: 600,
            margin: "0 0 6px",
          }}
        >
          Banc d'essai · aperçu
        </p>
        <p style={{ color: "#635d78", fontSize: 13, margin: "0 0 28px" }}>
          {acte.nom} — Jour {jour} · {terr?.nom} · registre {REG_LABEL[reg]}
        </p>

        {/* Constellation derrière (centrée sur le visage), portrait devant. */}
        <div style={{ position: "relative", width: 240, height: 300, margin: "0 auto 20px" }}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 110,
              transform: "translate(-50%, -50%)",
              opacity: 0.82,
              pointerEvents: "none",
            }}
          >
            <Constellation etoiles={etoiles} size={380} />
          </div>
          <div style={{ position: "relative" }}>
            <Portrait clarity={clarity} size={240} />
          </div>
        </div>

        {/* Le Signal du jour, dans son registre — au-dessus des étoiles. */}
        <p
          style={{
            position: "relative",
            zIndex: 2,
            fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
            fontSize: 19,
            lineHeight: 1.5,
            color: "#f2eef8",
            maxWidth: 34 + "em",
            margin: "0 auto",
            minHeight: 90,
          }}
        >
          {signal}
        </p>
      </div>

      {/* Le curseur des jours, fixé en bas. */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "18px 24px 26px",
          background: "linear-gradient(180deg, rgba(8,6,15,0) 0%, #08060f 40%)",
        }}
      >
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "#635d78",
              marginBottom: 8,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <span>Jour 1</span>
            <span style={{ color: "#ece8f4", fontWeight: 600 }}>Jour {jour}</span>
            <span>Jour 30</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            value={jour}
            onChange={(e) => setJour(parseInt(e.target.value, 10))}
            aria-label="Jour de la traversée"
            style={{ width: "100%", accentColor: "#ff4ea8" }}
          />
        </div>
      </div>
    </div>
  );
}
