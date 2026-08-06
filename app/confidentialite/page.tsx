"use client";

// Politique de confidentialité (RGPD). Écrite pour être lue : ce qu'on collecte,
// pourquoi, qui le traite, combien de temps, et les droits — sans jargon.
// Le contact du responsable de traitement est configurable (à renseigner avant
// lancement) : NEXT_PUBLIC_CONTACT_EMAIL.

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHead } from "@/components/ui";

const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";

export default function ConfidentialitePage() {
  return (
    <div>
      <PageHead
        eyebrow="Confidentialité"
        title="Ce qu'on sait de toi, et pourquoi"
        sub="Constellation est local-first : l'essentiel de ta quête vit sur ton appareil. Voici, sans jargon, ce qui existe côté serveur, qui le traite — et tes droits."
      />

      <div className="flex flex-col gap-6">
        <Bloc titre="Ce qui reste sur ton appareil">
          Ton profil, tes réponses, ton journal, ta cartographie, ta signature et
          ta progression sont stockés localement dans ton navigateur. Ils ne
          partent nulle part tant que tu ne les exportes pas toi-même — à une
          exception près, ci-dessous, quand tu utilises les fonctions d'IA.
        </Bloc>

        <Bloc titre="Quand tu utilises le Coach ou les Scénarios">
          Ces deux fonctions s'appuient sur une IA. Pour te répondre, les{" "}
          <b>données pertinentes de ta quête</b> (extraits de profil, journal,
          cartographie) sont envoyées à notre sous-traitant <b>Mistral AI</b>, qui
          génère la réponse puis ne la conserve pas pour t'identifier. Mistral est{" "}
          <b>hébergé en Union européenne</b>. Si tu préfères ne rien transmettre,
          n'utilise simplement pas ces deux fonctions : le reste de l'app marche
          sans elles.
        </Bloc>

        <Bloc titre="Ce qui va sur le serveur (UE), avec ton accord">
          Des <b>mesures d'usage</b> anonymes (des événements comme « app ouverte »,
          rattachés à un identifiant aléatoire, jamais à ton nom ni à tes contenus
          intimes), pour comprendre ce qui aide — uniquement si tu y consens. Si tu
          le laisses, ton <b>email</b>, pour t'ouvrir l'espace et te recontacter.
          Ton <b>feedback libre</b> est enregistré quand tu l'envoies.
        </Bloc>

        <Bloc titre="Qui traite tes données (sous-traitants)">
          <ul className="mt-1 space-y-1.5">
            <Li>
              <b>Supabase</b> — base de données (mesures, email, feedback),{" "}
              hébergée en <b>UE</b>.
            </Li>
            <Li>
              <b>Mistral AI</b> — génération du Coach et des Scénarios, en{" "}
              <b>UE</b>.
            </Li>
            <Li>
              <b>Vercel</b> — hébergement de l'application (société américaine) ;
              le transfert éventuel hors UE est encadré par les clauses
              contractuelles types de la Commission européenne.
            </Li>
          </ul>
        </Bloc>

        <Bloc titre="Base légale & durée">
          La mesure d'usage repose sur ton <b>consentement</b> (la bannière à
          l'ouverture) ; l'email et le feedback, sur la fourniture du service et
          notre intérêt légitime à l'améliorer. Tes données côté serveur sont
          conservées le temps de la phase de test, puis supprimées — et à tout
          moment sur ta demande.
        </Bloc>

        <Bloc titre="Ce qu'on ne fait pas">
          Pas de revente de données, pas de publicité, pas de traceurs tiers, pas
          de profilage vendu à qui que ce soit. Aucune donnée sensible n'est requise.
        </Bloc>

        <Bloc titre="Tes droits">
          Tu peux à tout moment <b>accéder</b> à tes données, les <b>rectifier</b>,
          les <b>exporter</b> (Réglages → Export JSON) et demander leur{" "}
          <b>suppression</b> (Réglages → Supprimer mes données) : cela efface le
          local et, côté serveur, tout ce qui est rattaché à ton identifiant. Tu
          peux aussi retirer ton consentement à la mesure quand tu veux. Enfin, tu
          as le droit d'introduire une réclamation auprès de la <b>CNIL</b>{" "}
          (cnil.fr).
        </Bloc>

        <Bloc titre="Contact">
          Pour toute question ou demande sur tes données, écris-nous
          {CONTACT ? (
            <>
              {" "}à <a className="text-fuchsia underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>.
            </>
          ) : (
            <> via « Ton mot à Marina » dans les Réglages.</>
          )}
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
      <div className="mt-2 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span
        className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full"
        style={{ background: "var(--fuchsia)" }}
      />
      <span>{children}</span>
    </li>
  );
}
