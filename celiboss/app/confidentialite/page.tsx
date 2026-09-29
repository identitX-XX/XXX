import type { Metadata } from "next";
import { PageLegale } from "@/components/ui/PageLegale";
import { DUREE_CONSERVATION } from "@/lib/candidature";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function Confidentialite() {
  return (
    <PageLegale titre="Politique de confidentialité" maj="29 septembre 2026">
      <p>
        La confiance est au cœur de notre métier. Cette page explique, simplement, quelles données
        nous collectons, pourquoi, et comment exercer vos droits (Règlement général sur la protection
        des données — RGPD — et loi Informatique et Libertés).
      </p>

      <h2>Qui est responsable ?</h2>
      <p>CéliBOSS™ — [À compléter : raison sociale, adresse], représentée par Maï Diaw. Contact : [À compléter : e-mail dédié].</p>

      <h2>Quelles données, pour quoi faire ?</h2>
      <ul>
        <li>
          <strong>Demande d&apos;appel découverte</strong> — prénom, e-mail, téléphone et ville
          (facultatifs), ce qui vous amène, votre message. But : vous recontacter et organiser
          l&apos;appel. Base légale : votre consentement.
        </li>
        <li>
          <strong>Journal par e-mail</strong> — votre e-mail, uniquement si vous avez coché la case.
          Base légale : votre consentement. Désinscription en un clic dans chaque envoi.
        </li>
        <li>
          <strong>Réservation du créneau</strong> — gérée par Cal.com, uniquement si vous affichez le
          calendrier.
        </li>
      </ul>
      <p>
        Nous ne collectons en ligne <strong>aucune donnée sensible</strong> (santé, convictions,
        orientation, origine…). Si ces sujets sont utiles à votre accompagnement, ils sont abordés en
        entretien, avec votre accord explicite.
      </p>

      <h2>Combien de temps ?</h2>
      <p>
        Demandes : {DUREE_CONSERVATION}, puis suppression. Journal : jusqu&apos;à votre
        désinscription. Membres accompagnés : durée de l&apos;accompagnement, puis archivage limité
        aux obligations légales.
      </p>

      <h2>Qui y a accès ?</h2>
      <p>
        Maï Diaw et, le cas échéant, son équipe. Vos données ne sont jamais vendues ni cédées. Nos
        prestataires techniques (sous-traitants) n&apos;y accèdent que pour nous rendre service :
      </p>
      <ul>
        <li>Vercel Inc. — hébergement du site (États-Unis, encadré par le Data Privacy Framework UE–US)</li>
        <li>Cal.com — prise de rendez-vous</li>
        <li>[À compléter : outil de réception des demandes / CRM / e-mailing]</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        Ce site ne dépose aucun cookie de mesure d&apos;audience ni de publicité : aucun bandeau de
        consentement n&apos;est donc nécessaire. Le calendrier Cal.com, qui peut déposer des cookies
        techniques, ne se charge que si vous le demandez.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez accéder à vos données, les rectifier, les effacer, en limiter le traitement, vous
        y opposer, les récupérer (portabilité) et retirer votre consentement à tout moment, en
        écrivant à [À compléter : e-mail]. Réponse sous un mois. Vous pouvez aussi saisir la CNIL
        (cnil.fr).
      </p>
    </PageLegale>
  );
}
