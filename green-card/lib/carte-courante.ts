import "server-only";
import { redirect } from "next/navigation";
import { carteConnectee } from "./session";

/** La carte connectée, sinon redirection vers la connexion. (Hors fichier « use server » : ce n'est pas une action.) */
export async function exigerCarte() {
  const carte = await carteConnectee();
  if (!carte) redirect("/connexion");
  return carte;
}
