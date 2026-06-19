"use client";
// src/components/admin/AdminSidebar.tsx

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

interface Props {
  user: Session["user"];
}

const navItems = [
  {
    section: "TABLEAU DE BORD",
    items: [
      { href: "/admin", label: "Dashboard", icon: "◈", exact: true },
      { href: "/admin/analytics", label: "Analytics", icon: "◉" },
    ],
  },
  {
    section: "BOUTIQUE",
    items: [
      { href: "/admin/produits", label: "Produits", icon: "◫", badge: null },
      { href: "/admin/collections", label: "Collections", icon: "◎", badge: null },
      { href: "/admin/commandes", label: "Commandes", icon: "◑", badge: "pending" },
      { href: "/admin/promos", label: "Promos & Coupons", icon: "◐" },
    ],
  },
  {
    section: "COMMUNAUTÉ",
    items: [
      { href: "/admin/utilisateurs", label: "Utilisateurs", icon: "○" },
      { href: "/admin/avis", label: "Avis clients", icon: "◒" },
      { href: "/admin/whatsapp", label: "WhatsApp Orders", icon: "◌" },
    ],
  },
  {
    section: "SYSTÈME",
    items: [
      { href: "/admin/logs", label: "Logs & Sécurité", icon: "▣" },
      { href: "/admin/parametres", label: "Paramètres", icon: "◇" },
    ],
  },
];

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside style={{
      background: "var(--bg-surface)",
      borderRight: "1px solid var(--border-subtle)",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      width: "100%",
      overflowY: "auto",
      overflowX: "hidden",
      flexShrink: 0,
    }}>

      {/* Brand */}
      <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: 36, height: 36, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontFamily: "var(--font-display)", color: "#000000", fontWeight: 700, flexShrink: 0, position: "relative" }}>
          ∞
          <span style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 60%)", pointerEvents: "none" }}></span>
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-primary)", lineHeight: 1 }}>
            INFINIWEAR
          </div>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginTop: "3px" }}>
            Admin Console
          </span>
        </div>
      </div>

      {/* Role badge */}
      <div style={{ margin: "16px 24px", padding: "8px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ width: 6, height: 6, background: "#ffffff", borderRadius: "50%", boxShadow: "0 0 8px #ffffff", animation: "livePulse 2s infinite", display: "inline-block" }}></span>
        <span style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ffffff", fontWeight: 700 }}>
          {user?.role === "SUPER_ADMIN" ? "Super Admin" : "Support Agent"}
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "8px 0" }}>
        {navItems.map((section) => (
          <div key={section.section} style={{ marginBottom: "8px" }}>
            <div style={{ padding: "12px 24px 6px", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>
              {section.section}
            </div>
            {section.items.map((item) => {
              const active = isActive(item.href, (item as typeof item & { exact?: boolean }).exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 24px",
                    fontSize: "13px",
                    fontWeight: active ? 500 : 400,
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                    textDecoration: "none",
                    background: active ? "rgba(255, 255, 255, 0.05)" : "transparent",
                    borderLeft: `2px solid ${active ? "#ffffff" : "transparent"}`,
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ color: active ? "#ffffff" : "var(--text-muted)", fontSize: "16px" }}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Separator */}
      <div style={{ height: 1, background: "var(--border-subtle)", margin: "0 24px" }}></div>

      {/* Links footer */}
      <div style={{ padding: "12px 0" }}>
        <Link href="/" target="_blank" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 24px", fontSize: "13px", color: "var(--text-secondary)", textDecoration: "none" }}>
          <span style={{ fontSize: "14px" }}>↗</span> Voir le site
        </Link>
      </div>

      {/* User profile */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: 34, height: 34, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#000000", flexShrink: 0, fontFamily: "var(--font-display)" }}>
          {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user?.name || "Admin"}
          </div>
          <div style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {user?.role === "SUPER_ADMIN" ? "Super Admin" : "Agent"}
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/connexion" })}
          title="Déconnexion"
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "14px", padding: "4px" }}
        >
          ⏏
        </button>
      </div>

    </aside>
  );
}
