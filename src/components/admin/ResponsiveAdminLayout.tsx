"use client";
// src/components/admin/ResponsiveAdminLayout.tsx
// Composant Client pour gérer la navigation responsive et le tiroir mobile (drawer)

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import type { Session } from "next-auth";

interface Props {
  user: Session["user"];
  children: React.ReactNode;
}

export default function ResponsiveAdminLayout({ user, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Fermer le tiroir lors d'un changement de route
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-base)" }}>

      {/* ── Sidebar ── */}
      {/* La classe CSS admin-sidebar-wrapper gère le responsive via globals.css :
          - mobile  : fixed, translateX(-260px) par défaut → .open le fait glisser
          - desktop : sticky, translateX(0) forcé par @media (min-width: 1024px)    */}
      <div className={`admin-sidebar-wrapper${sidebarOpen ? " open" : ""}`}>

        {/* Bouton fermer (×) visible uniquement sur mobile */}
        {sidebarOpen && (
          <button
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            title="Fermer le menu"
            style={{
              position: "absolute",
              right: "12px",
              top: "12px",
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              fontSize: "24px",
              cursor: "pointer",
              zIndex: 110,
              lineHeight: 1,
              padding: "4px",
            }}
          >
            ×
          </button>
        )}

        <AdminSidebar user={user} />
      </div>

      {/* ── Backdrop mobile ── */}
      {sidebarOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 90,
          }}
        />
      )}

      {/* ── Zone de Contenu Principal ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {/* Header avec hamburger intégré */}
        <AdminHeader user={user} onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

        {/* Corps de la page */}
        <main style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </main>
      </div>

    </div>
  );
}
