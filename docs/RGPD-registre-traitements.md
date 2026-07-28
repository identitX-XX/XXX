# Registre des activités de traitement — IdentitX

Document interne de conformité (RGPD, article 30). Il recense les traitements de
données personnelles réalisés par IdentitX. À tenir à jour à chaque évolution.

> ⚠️ Base de bon sens, pas un avis juridique. À faire relire par un professionnel
> avant une ouverture publique à grande échelle.

**Dernière mise à jour :** _[À COMPLÉTER — date]_

---

## Responsable de traitement

| Champ | Valeur |
|---|---|
| Nom / structure | _[À COMPLÉTER — ex. « Marina Bignon, entrepreneure individuelle »]_ |
| Statut | _[À COMPLÉTER — ex. entrepreneure individuelle / micro-entreprise / société]_ |
| Adresse | _[À COMPLÉTER]_ |
| Email de contact | _[À COMPLÉTER — = `NEXT_PUBLIC_CONTACT_EMAIL`]_ |
| Délégué à la protection des données (DPO) | Non désigné (non obligatoire à cette échelle) |

*(Ces valeurs alimentent aussi les pages `/confidentialite` et `/cgu` via les
variables `NEXT_PUBLIC_EDITEUR` et `NEXT_PUBLIC_CONTACT_EMAIL`.)*

---

## Sous-traitants (destinataires)

| Sous-traitant | Rôle | Localisation | Transfert hors UE | DPA à signer |
|---|---|---|---|---|
| **Supabase** | Base de données (mesures, email, feedback) | Union européenne | Non | Oui — DPA standard Supabase |
| **Mistral AI** | Génération IA (Coach, Scénarios) | Union européenne | Non | Oui — DPA / CGU Mistral |
| **Vercel** | Hébergement de l'application | États-Unis | Oui — encadré par **Clauses Contractuelles Types** (CCT) de la Commission européenne | Oui — DPA standard Vercel |

---

## Traitements recensés

### T1 — Accès & identification (email)
- **Finalité :** ouvrir l'accès sur invitation, recontacter la testeuse.
- **Personnes concernées :** testeuses invitées.
- **Données :** adresse email, identifiant anonyme (aléatoire).
- **Base légale :** exécution du service / consentement (email saisi volontairement).
- **Destinataires :** Supabase (UE).
- **Transfert hors UE :** non (hébergement app Vercel US : voir T6).
- **Durée de conservation :** durée de la phase de test, puis suppression ; à tout moment sur demande.
- **Sécurité :** clé service côté serveur uniquement, HTTPS, accès restreint.

### T2 — Mesure d'usage (analytics)
- **Finalité :** comprendre l'usage réel (activation, rétention) pour améliorer le service.
- **Personnes concernées :** utilisatrices ayant consenti.
- **Données :** événements techniques (ex. « app ouverte », « scénario généré »), rattachés à un **identifiant aléatoire** — jamais au nom ni aux contenus intimes.
- **Base légale :** **consentement** (bannière à l'ouverture, révocable).
- **Destinataires :** Supabase (UE).
- **Durée de conservation :** durée de la phase de test, puis suppression.
- **Sécurité :** identifiant pseudonyme, aucune donnée de contenu.

### T3 — Feedback libre
- **Finalité :** recueillir les retours des testeuses pour améliorer l'app.
- **Personnes concernées :** utilisatrices envoyant un feedback.
- **Données :** texte libre saisi + identifiant anonyme + page d'origine.
- **Base légale :** intérêt légitime (amélioration) / consentement (envoi volontaire).
- **Destinataires :** Supabase (UE).
- **Durée de conservation :** durée de la phase de test, puis suppression.

### T4 — Génération par IA (Coach & Scénarios)
- **Finalité :** produire des lectures et scénarios personnalisés à la demande.
- **Personnes concernées :** utilisatrices activant ces fonctions.
- **Données :** extraits pertinents de la quête (profil, journal, cartographie) transmis au moteur pour générer la réponse.
- **Base légale :** exécution du service (fonction demandée par l'utilisatrice).
- **Destinataires :** Mistral AI (UE).
- **Transfert hors UE :** non (Mistral UE).
- **Durée de conservation :** non conservées de façon identifiante par le sous-traitant ; côté IdentitX, la conversation reste **locale** sur l'appareil.
- **Sécurité :** appel serveur à serveur, clé API côté serveur uniquement.

### T5 — Preuve de consentement
- **Finalité :** conserver une trace horodatée du consentement (obligation RGPD).
- **Données :** identifiant anonyme, valeur du consentement, version, horodatage.
- **Base légale :** obligation légale.
- **État actuel :** le consentement est **appliqué côté client** (localStorage) ; la table serveur `consents` existe mais n'est pas encore alimentée. **Action recommandée :** journaliser le consentement côté serveur pour une trace opposable. *(Amélioration identifiée, non bloquante pour un test fermé.)*

### T6 — Hébergement de l'application
- **Finalité :** servir l'application web.
- **Données :** données techniques de connexion transitant par l'infrastructure.
- **Destinataire :** Vercel (US).
- **Transfert hors UE :** oui — encadré par les **Clauses Contractuelles Types**.
- **Durée :** logs techniques selon la politique de l'hébergeur.

### T7 — Stockage local (sur l'appareil)
- **Finalité :** faire fonctionner l'app en local-first.
- **Données :** profil, réponses, journal, cartographie, archétype, progression.
- **Particularité :** stockées **dans le navigateur de l'utilisatrice**, ne transitent pas par le serveur (sauf usage de l'IA — voir T4). Effaçables à tout moment (Réglages → Supprimer mes données).

---

## Droits des personnes (comment ils sont assurés)

| Droit | Mise en œuvre dans l'app |
|---|---|
| Information | Pages `/confidentialite` et `/cgu` |
| Accès & portabilité | Réglages → **Export JSON** |
| Rectification | Édition directe du profil / des contenus |
| Effacement | Réglages → **Supprimer mes données** (local + serveur via `/api/rgpd`) |
| Opposition / retrait du consentement | Bannière de consentement révocable ; suppression des données |
| Réclamation | Auprès de la **CNIL** (cnil.fr) |

---

## Actions restantes avant lancement public

1. Renseigner l'identité du responsable de traitement (ci-dessus + variables Vercel).
2. Signer les **DPA** : Supabase, Mistral, Vercel.
3. (Recommandé) Journaliser le consentement côté serveur (T5).
4. Faire relire par un professionnel avant une ouverture au-delà du test fermé.
