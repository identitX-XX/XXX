import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FournisseurSession } from "../lib/session";
import { couleurs } from "../ui/theme";

export default function Racine() {
  return (
    <SafeAreaProvider>
      <FournisseurSession>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: couleurs.ivoire }, animation: "fade" }} />
      </FournisseurSession>
    </SafeAreaProvider>
  );
}
