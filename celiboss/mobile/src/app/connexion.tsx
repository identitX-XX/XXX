import { Redirect } from "expo-router";
import * as Linking from "expo-linking";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SITE_URL, configure } from "../lib/config";
import { useSession } from "../lib/session";
import { supabase } from "../lib/supabase";
import { Bouton, Champ, LuneEtoile, Message, Paragraphe, Surtitre, Titre } from "../ui/composants";
import { couleurs, espace } from "../ui/theme";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function traduire(message: string) {
  if (/invalid login credentials/i.test(message)) return "E-mail ou mot de passe incorrect.";
  if (/email not confirmed/i.test(message)) return "Confirmez d'abord votre adresse : le lien vous attend dans votre boîte e-mail.";
  if (/rate limit|too many/i.test(message)) return "Trop de tentatives. Réessayez dans quelques minutes.";
  return "Connexion impossible pour le moment. Réessayez.";
}

export default function Connexion() {
  const { session } = useSession();
  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [occupe, setOccupe] = useState(false);

  if (session) return <Redirect href="/aujourdhui" />;

  async function connecter() {
    const e: Record<string, string> = {};
    const adresse = email.trim().toLowerCase();
    if (!EMAIL.test(adresse)) e.email = "Indiquez une adresse e-mail valide.";
    if (!motdepasse) e.motdepasse = "Indiquez votre mot de passe.";
    setErreurs(e);
    setMessage(null);
    if (Object.keys(e).length) return;
    if (!configure) return setMessage("Le Compagnon ouvre à la prochaine lune : les comptes ne sont pas encore actifs.");
    setOccupe(true);
    const { error } = await supabase.auth.signInWithPassword({ email: adresse, password: motdepasse });
    setOccupe(false);
    if (error) setMessage(traduire(error.message));
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: couleurs.ivoire }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={{ padding: espace.gouttiere, paddingTop: 56, gap: 28 }} keyboardShouldPersistTaps="handled">
          <LuneEtoile />
          <View style={{ gap: 12 }}>
            <Surtitre>CéliBOSS · Le Compagnon</Surtitre>
            <Titre>Votre élan, chaque matin.</Titre>
            <Paragraphe discret>Connectez-vous avec l'e-mail et le mot de passe de votre compte CéliBOSS.</Paragraphe>
          </View>
          <Champ libelle="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" keyboardType="email-address" textContentType="emailAddress" placeholder="prenom@exemple.fr" erreur={erreurs.email} />
          <Champ libelle="Mot de passe" value={motdepasse} onChangeText={setMotdepasse} secureTextEntry autoComplete="current-password" textContentType="password" erreur={erreurs.motdepasse} onSubmitEditing={connecter} />
          <Bouton onPress={connecter} occupe={occupe}>
            Se connecter →
          </Bouton>
          {message ? <Message erreur>{message}</Message> : null}
          <View style={{ gap: 4 }}>
            <Bouton discret onPress={() => Linking.openURL(`${SITE_URL}/inscription`)} desactive={!SITE_URL}>
              Créer un compte
            </Bouton>
            <Bouton discret onPress={() => Linking.openURL(`${SITE_URL}/mot-de-passe-oublie`)} desactive={!SITE_URL}>
              Mot de passe oublié
            </Bouton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
