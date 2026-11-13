"use client";

import { useState, useTransition } from "react";
import { annulerCommande, commanderCadeau, participerTirage } from "@/app/cadeaux/actions";
import { MessageErreur } from "@/components/Formulaire";
import { IllustrationCadeau } from "@/components/IllustrationCadeau";
import { STATUTS_COMMANDE } from "@/lib/cadeaux";
import { formaterPoints } from "@/lib/carte";

export interface CadeauVue {
  id: string;
  nom: string;
  description: string;
  prix: number;
  stock: number | null;
  tailles: string[] | null;
  dejaCommande: boolean;
}

export interface CommandeVue {
  id: string;
  nom: string;
  taille: string | null;
  points: number;
  code: string;
  statut: string;
  date: string;
}

// ---------------------------------------------------------------------------
// Grand prix
// ---------------------------------------------------------------------------
export function GrandPrix(p: {
  tirageId: string;
  libelle: string;
  nom: string;
  description: string;
  cloture: string;
  inscrit: boolean;
  gold: boolean;
  casesValidees: number;
  inscrits: number;
  gagnant: { pseudo: string; residence: string; moi: boolean } | null;
}) {
  const [message, setMessage] = useState<string>();
  const [enCours, demarrer] = useTransition();
  const date = new Date(p.cloture).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <section aria-labelledby="titre-grand-prix" className="overflow-hidden rounded-carte border-2 border-cdc-red bg-surface">
      <div className="h-40 bg-[#dff2fb]">
        <IllustrationCadeau id="sejour" className="object-cover" />
      </div>
      <div className="space-y-3 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-cdc-red">🏆 {p.libelle}</p>
        <h2 id="titre-grand-prix" className="text-xl font-bold leading-tight">
          {p.nom}
        </h2>
        <p className="text-sm text-muted">{p.description}</p>

        {p.gagnant ? (
          <p role="status" className={`rounded-2xl p-4 text-sm font-semibold ${p.gagnant.moi ? "bg-green-50 text-green-text" : "bg-bg"}`}>
            {p.gagnant.moi
              ? "🎉 Vous avez gagné ! Votre agence CDC Habitat va vous contacter pour organiser votre séjour."
              : `🎉 Le tirage a eu lieu. Bravo à ${p.gagnant.pseudo} (${p.gagnant.residence}) !`}
          </p>
        ) : (
          <>
            <ul className="space-y-1 text-sm">
              <li>
                {p.gold ? "✅" : "⬜"} Une carte Gold : les 10 cases tamponnées{" "}
                {!p.gold && <span className="text-muted">(vous en êtes à {p.casesValidees}/10)</span>}
              </li>
              <li>{p.inscrit ? "✅" : "⬜"} Votre inscription au tirage (gratuite)</li>
              <li>📅 Tirage au sort le {date}</li>
            </ul>
            {p.inscrit ? (
              <p role="status" className="rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-text">
                🍀 Vous participez au tirage ! {p.inscrits} foyer{p.inscrits > 1 ? "s" : ""} inscrit{p.inscrits > 1 ? "s" : ""}. Bonne chance !
              </p>
            ) : (
              <button
                type="button"
                className={p.gold ? "btn-primaire" : "btn-secondaire text-muted"}
                disabled={!p.gold || enCours}
                onClick={() =>
                  demarrer(async () => {
                    const r = await participerTirage(p.tirageId);
                    setMessage(r.erreur);
                  })
                }
              >
                {p.gold ? "🍀 Je participe au tirage" : "Réservé aux cartes Gold"}
              </button>
            )}
            <MessageErreur message={message} />
          </>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Boutique
// ---------------------------------------------------------------------------
function FicheCadeau({ c, solde }: { c: CadeauVue; solde: number }) {
  const [taille, setTaille] = useState<string | null>(null);
  const [confirmer, setConfirmer] = useState(false);
  const [code, setCode] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [enCours, demarrer] = useTransition();

  const epuise = c.stock !== null && c.stock <= 0;
  const manque = Math.max(0, c.prix - solde);

  function commander() {
    setMessage(undefined);
    demarrer(async () => {
      const r = await commanderCadeau(c.id, taille);
      setConfirmer(false);
      if (r.erreur) setMessage(r.erreur);
      else setCode(r.code);
    });
  }

  return (
    <li className="panneau overflow-hidden p-0">
      <article aria-labelledby={`cadeau-${c.id}`}>
        <div className="h-36 bg-green-50 p-3">
          <IllustrationCadeau id={c.id} />
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 id={`cadeau-${c.id}`} className="font-bold leading-tight">
              {c.nom}
            </h3>
            <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-text">{formaterPoints(c.prix)} pts</span>
          </div>
          <p className="text-sm text-muted">{c.description}</p>
          {c.stock !== null && !epuise && c.stock <= 10 && <p className="text-xs font-semibold text-alert">Plus que {c.stock} exemplaires !</p>}

          {code ? (
            <div role="status" className="space-y-2 rounded-2xl bg-green-50 p-4 text-sm text-green-text">
              <p className="font-semibold">🎉 C&apos;est commandé !</p>
              <p>
                Votre code de retrait : <strong className="font-mono text-base tracking-wider">{code}</strong>
              </p>
              <p className="text-muted">Présentez-le au bureau du gardien ou à votre agence quand le cadeau sera prêt.</p>
            </div>
          ) : c.dejaCommande ? (
            <p className="rounded-2xl bg-bg p-3 text-sm">✅ Déjà commandé (un par foyer)</p>
          ) : epuise ? (
            <p className="rounded-2xl bg-bg p-3 text-sm text-muted">Épuisé pour le moment</p>
          ) : (
            <>
              {c.tailles && (
                <fieldset>
                  <legend className="etiquette">Taille</legend>
                  <div className="flex gap-2">
                    {c.tailles.map((t) => (
                      <label key={t} className="flex-1 cursor-pointer">
                        <input type="radio" name={`taille-${c.id}`} value={t} checked={taille === t} onChange={() => setTaille(t)} className="peer sr-only" />
                        <span className="flex min-h-[44px] items-center justify-center rounded-xl border-2 border-line text-sm font-semibold peer-checked:border-green-600 peer-checked:bg-green-50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-green-600">
                          {t}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
              {manque > 0 ? (
                <p className="rounded-2xl bg-bg p-3 text-sm">
                  Encore <strong>{formaterPoints(manque)} GreenPoints</strong> à gagner.
                </p>
              ) : confirmer ? (
                <div className="space-y-2 rounded-2xl border-2 border-green-600 p-3">
                  <p className="text-sm font-semibold">
                    Échanger {formaterPoints(c.prix)} GreenPoints contre {c.nom.toLowerCase()}
                    {taille ? ` (taille ${taille})` : ""} ?
                  </p>
                  <div className="flex gap-2">
                    <button type="button" className="btn-primaire" onClick={commander} disabled={enCours}>
                      {enCours ? "Un instant…" : "Oui, je confirme"}
                    </button>
                    <button type="button" className="btn-secondaire" onClick={() => setConfirmer(false)}>
                      Non
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-primaire"
                  onClick={() => (c.tailles && !taille ? setMessage("Choisissez une taille.") : (setMessage(undefined), setConfirmer(true)))}
                >
                  Échanger mes points
                </button>
              )}
            </>
          )}
          <MessageErreur message={message} />
        </div>
      </article>
    </li>
  );
}

export function Boutique({ cadeaux, solde }: { cadeaux: CadeauVue[]; solde: number }) {
  return (
    <section aria-labelledby="titre-boutique" className="space-y-3">
      <h2 id="titre-boutique" className="text-lg font-bold">
        La boutique Green Card
      </h2>
      <ul className="space-y-4">
        {cadeaux.map((c) => (
          <FicheCadeau key={c.id} c={c} solde={solde} />
        ))}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Mes commandes
// ---------------------------------------------------------------------------
export function MesCommandes({ commandes }: { commandes: CommandeVue[] }) {
  const [message, setMessage] = useState<string>();
  const [enCours, demarrer] = useTransition();
  if (commandes.length === 0) return null;

  return (
    <section aria-labelledby="titre-commandes" className="space-y-3">
      <h2 id="titre-commandes" className="text-lg font-bold">
        Mes commandes
      </h2>
      <MessageErreur message={message} />
      <ul className="space-y-2">
        {commandes.map((c) => {
          const s = STATUTS_COMMANDE[c.statut];
          return (
            <li key={c.id} className={`rounded-2xl border border-line bg-surface p-4 text-sm ${c.statut === "annulee" ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    {c.nom}
                    {c.taille ? ` · ${c.taille}` : ""}
                  </p>
                  <p className="text-muted">
                    {new Date(c.date).toLocaleDateString("fr-FR")} · {formaterPoints(c.points)} pts
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-bg px-2 py-1 text-xs font-semibold">
                  {s?.emoji} {s?.libelle}
                </span>
              </div>
              {c.statut !== "annulee" && c.statut !== "remise" && (
                <p className="mt-2">
                  Code de retrait : <strong className="font-mono tracking-wider">{c.code}</strong>
                </p>
              )}
              {c.statut === "a-preparer" && (
                <button
                  type="button"
                  disabled={enCours}
                  onClick={() =>
                    demarrer(async () => {
                      const r = await annulerCommande(c.id);
                      setMessage(r.erreur);
                    })
                  }
                  className="mt-2 min-h-[44px] text-sm text-muted underline"
                >
                  Annuler et récupérer mes points
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
