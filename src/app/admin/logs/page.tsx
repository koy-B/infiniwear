// src/app/admin/logs/page.tsx
// Page de consultation des logs d'audit et sécurité — Style Terminal Monochrome

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";

async function getLogs() {
  try {
    const logs = await db.log.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: { select: { pseudo: true } } }
    });
    return logs;
  } catch (error) {
    console.warn("Database failed to load logs, using mock fallback:", error);
    return [
      {
        id: "log-1",
        type: "SECURITY",
        message: "Échec de connexion — admin@infiniwear.com (Mot de passe incorrect)",
        ip: "197.228.12.90",
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
        user: null
      },
      {
        id: "log-2",
        type: "AUTH",
        message: "Connexion réussie — admin@infiniwear.com",
        ip: "197.228.12.90",
        createdAt: new Date(Date.now() - 15 * 60 * 1000),
        user: { pseudo: "admin_demo" }
      },
      {
        id: "log-3",
        type: "PRODUCT",
        message: "Modification produit 'Oversized Hoodie Signature' par admin_demo",
        ip: "197.228.12.90",
        createdAt: new Date(Date.now() - 45 * 60 * 1000),
        user: { pseudo: "admin_demo" }
      },
      {
        id: "log-4",
        type: "ORDER",
        message: "Commande #mock-order-1 créée par bamba_style",
        ip: "197.228.10.15",
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
        user: { pseudo: "bamba_style" }
      },
      {
        id: "log-5",
        type: "SYSTEM",
        message: "Nettoyage périodique des sessions expirées terminé",
        ip: "localhost",
        createdAt: new Date(Date.now() - 24 * 3600 * 1000),
        user: null
      }
    ];
  }
}

const typeColor: Record<string, string> = {
  AUTH: "#34d399", // vert
  ORDER: "#a3a3a3", // gris clair
  PRODUCT: "#737373", // gris moyen
  ADMIN: "#ffffff", // blanc
  SECURITY: "#fb7185", // rouge/rose
  SYSTEM: "#525252", // gris sombre
};

export default async function LogsAdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/connexion?callbackUrl=/admin/logs");
  }

  if (session.user.role !== "SUPER_ADMIN") {
    redirect("/admin"); // Only Super Admins can access security logs
  }

  const logs = await getLogs();

  return (
    <div style={{ padding: "32px" }} className="animate-fade-up">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
            AUDIT & LOGS DU SYSTÈME
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Flux de sécurité en temps réel. Historique des actions administrateur et événements d'authentification.
          </div>
        </div>
        <Link href="/admin" style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffffff", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
          ← Retour dashboard
        </Link>
      </div>

      {/* Terminal View Container */}
      <div style={{
        background: "#000000",
        border: "1px solid var(--border-subtle)",
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#d4d4d4",
        padding: "24px",
        minHeight: "480px",
        boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.8)",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Terminal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", color: "#8a8a8a", borderBottom: "1px solid #1f1f1f", paddingBottom: "12px", marginBottom: "16px" }}>
          <div>INFINIWEAR SECURITY SHELL v1.0.0</div>
          <div>{new Date().toISOString()}</div>
        </div>

        {/* Logs Stream */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto" }}>
          {logs.map((log: any) => {
            const time = new Date(log.createdAt).toLocaleTimeString("fr-FR", { hour12: false });
            const date = new Date(log.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
            const badgeColor = typeColor[log.type] || "#9ca3af";
            const operator = log.user ? `@${log.user.pseudo}` : "system";

            return (
              <div key={log.id} style={{ display: "flex", gap: "12px", alignItems: "baseline", borderBottom: "1px dashed #141414", paddingBottom: "6px" }}>
                {/* Time stamp */}
                <span style={{ color: "#525252", flexShrink: 0 }}>
                  [{date} {time}]
                </span>

                {/* Badge Type */}
                <span style={{
                  color: badgeColor,
                  fontWeight: 700,
                  fontSize: "10px",
                  border: `1px solid ${badgeColor}40`,
                  padding: "0 6px",
                  background: `${badgeColor}08`,
                  flexShrink: 0,
                  width: "75px",
                  textAlign: "center"
                }}>
                  {log.type}
                </span>

                {/* IP address */}
                <span style={{ color: "#737373", flexShrink: 0, fontSize: "11px" }}>
                  {log.ip || "127.0.0.1"}
                </span>

                {/* Operator */}
                <span style={{ color: "#a3a3a3", flexShrink: 0 }}>
                  ({operator})
                </span>

                {/* Message */}
                <span style={{ color: log.type === "SECURITY" ? "#fb7185" : "#ffffff", flex: 1 }}>
                  {log.message}
                </span>
              </div>
            );
          })}
          {logs.length === 0 && (
            <div style={{ color: "#525252", textAlign: "center", padding: "40px" }}>
              NO LOGS DETECTED IN STORAGE BUFFER
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
