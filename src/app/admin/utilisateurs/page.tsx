// src/app/admin/utilisateurs/page.tsx
// Page de gestion des utilisateurs — Style Monochrome

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import UsersManager from "@/components/admin/UsersManager";

async function getUsers() {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    // Serialize Dates to ISO strings to avoid hydration issues
    return users.map(u => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
    }));
  } catch (error) {
    console.warn("Database failed to load users in admin, using mock fallback:", error);
    return [
      {
        id: "mock-admin-id",
        email: "admin@infiniwear.com",
        pseudo: "admin_demo",
        name: "Admin Démo",
        role: "SUPER_ADMIN",
        suspended: false,
        createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: "mock-client-id",
        email: "client@infiniwear.com",
        pseudo: "client_demo",
        name: "Client Démo",
        role: "CLIENT",
        suspended: false,
        createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: "mock-user-3",
        email: "bamba@gmail.com",
        pseudo: "bamba_style",
        name: "Bamba K.",
        role: "CLIENT",
        suspended: false,
        createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: "mock-user-4",
        email: "marie.d@gmail.com",
        pseudo: "marie_d",
        name: "Marie Diop",
        role: "CLIENT",
        suspended: true,
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      }
    ];
  }
}

export default async function UsersAdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/connexion?callbackUrl=/admin/utilisateurs");
  }

  if (!["SUPER_ADMIN", "SUPPORT_AGENT"].includes(session.user.role!)) {
    redirect("/");
  }

  const users = await getUsers();

  return (
    <div style={{ padding: "32px" }} className="animate-fade-up">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
            COMPTES UTILISATEURS ({users.length})
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Visualisez les comptes clients et gérez la modération de sécurité.
          </div>
        </div>
        <Link href="/admin" style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffffff", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
          ← Retour dashboard
        </Link>
      </div>

      {/* Users Table Manager */}
      <UsersManager users={users} currentUser={session.user as any} />
    </div>
  );
}
