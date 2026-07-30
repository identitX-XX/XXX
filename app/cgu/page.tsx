"use client";

// Conditions générales d'utilisation (CGU) + mentions légales. Rédigées pour être
// lisibles. L'éditeur et le contact sont configurables avant lancement :
// NEXT_PUBLIC_EDITEUR (nom/structure) et NEXT_PUBLIC_CONTACT_EMAIL.
// Ceci est une base de bon sens, pas un avis juridique.

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHead } from "@/components/ui";

const EDITEUR = process.env.NEXT_PUBLIC_EDITEUR ?? "";
const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";

export default function CGUPage() {
  return (
    <div>
      <PageHead
        eyebrow="Conditions d'utilisation"
        title="Les règles du jeu"
        sub="Ce qu'IdentitX te propose, ce qu'on attend de toi, et ce que l'app n'est pas. En clair, sans jargon."
      />

      <div className="flex flex-col gap-6">
        <Bloc titre="1. Objet">
          Les présentes conditions encadrent l'accès et l'usage d'IdentitX, un
          espace d'exploration identitaire (parcours, signatures, journal,
          scénarios). En utilisant l'app, tu acceptes ces conditions. Si tu n'es
          pas d'accord, n'utilise pas le service.
        </Bloc>

        <Bloc titre="2. Accès — phase de test">
          IdentitX est proposé <b>sur invitation</b>, dans une phase de test. L'accès
          se fait par un code ou ton email. Le service peut évoluer, être
          interrompu ou modifié à tout moment pendant cette phase, sans que cela
          ouvre droit à une quelconque compensation.
        </Bloc>

        <Bloc titre="3. Ce qu'IdentitX est — et n'est pas">
          IdentitX est un outil de <b>développement personnel et de réflexion</b>.
          Ce n'est <b>ni un dispositif médical, ni un avis psychologique,
          psychiatrique ou thérapeutique</b>. Les contenus — y compris ceux générés
          par l'IA (Coach, Scénarios) — sont des <b>hypothèses et des pistes</b>, pas
          des vérités ni des prescriptions. En cas de détresse ou de question de
          santé, adresse-toi à un professionnel de santé qualifié. En cas d'urgence,
          contacte le 15 (SAMU) ou le 112.
        </Bloc>

        <Bloc titre="4. Ton compte et ton usage">
          Tu es responsable de la confidentialité de ton accès et de l'usage que tu
          fais de l'app. Tu t'engages à un usage loyal : ne pas tenter de
          contourner la sécurité, de perturber le service, d'y injecter de contenus
          illicites, ni d'utiliser IdentitX pour nuire à autrui.
        </Bloc>

        <Bloc titre="5. Tes contenus">
          Ce que tu écris (profil, journal, réponses) <b>t'appartient</b>. Tu
          restes propriétaire de tes contenus. Tu accordes seulement à IdentitX le
          droit technique de les traiter pour te rendre le service (les afficher,
          les stocker localement, et — si tu utilises l'IA — les transmettre au
          sous-traitant qui génère la réponse). Le détail figure dans la{" "}
          <Link href="/confidentialite" className="text-fuchsia underline">
            politique de confidentialité
          </Link>
          .
        </Bloc>

        <Bloc titre="6. Propriété intellectuelle">
          L'app, sa marque, ses textes, son design et son moteur restent la
          propriété de l'éditeur. Ton invitation te donne un droit d'usage
          personnel et non exclusif, le temps de la phase de test. Tu ne peux ni
          copier, ni revendre, ni exploiter le service en dehors de cet usage.
        </Bloc>

        <Bloc titre="7. Responsabilité">
          IdentitX est fourni « en l'état », sans garantie de disponibilité ni
          d'absence d'erreur, particulièrement en phase de test. Dans les limites
          permises par la loi, l'éditeur ne saurait être tenu responsable des
          décisions que tu prends à partir des contenus proposés, ni des
          interruptions ou pertes de données locales (pense à exporter tes données
          depuis les Réglages).
        </Bloc>

        <Bloc titre="8. Données personnelles">
          Le traitement de tes données est décrit dans la{" "}
          <Link href="/confidentialite" className="text-fuchsia underline">
            politique de confidentialité
          </Link>
          , qui fait partie intégrante des présentes conditions. Tu y trouveras tes
          droits (accès, rectification, effacement, portabilité, opposition) et
          comment les exercer.
        </Bloc>

        <Bloc titre="9. Résiliation">
          Tu peux cesser d'utiliser IdentitX à tout moment et supprimer tes données
          (Réglages → Supprimer mes données). L'éditeur peut suspendre un accès en
          cas de manquement à ces conditions.
        </Bloc>

        <Bloc titre="10. Modifications">
          Ces conditions peuvent évoluer avec le service. La version applicable est
          celle en ligne au moment de ton utilisation.
        </Bloc>

        <Bloc titre="11. Droit applicable & litiges">
          Les présentes conditions sont soumises au <b>droit français</b>. En cas de
          différend, une solution amiable sera recherchée en priorité. À défaut, les
          tribunaux français sont compétents. Conformément à la réglementation, tu
          peux recourir à un médiateur de la consommation.
        </Bloc>

        <Bloc titre="Mentions légales">
          <ul className="mt-1 space-y-1.5">
            <Li>
              <b>Éditeur</b> : {EDITEUR || "— (à renseigner : nom / structure de l'éditrice)"}
            </Li>
            <Li>
              <b>Contact</b> :{" "}
              {CONTACT ? (
                <a className="text-fuchsia underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>
              ) : (
                "— (à renseigner : email de contact) — en attendant, « Ton mot à Marina » dans les Réglages"
              )}
            </Li>
            <Li>
              <b>Hébergement de l'application</b> : Vercel Inc. (États-Unis).
            </Li>
            <Li>
              <b>Hébergement des données</b> : Supabase (Union européenne).
            </Li>
          </ul>
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
