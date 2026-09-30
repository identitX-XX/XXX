import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigure } from "@/lib/supabase/config";

// Rafraîchit la session Supabase à chaque requête et garde l'espace membre :
// - /espace/* sans session → /connexion (puis retour à la page demandée) ;
// - /connexion ou /inscription avec session → /espace.
export async function middleware(req: NextRequest) {
  if (!supabaseConfigure) return NextResponse.next();

  let reponse = NextResponse.next({ request: req });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (aPoser) => {
        aPoser.forEach(({ name, value }) => req.cookies.set(name, value));
        reponse = NextResponse.next({ request: req });
        aPoser.forEach(({ name, value, options }) => reponse.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname, search } = req.nextUrl;

  if (!user && pathname.startsWith("/espace")) {
    const url = req.nextUrl.clone();
    url.pathname = "/connexion";
    url.search = `?suite=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }
  if (user && (pathname === "/connexion" || pathname === "/inscription")) {
    const url = req.nextUrl.clone();
    url.pathname = "/espace";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return reponse;
}

export const config = {
  matcher: ["/espace/:path*", "/connexion", "/inscription", "/nouveau-mot-de-passe", "/auth/:path*"],
};
