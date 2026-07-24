// traversee/lib/exportArtefact.ts
// Export de l'artefact final — SANS serveur. Rendu sur un <canvas> (image PNG)
// et en texte brut. Ne s'exécute qu'en navigateur (document/canvas).

import { Artefact } from "./artefact";
import { Etoile } from "../types";
import { constellationLayout } from "./constellation";

const W = 1080;
const MARGE = 96;
const MAXW = W - MARGE * 2;

const SERIF = 'Georgia, "Iowan Old Style", "Times New Roman", serif';
const SANS = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

function lignes(ctx: CanvasRenderingContext2D, texte: string, maxW: number): string[] {
  const mots = texte.split(" ");
  const out: string[] = [];
  let ligne = "";
  for (const m of mots) {
    const essai = ligne ? `${ligne} ${m}` : m;
    if (ctx.measureText(essai).width > maxW && ligne) {
      out.push(ligne);
      ligne = m;
    } else {
      ligne = essai;
    }
  }
  if (ligne) out.push(ligne);
  return out;
}

// Dessine le poster et renvoie sa hauteur. Deux passes gérées via canvas haut.
function dessiner(artefact: Artefact, etoiles: Etoile[]): HTMLCanvasElement {
  const mesure = document.createElement("canvas").getContext("2d")!;
  // Pré-calcule les lignes de la lettre et du pacte pour dimensionner.
  mesure.font = `34px ${SERIF}`;
  const paras = artefact.lettre.map((p) => lignes(mesure, p, MAXW));
  mesure.font = `600 30px ${SANS}`;
  const pacte = artefact.pacte.map((p) => lignes(mesure, p, MAXW));

  const H_CONSTEL = 380;
  const LH_LETTRE = 50;
  const LH_PACTE = 46;
  let h = 90; // eyebrow
  h += H_CONSTEL;
  h += 96; // nom
  h += 48; // sous-titre
  for (const p of paras) h += p.length * LH_LETTRE + 22;
  h += 60; // divider
  for (const p of pacte) h += p.length * LH_PACTE + 8;
  h += 120; // footer
  const HAUT = Math.max(1350, Math.round(h));

  const c = document.createElement("canvas");
  c.width = W;
  c.height = HAUT;
  const ctx = c.getContext("2d")!;

  // Fond : le vide, une lueur en haut.
  ctx.fillStyle = "#08060f";
  ctx.fillRect(0, 0, W, HAUT);
  const g = ctx.createRadialGradient(W / 2, -80, 40, W / 2, -80, 640);
  g.addColorStop(0, "rgba(35,24,54,.9)");
  g.addColorStop(1, "rgba(35,24,54,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 520);

  let y = 84;

  // Eyebrow
  ctx.textAlign = "center";
  ctx.fillStyle = "#e8823f";
  ctx.font = `600 22px ${SANS}`;
  ctx.fillText("I D E N T I T X   ·   L A   T R A V E R S É E", W / 2, y);
  y += 40;

  // Constellation (état final), centrée.
  const cx = W / 2;
  const ccy = y + H_CONSTEL / 2;
  const R = 150;
  for (const p of constellationLayout(etoiles)) {
    const px = cx + (p.x - 50) / 50 * R;
    const py = ccy + (p.y - 50) / 50 * R;
    const intense = p.etat === "intense";
    ctx.beginPath();
    ctx.arc(px, py, intense ? 9 : p.etat === "eteinte" ? 2.5 : 5, 0, Math.PI * 2);
    ctx.fillStyle = intense ? "#ff4ea8" : "#b9b0d8";
    ctx.globalAlpha = p.opacity;
    if (intense) {
      ctx.shadowColor = "rgba(255,78,168,.9)";
      ctx.shadowBlur = 22;
    }
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
  y += H_CONSTEL;

  // Nom
  ctx.fillStyle = "#ff5cae";
  ctx.font = `44px ${SERIF}`;
  ctx.fillText(artefact.nom, W / 2, y);
  y += 52;
  ctx.fillStyle = "#635d78";
  ctx.font = `500 22px ${SANS}`;
  ctx.fillText("celle que tu es devenue", W / 2, y);
  y += 60;

  // Lettre (alignée à gauche)
  ctx.textAlign = "left";
  ctx.fillStyle = "#e7e2f2";
  ctx.font = `34px ${SERIF}`;
  for (const p of paras) {
    for (const l of p) {
      ctx.fillText(l, MARGE, y);
      y += LH_LETTRE;
    }
    y += 22;
  }

  // Divider
  y += 8;
  ctx.strokeStyle = "#2f2643";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(MARGE, y);
  ctx.lineTo(W - MARGE, y);
  ctx.stroke();
  y += 44;

  // Pacte
  ctx.fillStyle = "#f2eef8";
  ctx.font = `600 30px ${SANS}`;
  for (const p of pacte) {
    for (const l of p) {
      ctx.fillText(l, MARGE, y);
      y += LH_PACTE;
    }
    y += 8;
  }

  // Footer
  ctx.textAlign = "center";
  ctx.fillStyle = "#4a4560";
  ctx.font = `500 20px ${SANS}`;
  ctx.fillText("Trente jours. On choisit ce qu'on emporte.", W / 2, HAUT - 60);

  return c;
}

function telecharger(href: string, nom: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = nom;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function exporterImage(artefact: Artefact, etoiles: Etoile[]) {
  const c = dessiner(artefact, etoiles);
  c.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    telecharger(url, "la-traversee.png");
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }, "image/png");
}

export function texteArtefact(artefact: Artefact): string {
  return [artefact.nom, "", ...artefact.lettre, "", "—", ...artefact.pacte, "", "IdentitX — La Traversée"].join("\n");
}

export function exporterTexte(artefact: Artefact) {
  const blob = new Blob([texteArtefact(artefact)], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  telecharger(url, "la-traversee.txt");
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
