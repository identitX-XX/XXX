import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useSession } from "../lib/session";
import { couleurs } from "../ui/theme";

/** Aiguillage : connecté → Aujourd'hui, sinon → Connexion. */
export default function Accueil() {
  const { session, charge } = useSession();
  if (!charge)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: couleurs.ivoire }}>
        <ActivityIndicator color={couleurs.encre} />
      </View>
    );
  return <Redirect href={session ? "/aujourdhui" : "/connexion"} />;
}
