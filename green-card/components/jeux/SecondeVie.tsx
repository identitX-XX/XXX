"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { basculerInteret, conclureAnnonce, declarerAction, publierAnnonce, retirerAnnonce } from "@/app/jeux/actions-circulaire";
import { BoutonEnvoi, MessageErreur } from "@/components/Formulaire";
import { CATEGORIES, TYPES_ACTION, TYPES_ANNONCE, categorie, type Categorie } from "@/lib/jeux/circulaire";
import type { Gain } from "@/lib/points";
import { Celebration } from "./Celebration";

function ChoixCategorie({ nom = "categorie" }: { nom?: string }) {
  return (
    <fieldset>
      <legend className="etiquette">Quel objet ?</legend>
      <div className="grid grid-cols-2 gap-2">
        {CATEGORIES.map((c, i) => (
          <label key={c.id} className="cursor-pointer">
            <input type="radio" name={nom} value={c.id} defaultChecked={i === 0} className="peer sr-only" />
            <span className="flex min-h-[48px] items-center gap-2 rounded-2xl border-2 border-line px-3 text-sm font-medium peer-checked:border-green-600 peer-checked:bg-green-50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-green-600">
              <span aria-hidden className="text-lg">
                {c.emoji}
              </span>
              {c.nom}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// ---------------------------------------------------------------------------
// Déclarer une action
// ---------------------------------------------------------------------------
export function FormActionCirculaire() {
  const [etat, action] = useFormState(declarerAction, undefined);
  const [type, setType] = useState<string>("occasion");
  const [celebrer, setCelebrer] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (etat?.succes) {
      formRef.current?.reset();
      setType("occasion");
      setCelebrer(true);
    }
  }, [etat?.cle, etat?.succes]);

  const aide = TYPES_ACTION.find((t) => t.id === type)?.aide;

  return (
    <section className="space-y-4">
      {etat?.gain && celebrer && <Celebration gain={etat.gain} onFermer={() => setCelebrer(false)} />}

      <form ref={formRef} action={action} className="panneau space-y-5" noValidate>
        <h2 className="text-lg font-bold">Nouvelle action seconde vie</h2>

        <fieldset>
          <legend className="etiquette">Qu&apos;avez-vous fait ?</legend>
          <div className="grid grid-cols-2 gap-2">
            {TYPES_ACTION.map((t) => (
              <label
                key={t.id}
                className={`flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 p-3 text-center text-sm font-semibold ${
                  type === t.id ? "border-green-600 bg-green-50" : "border-line"
                }`}
              >
                <input type="radio" name="type" value={t.id} checked={type === t.id} onChange={() => setType(t.id)} className="sr-only" />
                <span aria-hidden className="text-2xl">
                  {t.emoji}
                </span>
                {t.nom}
              </label>
            ))}
          </div>
          {aide && <p className="aide">{aide}</p>}
        </fieldset>

        <ChoixCategorie />

        <div>
          <label htmlFor="description" className="etiquette">
            Quoi exactement ? <span className="font-normal text-muted">(facultatif)</span>
          </label>
          <input id="description" name="description" className="champ" maxLength={100} placeholder="ex. Manteau d'hiver pour ma fille" />
        </div>

        {type === "occasion" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="prixPaye" className="etiquette">
                Prix payé (€)
              </label>
              <input id="prixPaye" name="prixPaye" inputMode="decimal" className="champ" placeholder="ex. 8" />
            </div>
            <div>
              <label htmlFor="prixNeuf" className="etiquette">
                Prix neuf (€)
              </label>
              <input id="prixNeuf" name="prixNeuf" inputMode="decimal" className="champ" placeholder="ex. 35" />
            </div>
            <p className="aide col-span-2 -mt-1">Facultatif : pour calculer ce que vous avez économisé.</p>
          </div>
        )}

        {etat?.succes && (
          <p role="status" className="rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-text">
            ✅ {etat.succes}
          </p>
        )}
        <MessageErreur message={etat?.erreur} />
        <BoutonEnvoi enCours="Enregistrement…">Enregistrer</BoutonEnvoi>
      </form>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Mur des voisins
// ---------------------------------------------------------------------------
export interface AnnonceVue {
  id: string;
  type: string;
  categorie: string;
  titre: string;
  description: string;
  auteur: string;
  batiment: string | null;
  interesses: number;
  jeSuisInteresse: boolean;
}

export interface MonAnnonceVue {
  id: string;
  type: string;
  categorie: string;
  titre: string;
  statut: string;
  beneficiaire: string | null;
  interesses: { id: string; pseudo: string; batiment: string | null }[];
}

const typeAnnonce = (id: string) => TYPES_ANNONCE.find((t) => t.id === id);

function FormAnnonce({ onPubliee }: { onPubliee: () => void }) {
  const [etat, action] = useFormState(publierAnnonce, undefined);
  useEffect(() => {
    if (etat?.succes) onPubliee();
  }, [etat?.cle, etat?.succes, onPubliee]);

  return (
    <form action={action} className="panneau space-y-5" noValidate>
      <h2 className="text-lg font-bold">Nouvelle annonce</h2>
      <fieldset>
        <legend className="etiquette">Je souhaite…</legend>
        <div className="grid grid-cols-3 gap-2">
          {TYPES_ANNONCE.map((t, i) => (
            <label key={t.id} className="cursor-pointer">
              <input type="radio" name="type" value={t.id} defaultChecked={i === 0} className="peer sr-only" />
              <span className="flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-2xl border-2 border-line text-sm font-semibold peer-checked:border-green-600 peer-checked:bg-green-50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-green-600">
                <span aria-hidden className="text-xl">
                  {t.emoji}
                </span>
                {t.nom}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <ChoixCategorie />
      <div>
        <label htmlFor="titre-annonce" className="etiquette">
          Titre
        </label>
        <input id="titre-annonce" name="titre" className="champ" maxLength={60} placeholder="ex. Poussette en bon état" />
      </div>
      <div>
        <label htmlFor="description-annonce" className="etiquette">
          Description <span className="font-normal text-muted">(facultatif)</span>
        </label>
        <textarea id="description-annonce" name="description" rows={3} maxLength={300} className="champ min-h-[96px] py-3 text-base" placeholder="État, taille, disponibilités…" />
        <p className="aide">Pas de téléphone ni d&apos;e-mail : vous vous retrouverez dans la résidence.</p>
      </div>
      <MessageErreur message={etat?.erreur} />
      <BoutonEnvoi enCours="Publication…">Publier sur le mur</BoutonEnvoi>
    </form>
  );
}

export function MurVoisins({ annonces, miennes }: { annonces: AnnonceVue[]; miennes: MonAnnonceVue[] }) {
  const [ouvert, setOuvert] = useState(false);
  const [publiee, setPubliee] = useState(false);
  const [gain, setGain] = useState<Gain | null>(null);
  const [message, setMessage] = useState<string>();
  const [enCours, demarrer] = useTransition();

  const executer = (f: () => Promise<{ erreur?: string; gain?: Gain | null }>) =>
    demarrer(async () => {
      setMessage(undefined);
      const r = await f();
      if (r.erreur) setMessage(r.erreur);
      if (r.gain) setGain(r.gain);
    });

  const ouvertes = miennes.filter((a) => a.statut === "ouverte");
  const conclues = miennes.filter((a) => a.statut === "conclue");

  return (
    <div className="space-y-4">
      {gain && <Celebration gain={gain} onFermer={() => setGain(null)} />}
      {publiee && !ouvert && (
        <p role="status" className="rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-text">
          ✅ Votre annonce est visible par les voisins de la résidence.
        </p>
      )}
      {message && <MessageErreur message={message} />}

      {ouvert ? (
        <>
          <FormAnnonce
            onPubliee={() => {
              setOuvert(false);
              setPubliee(true);
            }}
          />
          <button type="button" className="btn-secondaire" onClick={() => setOuvert(false)}>
            Annuler
          </button>
        </>
      ) : (
        <button type="button" className="btn-primaire" onClick={() => setOuvert(true)}>
          🎁 Proposer un objet
        </button>
      )}

      {ouvertes.length > 0 && (
        <section aria-labelledby="titre-mes-annonces" className="space-y-2">
          <h2 id="titre-mes-annonces" className="text-lg font-bold">
            Mes annonces
          </h2>
          <ul className="space-y-3">
            {ouvertes.map((a) => {
              const t = typeAnnonce(a.type);
              return (
                <li key={a.id} className="panneau space-y-3">
                  <div>
                    <p className="text-xs text-muted">
                      {t?.emoji} {t?.nom} · {categorie(a.categorie)?.nom}
                    </p>
                    <p className="font-semibold">{a.titre}</p>
                  </div>
                  {a.interesses.length === 0 ? (
                    <p className="text-sm text-muted">Personne pour l&apos;instant. Les voisins intéressés apparaîtront ici.</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">
                        {a.interesses.length} voisin{a.interesses.length > 1 ? "s" : ""} intéressé{a.interesses.length > 1 ? "s" : ""} :
                      </p>
                      {a.interesses.map((v) => (
                        <div key={v.id} className="flex items-center justify-between gap-2 rounded-xl bg-bg p-2 pl-3 text-sm">
                          <span>
                            {v.pseudo}
                            {v.batiment ? ` · Bât. ${v.batiment}` : ""}
                          </span>
                          <button
                            type="button"
                            disabled={enCours}
                            onClick={() => executer(() => conclureAnnonce(a.id, v.id))}
                            className="min-h-[44px] shrink-0 rounded-xl bg-green-600 px-3 text-sm font-semibold text-white"
                          >
                            {t?.verbe} à {v.pseudo}
                          </button>
                        </div>
                      ))}
                      <p className="aide">Retrouvez-vous dans la résidence, puis confirmez ici une fois l&apos;objet remis.</p>
                    </div>
                  )}
                  <button type="button" disabled={enCours} onClick={() => executer(() => retirerAnnonce(a.id))} className="text-sm text-muted underline">
                    Retirer l&apos;annonce
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section aria-labelledby="titre-mur" className="space-y-2">
        <h2 id="titre-mur" className="text-lg font-bold">
          Dans la résidence
        </h2>
        {annonces.length === 0 && <p className="panneau text-center text-sm text-muted">Aucune annonce pour l&apos;instant. Lancez le mouvement !</p>}
        <ul className="space-y-3">
          {annonces.map((a) => {
            const t = typeAnnonce(a.type);
            const c = categorie(a.categorie as Categorie);
            return (
              <li key={a.id} className="panneau">
                <article aria-labelledby={`annonce-${a.id}`}>
                  <div className="flex items-start gap-3">
                    <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-green-100 text-2xl">
                      {c?.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted">
                        {t?.emoji} {t?.libelle} · {a.auteur}
                        {a.batiment ? ` · Bât. ${a.batiment}` : ""}
                      </p>
                      <h3 id={`annonce-${a.id}`} className="font-semibold leading-snug">
                        {a.titre}
                      </h3>
                      {a.description && <p className="mt-1 whitespace-pre-line text-sm text-muted">{a.description}</p>}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted">
                      {a.interesses > 0 ? `${a.interesses} intéressé${a.interesses > 1 ? "s" : ""}` : "Soyez le premier !"}
                    </span>
                    <button
                      type="button"
                      disabled={enCours}
                      aria-pressed={a.jeSuisInteresse}
                      onClick={() => executer(() => basculerInteret(a.id))}
                      className={`min-h-[44px] rounded-full border-2 px-4 text-sm font-semibold ${
                        a.jeSuisInteresse ? "border-green-600 bg-green-600 text-white" : "border-line bg-surface"
                      }`}
                    >
                      {a.jeSuisInteresse ? "✓ Intéressé·e" : "Ça m'intéresse"}
                    </button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>

      {conclues.length > 0 && (
        <section aria-labelledby="titre-conclues" className="space-y-2">
          <h2 id="titre-conclues" className="text-lg font-bold">
            Objets qui ont trouvé preneur
          </h2>
          <ul className="space-y-2 text-sm">
            {conclues.map((a) => (
              <li key={a.id} className="rounded-2xl bg-green-50 p-3">
                🤝 <strong>{a.titre}</strong> · {typeAnnonce(a.type)?.verbe.toLowerCase()} à {a.beneficiaire ?? "un voisin"}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
