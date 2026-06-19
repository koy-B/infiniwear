// src/middleware.ts
// Protection des routes admin + auth

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // ─── Routes admin protégées ───
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/connexion?callbackUrl=/admin", req.url));
    }
    const role = session.user?.role;
    if (role !== "SUPER_ADMIN" && role !== "SUPPORT_AGENT") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ─── Espace client protégé ───
  if (pathname.startsWith("/profil") || pathname.startsWith("/commandes")) {
    if (!session) {
      return NextResponse.redirect(new URL(`/connexion?callbackUrl=${pathname}`, req.url));
    }
  }

  // ─── Rediriger vers profil si déjà connecté et essaie d'aller sur connexion ───
  if (
    session &&
    (pathname === "/connexion" || pathname === "/inscription")
  ) {
    const role = session.user?.role;
    if (role === "SUPER_ADMIN" || role === "SUPPORT_AGENT") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.redirect(new URL("/profil", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/profil/:path*",
    "/commandes/:path*",
    "/connexion",
    "/inscription",
  ],
};
