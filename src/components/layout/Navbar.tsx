// src/components/layout/Navbar.tsx
// Composant de navigation premium — responsive mobile + hamburger

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermer le menu au clic sur un lien
  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { label: "Boutique", href: "/marketplace" },
    { label: "Collection Normale", href: "/collection/normale" },
    { label: "Collection Féminine", href: "/collection/feminine" },
  ];

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled
            ? "rgba(8, 9, 10, 0.97)"
            : "rgba(8, 9, 10, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          height: "64px",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          transition: "background 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "1440px",
            margin: "0 auto",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} onClick={closeMenu}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                fontWeight: 800,
                letterSpacing: "0.15em",
                color: "#ffffff",
              }}
            >
              INFINIWEAR
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "9px",
                letterSpacing: "0.2em",
                color: "var(--text-muted)",
                marginLeft: "8px",
                textTransform: "uppercase",
                alignSelf: "flex-end",
                marginBottom: "2px",
              }}
            >
              BOUTIQUE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-desktop-links" style={{ display: "flex", alignItems: "center", gap: "36px" }}>
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
                  transition: "color var(--transition)",
                }}
                className="hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions Desktop + Hamburger Mobile */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Desktop auth links */}
            <div className="navbar-desktop-links" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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
                        border: "1px solid rgba(255,255,255,0.2)",
                        padding: "4px 8px",
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
                      fontWeight: 600,
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
                      fontWeight: 600,
                    }}
                    className="hover:text-white"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/inscription"
                    className="iw-btn iw-btn-primary"
                    style={{ height: "36px", padding: "0 18px", fontSize: "10px" }}
                  >
                    S&apos;inscrire
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger button — mobile only */}
            <button
              className="navbar-hamburger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "5px",
                width: "40px",
                height: "40px",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "1.5px",
                  background: "#ffffff",
                  transition: "all 0.3s ease",
                  transform: menuOpen ? "rotate(45deg) translateY(6.5px)" : "none",
                  transformOrigin: "center",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "1.5px",
                  background: "#ffffff",
                  transition: "all 0.3s ease",
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "1.5px",
                  background: "#ffffff",
                  transition: "all 0.3s ease",
                  transform: menuOpen ? "rotate(-45deg) translateY(-6.5px)" : "none",
                  transformOrigin: "center",
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className="navbar-mobile-menu"
        style={{
          position: "fixed",
          top: "64px",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99,
          background: "#08090a",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          padding: "32px 24px",
          gap: "0",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          overflowY: "auto",
        }}
      >
        {/* Nav links */}
        {navLinks.map((link, i) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={closeMenu}
            style={{
              fontSize: "28px",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              letterSpacing: "-0.01em",
              color: "#ffffff",
              textDecoration: "none",
              textTransform: "uppercase",
              padding: "16px 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              transition: "color 0.2s",
              animationDelay: `${i * 60}ms`,
            }}
          >
            {link.label}
          </Link>
        ))}

        {/* Auth section */}
        <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {user ? (
            <>
              <Link
                href="/profil"
                onClick={closeMenu}
                style={{
                  fontSize: "13px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Mon Profil
              </Link>
              {["SUPER_ADMIN", "SUPPORT_AGENT"].includes(user.role || "") && (
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  style={{
                    fontSize: "13px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Administration
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                href="/connexion"
                onClick={closeMenu}
                className="iw-btn iw-btn-outline"
                style={{ width: "100%", justifyContent: "center", height: "52px", fontSize: "12px" }}
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                onClick={closeMenu}
                className="iw-btn iw-btn-primary"
                style={{ width: "100%", justifyContent: "center", height: "52px", fontSize: "12px" }}
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>

        {/* Tagline bas de menu */}
        <div style={{ marginTop: "auto", paddingTop: "40px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.25em", color: "var(--text-muted)", textTransform: "uppercase" }}>
            ∞ No Limit Just Style
          </p>
        </div>
      </div>
    </>
  );
}
