import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { couleurs, polices } from "./theme";

export function Surtitre({ children }: { children: ReactNode }) {
  return <Text style={s.surtitre}>{children}</Text>;
}

export function Titre({ children }: { children: ReactNode }) {
  return <Text style={s.titre}>{children}</Text>;
}

export function Paragraphe({ children, discret }: { children: ReactNode; discret?: boolean }) {
  return <Text style={[s.paragraphe, discret && { color: couleurs.gris, fontSize: 14 }]}>{children}</Text>;
}

export function Filet() {
  return <View style={s.filet} />;
}

/** Symbole de la marque : lune et étoile, en trait fin. */
export function LuneEtoile({ taille = 28, couleur = couleurs.encre }: { taille?: number; couleur?: string }) {
  return (
    <Svg width={taille} height={taille} viewBox="0 0 32 32" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Path d="M20 5.5a11 11 0 1 0 6.5 19.9A12.5 12.5 0 0 1 20 5.5z" fill="none" stroke={couleur} strokeWidth={1.2} />
      <Path d="M25 9l.9 2.1 2.1.9-2.1.9L25 15l-.9-2.1-2.1-.9 2.1-.9z" fill={couleur} />
    </Svg>
  );
}

/** Anneau d'élan : un seul chiffre, un arc fin. */
export function AnneauElan({ valeur, taille = 200 }: { valeur: number | null; taille?: number }) {
  const r = taille / 2 - 6;
  const c = 2 * Math.PI * r;
  const part = valeur == null ? 0 : Math.max(0, Math.min(100, valeur)) / 100;
  return (
    <View style={{ width: taille, height: taille, alignItems: "center", justifyContent: "center" }} accessibilityRole="image" accessibilityLabel={valeur == null ? "Élan à lire" : `Élan ${valeur} sur 100`}>
      <Svg width={taille} height={taille} style={StyleSheet.absoluteFill}>
        <Circle cx={taille / 2} cy={taille / 2} r={r} stroke={couleurs.filet} strokeWidth={1} fill="none" />
        <Circle
          cx={taille / 2}
          cy={taille / 2}
          r={r}
          stroke={couleurs.bordeaux}
          strokeWidth={2}
          fill="none"
          strokeDasharray={`${c * part} ${c}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${taille / 2} ${taille / 2})`}
        />
      </Svg>
      <Text style={s.chiffre}>{valeur ?? "—"}</Text>
      <Text style={s.surtitre}>élan</Text>
    </View>
  );
}

export function Bouton({ children, onPress, occupe, discret, desactive }: { children: string; onPress: () => void; occupe?: boolean; discret?: boolean; desactive?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={occupe || desactive}
      accessibilityRole="button"
      accessibilityState={{ busy: occupe, disabled: occupe || desactive }}
      style={({ pressed }) => [discret ? s.boutonDiscret : s.bouton, (pressed || occupe || desactive) && { opacity: 0.6 }]}
    >
      {occupe ? <ActivityIndicator color={discret ? couleurs.encre : couleurs.ivoire} /> : <Text style={discret ? s.boutonDiscretTexte : s.boutonTexte}>{children}</Text>}
    </Pressable>
  );
}

export function Champ({ libelle, erreur, ...props }: TextInputProps & { libelle: string; erreur?: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={s.surtitre}>{libelle}</Text>
      <TextInput placeholderTextColor={couleurs.taupe} style={[s.champ, !!erreur && { borderBottomColor: couleurs.bordeaux }]} accessibilityLabel={libelle} {...props} />
      {erreur ? <Text style={s.erreur}>{erreur}</Text> : null}
    </View>
  );
}

/** Échelle 1–5 (humeur, énergie, ambition). */
export function Echelle({ libelle, valeur, onChange }: { libelle: string; valeur: number | null; onChange: (v: number) => void }) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={s.surtitre}>{libelle}</Text>
      <View style={{ flexDirection: "row", gap: 8 }} accessibilityRole="radiogroup" accessibilityLabel={libelle}>
        {[1, 2, 3, 4, 5].map((n) => {
          const actif = valeur === n;
          return (
            <Pressable
              key={n}
              onPress={() => onChange(n)}
              accessibilityRole="radio"
              accessibilityState={{ checked: actif }}
              accessibilityLabel={`${libelle} ${n} sur 5`}
              style={[s.pastille, actif && { backgroundColor: couleurs.nuit, borderColor: couleurs.nuit }]}
            >
              <Text style={[s.pastilleTexte, actif && { color: couleurs.ivoire }]}>{n}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function Message({ children, erreur }: { children: ReactNode; erreur?: boolean }) {
  return (
    <View style={s.message} accessibilityRole={erreur ? "alert" : "text"} accessibilityLiveRegion="polite">
      <Text style={[s.paragraphe, { fontSize: 14 }, erreur && { color: couleurs.bordeaux }]}>{children}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  surtitre: { fontFamily: polices.texte, fontSize: 11, fontWeight: "600", letterSpacing: 2.6, textTransform: "uppercase", color: couleurs.gris },
  titre: { fontFamily: polices.titre, fontSize: 34, lineHeight: 40, color: couleurs.encre },
  paragraphe: { fontFamily: polices.texte, fontSize: 16, lineHeight: 24, color: couleurs.encre },
  filet: { height: StyleSheet.hairlineWidth, backgroundColor: couleurs.filet },
  chiffre: { fontFamily: polices.titre, fontSize: 64, lineHeight: 70, color: couleurs.encre },
  bouton: { height: 54, backgroundColor: couleurs.nuit, alignItems: "center", justifyContent: "center" },
  boutonTexte: { fontFamily: polices.texte, fontSize: 13, fontWeight: "600", letterSpacing: 2.4, textTransform: "uppercase", color: couleurs.ivoire },
  boutonDiscret: { height: 44, alignItems: "center", justifyContent: "center" },
  boutonDiscretTexte: { fontFamily: polices.texte, fontSize: 12, fontWeight: "600", letterSpacing: 2, textTransform: "uppercase", color: couleurs.encre, textDecorationLine: "underline" },
  champ: { height: 48, borderBottomWidth: 1, borderBottomColor: couleurs.filet, fontSize: 17, color: couleurs.encre, fontFamily: polices.texte },
  erreur: { fontSize: 13, color: couleurs.bordeaux },
  pastille: { width: 48, height: 48, borderWidth: 1, borderColor: couleurs.filet, alignItems: "center", justifyContent: "center" },
  pastilleTexte: { fontFamily: polices.titre, fontSize: 20, color: couleurs.encre },
  message: { borderLeftWidth: 2, borderLeftColor: couleurs.bordeaux, backgroundColor: couleurs.sable, padding: 14 },
});
