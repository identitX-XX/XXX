"use client";

// Politique de confidentialité (RGPD). Écrite pour être lue : ce qu'on collecte,
// pourquoi, où c'est stocké, et les droits — sans jargon.

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHead } from "@/components/ui";

export default function ConfidentialitePage() {
  return (
    <div>
      <PageHead
        eyebrow="Confidentialité"
        title="Ce qu'on sait de toi, et pourquoi"
        sub="IdentitX est local-first : l'essentiel de ta quête vit sur ton appareil. Voici, sans jargon, ce qui existe côté serveur — et tes droits."
      />

      <div className="flex flex-col gap-6">
        <Bloc titre="Ce qui reste sur ton appareil">
          Ton profil, tes réponses, ton journal, ton archétype et ta progression
          sont stockés localement dans ton navigateur. Ils ne partent nulle part
          tant que tu ne les exportes pas toi-même.
        </Bloc>

        <Bloc titre="Ce qui va sur le serveur (UE)">
          Deux choses, et seulement si tu y consens : des <b>mesures d'usage</b>{" "}
          anonymes (des événements comme « app ouverte », rattachés à un
          identifiant aléatoire, jamais à ton nom) pour comprendre ce qui aide
          vraiment ; et, si tu le laisses, ton <b>email</b> — pour t'ouvrir
          l'espace et te recontacter. Ton <b>feedback libre</b> est enregistré
          quand tu l'envoies. L'hébergement est en Union européenne.
        </Bloc>

        <Bloc titre="Ce qu'on ne fait pas">
          Pas de revente de données, pas de publicité, pas de traceurs tiers, pas
          de profilage vendu à qui que ce soit. Aucune donnée sensible n'est
          requise.
        </Bloc>

        <Bloc titre="Le consentement">
          La mesure d'usage ne démarre qu'après ton accord explicite (la bannière
          à l'ouverture). Tu peux le refuser : l'app fonctionne à l'identique.
        </Bloc>

        <Bloc titre="Tes droits">
          Tu peux à tout moment <b>exporter</b> tes données (Réglages → Export
          JSON) et demander leur <b>suppression</b> (Réglages → Supprimer mes
          données) : cela efface tes données locales et, côté serveur, tout ce qui
          est rattaché à ton identifiant. Pour toute question, écris à Marina via{" "}
          « Ton mot à Marina » dans les Réglages.
        </Bloc>
      </div>

      <Link
        href="/settings"
        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-fuchsia"
      >
        <ArrowLeft size={15} /> Retour aux réglages
      </Link>
    </div>
  );
}

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-soft sm:p-6 animate-fade-up">
      <h2 className="font-display text-lg font-light text-ink">{titre}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{children}</p>
    </section>
  );
}
