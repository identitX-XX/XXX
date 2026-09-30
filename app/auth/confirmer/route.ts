import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseServeur } from "@/lib/supabase/serveur";

// Point d'arrivée des liens envoyés par e-mail (confirmation d'inscription,
// réinitialisation du mot de passe). Modèle d'e-mail Supabase à utiliser :
// {{ .SiteURL }}/auth/confirmer?token_hash={{ .TokenHash }}&type=<type>
export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const suiteDemandee = searchParams.get("suite") ?? "/espace";
  const suite = suiteDemandee.startsWith("/") && !suiteDemandee.startsWith("//") ? suiteDemandee : "/espace";

  const supabase = supabaseServeur();
  let ok = false;
  if (tokenHash && type) {
    ok = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error;
  } else if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  }

  if (!ok) return NextResponse.redirect(`${origin}/connexion?erreur=lien`);
  return NextResponse.redirect(`${origin}${type === "recovery" ? "/nouveau-mot-de-passe" : suite}`);
}
