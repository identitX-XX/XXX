import type { Metadata } from "next";
import { Manifeste } from "@/components/home/Manifeste";

export const metadata: Metadata = {
  title: "Le manifeste",
  description: "Le manifeste CéliBOSS™, signé Maï Diaw : choisir sa vie, choisir ses relations, choisir son cercle.",
};

export default function PageManifeste() {
  return <Manifeste />;
}
