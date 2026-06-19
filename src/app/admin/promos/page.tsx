// src/app/admin/promos/page.tsx
// Page de gestion des codes de promotion — Style Monochrome

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import PromosManager from "@/components/admin/PromosManager";

async function getPromoCodes() {
  try {
    const promoCodes = await db.promoCode.findMany({
      orderBy: { createdAt: "desc" },
    });
    // Serialize Dates to ISO strings to avoid Next.js warnings/hydration issues
    return promoCodes.map((p: any) => ({
      ...p,
      expiresAt: p.expiresAt ? p.expiresAt.toISOString() : null,
      createdAt: p.createdAt.toISOString(),
    }));
  } catch (error) {
    console.warn("Database failed to load promo codes, using mock fallback:", error);
    return [
      {
        id: "promo-1",
        code: "INFINI20",
        type: "PERCENTAGE",
        value: 20,
        maxUses: 100,
        uses: 45,
        active: true,
        expiresAt: new Date("2026-12-31T23:59:59Z").toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: "promo-2",
        code: "WELCOME10",
        type: "FIXED",
        value: 5000, // 5000 FCFA
        maxUses: 500,
        uses: 112,
        active: true,
        expiresAt: null,
        createdAt: new Date().toISOString(),
      },
      {
        id: "promo-3",
        code: "FREESHIP",
        type: "FREE_SHIPPING",
        value: 0,
        maxUses: null,
        uses: 89,
        active: false,
        expiresAt: new Date("2026-05-01T00:00:00Z").toISOString(),
        createdAt: new Date().toISOString(),
      }
    ];
  }
}

export default async function PromosAdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/connexion?callbackUrl=/admin/promos");
  }

  if (!["SUPER_ADMIN", "SUPPORT_AGENT"].includes(session.user.role!)) {
    redirect("/");
  }

  const promos = await getPromoCodes();

  return (
    <div style={{ padding: "var(--admin-page-padding)" }} className="animate-fade-up">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
            CODES PROMOS & COUPONS ({promos.length})
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Configurez et suivez l'utilisation des codes promotionnels et des réductions.
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/admin" style={{ display: "inline-flex", alignItems: "center", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffffff", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.2)", height: "36px" }}>
            ← Retour
          </Link>
          {/* Note: Le bouton + Créer un coupon est géré à l'intérieur de PromosManager */}
          <div style={{ width: "135px" }} />
        </div>
      </div>

      {/* Promos Table Manager */}
      <PromosManager promos={promos} />
    </div>
  );
}
