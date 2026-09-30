import { NextResponse } from "next/server";
import { supabaseServeur } from "@/lib/supabase/serveur";

// Droit à la portabilité (RGPD art. 20) : toutes les données du compte, en JSON.
export async function GET() {
  const supabase = supabaseServeur();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erreur: "Non connecté." }, { status: 401 });

  const [{ data: profil }, { data: points }] = await Promise.all([
    supabase.from("profils").select("*").eq("id", user.id).single(),
    supabase.from("points").select("*").eq("user_id", user.id).order("jour"),
  ]);

  const contenu = JSON.stringify({ exporte_le: new Date().toISOString(), compte: { email: user.email, cree_le: user.created_at }, profil, points }, null, 2);
  return new NextResponse(contenu, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="celiboss-mes-donnees.json"`,
      "Cache-Control": "no-store",
    },
  });
}
