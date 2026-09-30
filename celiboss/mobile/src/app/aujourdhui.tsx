import { Redirect } from "expo-router";
import * as Linking from "expo-linking";
import { useCallback, useEffect, useState } from "react";
import { AppState, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ErreurApi, envoyerPoint, lirePoints, type Lecture } from "../lib/api";
import { SITE_URL } from "../lib/config";
import { formatSommeil } from "../lib/jour";
import { useSession } from "../lib/session";
import { supabase } from "../lib/supabase";
import { synchroniserMontre } from "../lib/synchro";
import { sante } from "../sante";
import { AnneauElan, Bouton, Echelle, Filet, LuneEtoile, Message, Paragraphe, Surtitre, Titre } from "../ui/composants";
import { couleurs, espace, polices } from "../ui/theme";

type Humeur = { humeur: number | null; energie: number | null; ambition: number | null };

export default function Aujourdhui() {
  const { session } = useSession();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [chargement, setChargement] = useState(true);
  const [synchro, setSynchro] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [info, setInfo] = useState<{ texte: string; erreur?: boolean } | null>(null);
  const [saisie, setSaisie] = useState<Humeur>({ humeur: null, energie: null, ambition: null });
  const [montre, setMontre] = useState<boolean | null>(null);

  const charger = useCallback(async () => {
    try {
      const l = await lirePoints();
      setLecture(l);
      const p = l.points.find((x) => x.jour === l.jour);
      if (p) setSaisie({ humeur: p.humeur, energie: p.energie, ambition: p.ambition });
      return l;
    } catch (e) {
      setInfo({ texte: e instanceof ErreurApi ? e.message : "Lecture impossible.", erreur: true });
      if (e instanceof ErreurApi && e.statut === 401) await supabase.auth.signOut();
      return null;
    } finally {
      setChargement(false);
    }
  }, []);

  const lireMontre = useCallback(
    async (silencieux: boolean) => {
      setSynchro(true);
      try {
        const r = await synchroniserMontre();
        if (r.etat === "envoye") {
          await charger();
          if (!silencieux) setInfo({ texte: `Nuit synchronisée : ${formatSommeil(r.sommeilMinutes)} de sommeil${r.cardioRepos ? `, ${r.cardioRepos} bpm au repos` : ""}.` });
        } else if (!silencieux) {
          setInfo({
            texte:
              r.etat === "vide"
                ? `Rien à lire pour cette nuit. Vérifiez que votre montre écrit dans ${sante.source} et que la lecture est autorisée.`
                : `${sante.source ?? "Les données de santé"} n'est pas disponible sur ce téléphone.`,
          });
        }
      } catch (e) {
        if (!silencieux) setInfo({ texte: e instanceof ErreurApi ? e.message : "Synchronisation impossible.", erreur: true });
      } finally {
        setSynchro(false);
      }
    },
    [charger],
  );

  // Au premier affichage, puis à chaque retour au premier plan : lecture, et
  // synchronisation discrète de la montre si la personne l'a déjà autorisée.
  useEffect(() => {
    if (!session) return;
    let actif = true;
    const cycle = async () => {
      const l = await charger();
      const dispo = await sante.disponible();
      if (!actif) return;
      setMontre(dispo);
      if (l?.profil.santeConsentie && dispo) await lireMontre(true);
    };
    cycle();
    const abonnement = AppState.addEventListener("change", (etat) => etat === "active" && cycle());
    return () => {
      actif = false;
      abonnement.remove();
    };
  }, [session, charger, lireMontre]);

  if (!session) return <Redirect href="/connexion" />;

  const duJour = lecture?.points.find((p) => p.jour === lecture.jour) ?? null;
  const consentie = lecture?.profil.santeConsentie ?? false;

  async function connecterMontre() {
    setInfo(null);
    const ok = await sante.autoriser().catch(() => false);
    if (!ok && sante.source === "Health Connect") return setInfo({ texte: "Autorisation refusée. Vous pourrez la donner plus tard dans Health Connect." });
    await lireMontre(false);
  }

  async function envoyerHumeur() {
    const { humeur, energie, ambition } = saisie;
    if (humeur == null && energie == null && ambition == null) return setInfo({ texte: "Choisissez au moins une note.", erreur: true });
    setEnvoi(true);
    setInfo(null);
    try {
      await envoyerPoint({ jour: lecture?.jour ?? "", source: "manuel", ...(humeur && { humeur }), ...(energie && { energie }), ...(ambition && { ambition }) });
      await charger();
      setInfo({ texte: "Point du matin enregistré." });
    } catch (e) {
      setInfo({ texte: e instanceof ErreurApi ? e.message : "Enregistrement impossible.", erreur: true });
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: couleurs.ivoire }}>
      <ScrollView
        contentContainerStyle={{ padding: espace.gouttiere, gap: 28, paddingBottom: 48 }}
        refreshControl={<RefreshControl refreshing={chargement} onRefresh={charger} tintColor={couleurs.encre} />}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <LuneEtoile taille={24} />
          <Bouton discret onPress={() => supabase.auth.signOut()}>
            Se déconnecter
          </Bouton>
        </View>

        <View style={{ gap: 10 }}>
          <Surtitre>Aujourd'hui{lecture?.profil.prenom ? ` · ${lecture.profil.prenom}` : ""}</Surtitre>
          <Titre>{duJour?.elan.valeur != null ? "Votre élan du jour" : "Bonjour."}</Titre>
        </View>

        <View style={{ alignItems: "center", gap: 18 }}>
          <AnneauElan valeur={duJour?.elan.valeur ?? null} />
          <Paragraphe>{duJour?.elan.lecture ?? "Faites votre point du matin : le Compagnon a besoin de vous entendre pour lire votre élan."}</Paragraphe>
        </View>

        <Filet />

        <View style={{ flexDirection: "row" }}>
          <Mesure libelle="Sommeil" valeur={formatSommeil(duJour?.sommeil_minutes)} />
          <Mesure libelle="Cardio repos" valeur={duJour?.cardio_repos ? `${duJour.cardio_repos} bpm` : "—"} />
        </View>

        <View style={{ gap: 12 }}>
          <Surtitre>Montre connectée</Surtitre>
          {!consentie ? (
            <>
              <Paragraphe discret>
                Pour lire votre sommeil et votre cardio, donnez d'abord votre consentement santé dans votre profil (facultatif, retirable à tout moment).
              </Paragraphe>
              <Bouton discret onPress={() => Linking.openURL(`${SITE_URL}/espace/profil`)} desactive={!SITE_URL}>
                Ouvrir mon profil
              </Bouton>
            </>
          ) : montre === false ? (
            <Paragraphe discret>Aucune source de santé sur ce téléphone. Sur Android, installez Health Connect ; sur iPhone, Apple Santé est intégré.</Paragraphe>
          ) : (
            <>
              <Paragraphe discret>
                Le Compagnon lit votre nuit dans {sante.source} : Apple Watch, Pixel Watch, Galaxy Watch, Garmin, Withings, Oura… en lecture seule.
              </Paragraphe>
              <Bouton onPress={connecterMontre} occupe={synchro}>
                Synchroniser ma nuit
              </Bouton>
            </>
          )}
        </View>

        <Filet />

        <View style={{ gap: 20 }}>
          <Surtitre>Point du matin</Surtitre>
          <Echelle libelle="Humeur" valeur={saisie.humeur} onChange={(v) => setSaisie((s) => ({ ...s, humeur: v }))} />
          <Echelle libelle="Énergie" valeur={saisie.energie} onChange={(v) => setSaisie((s) => ({ ...s, energie: v }))} />
          <Echelle libelle="Ambition" valeur={saisie.ambition} onChange={(v) => setSaisie((s) => ({ ...s, ambition: v }))} />
          <Bouton onPress={envoyerHumeur} occupe={envoi} desactive={!lecture}>
            Enregistrer
          </Bouton>
        </View>

        {info ? <Message erreur={info.erreur}>{info.texte}</Message> : null}

        <Text style={{ fontSize: 12, lineHeight: 18, color: couleurs.gris, fontFamily: polices.texte }}>
          Le Compagnon n'est pas un dispositif médical. Vos données de santé ne sont ni revendues ni partagées.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Mesure({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <View style={{ flex: 1, gap: 6 }}>
      <Surtitre>{libelle}</Surtitre>
      <Text style={{ fontFamily: polices.titre, fontSize: 26, color: couleurs.encre }}>{valeur}</Text>
    </View>
  );
}
