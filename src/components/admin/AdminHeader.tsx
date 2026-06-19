"use client";
// src/components/admin/AdminHeader.tsx

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";

const pageTitles: Record<string, string> = {
  "/admin":             "Dashboard",
  "/admin/analytics":   "Analytics",
  "/admin/produits":    "Produits",
  "/admin/collections": "Collections",
  "/admin/commandes":   "Commandes",
  "/admin/promos":      "Promos & Coupons",
  "/admin/utilisateurs": "Utilisateurs",
  "/admin/avis":        "Avis Clients",
  "/admin/whatsapp":    "WhatsApp Orders",
  "/admin/logs":        "Logs & Sécurité",
  "/admin/parametres":  "Paramètres",
};

interface Props {
  user: Session["user"];
  onMenuToggle?: () => void;
}

export default function AdminHeader({ user, onMenuToggle }: Props) {
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const title = Object.entries(pageTitles)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([key]) => pathname.startsWith(key))?.[1] || "Admin";

  return (
    <header style={{
      height: 64,
      background: "var(--bg-surface)",
      borderBottom: "1px solid var(--border-subtle)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      position: "sticky",
      top: 0,
      zIndex: 50,
      flexShrink: 0,
      paddingLeft: "16px",
      paddingRight: "16px",
    }}>

      {/* Bouton Hamburger — intégré dans le flux flex, visible uniquement sur mobile */}
      {onMenuToggle && (
        <button
          onClick={onMenuToggle}
          className="lg:hidden admin-hamburger"
          title="Ouvrir le menu"
          style={{
            background: "none",
            border: "none",
            color: "var(--text-primary)",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          ☰
        </button>
      )}

      {/* Title — prend tout l'espace restant */}
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: "var(--text-primary)",
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontSize: "clamp(14px, 2.5vw, 22px)",
          margin: 0,
        }}
      >
        {title}
      </h1>

      {/* Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          padding: "0 12px",
          height: "36px",
          width: "200px",
        }}
        className="hidden md:flex"
      >
        <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>⌕</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher…"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            width: "100%",
          }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "0 16px",
            height: "36px",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-primary)",
            textDecoration: "none",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            transition: "all 0.2s",
          }}
          className="hidden sm:inline-flex hover:bg-white/[0.04] hover:border-white"
        >
          ← Retour
        </Link>

        <button
          title="Notifications"
          style={{
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)",
            cursor: "pointer",
            position: "relative",
            fontSize: "16px",
            flexShrink: 0,
          }}
        >
          🔔
          <span style={{
            position: "absolute",
            top: 7,
            right: 7,
            width: 6,
            height: 6,
            background: "var(--accent-rose)",
            borderRadius: "50%",
            border: "1px solid var(--bg-surface)",
          }} />
        </button>

        {/* Live indicator */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            background: "rgba(52,211,153,0.06)",
            border: "1px solid rgba(52,211,153,0.18)",
            flexShrink: 0,
          }}
          className="hidden xs:inline-flex"
        >
          <span style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#34d399",
            animation: "livePulse 2s infinite",
            display: "inline-block",
          }} />
          <span style={{
            fontSize: "9px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#34d399",
            fontWeight: 600,
          }}>Live</span>
        </div>
      </div>

    </header>
  );
}
