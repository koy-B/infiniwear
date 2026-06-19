// src/components/layout/Navbar.tsx
// Composant de navigation premium et réutilisable

import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function Navbar() {
  const session = await auth();
  const user = session?.user;

  const navLinks = [
    { label: "Boutique", href: "/marketplace" },
    { label: "Collection Normale", href: "/collection/normale" },
    { label: "Collection Féminine", href: "/collection/feminine" },
  ];

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: "rgba(8, 9, 10, 0.85)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      height: "72px",
      display: "flex",
      alignItems: "center",
      padding: "0 24px"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        maxWidth: "1440px",
        margin: "0 auto"
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "24px",
            fontWeight: 800,
            letterSpacing: "0.15em",
            color: "#ffffff"
          }}>
            INFINIWEAR
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "36px" }}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontWeight: 600,
                transition: "color var(--transition)"
              }}
              className="hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions (Auth / Profil) */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {user ? (
            <>
              {["SUPER_ADMIN", "SUPPORT_AGENT"].includes(user.role || "") && (
                <Link
                  href="/admin"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontWeight: 600,
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    padding: "4px 8px"
                  }}
                >
                  Admin
                </Link>
              )}
              <Link
                href="/profil"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 600
                }}
              >
                Profil
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/connexion"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontWeight: 600
                }}
                className="hover:text-white"
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="iw-btn iw-btn-primary"
                style={{
                  height: "36px",
                  padding: "0 18px",
                  fontSize: "10px"
                }}
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
