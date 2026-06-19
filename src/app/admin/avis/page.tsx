// src/app/admin/avis/page.tsx
// Page de gestion des avis clients — Style Monochrome

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import ReviewsManager from "@/components/admin/ReviewsManager";

async function getReviews() {
  try {
    const reviews = await db.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, pseudo: true } },
        product: { select: { name: true } }
      }
    });
    // Serialize Dates to ISO strings
    return reviews.map((r: any) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }));
  } catch (error) {
    console.warn("Database failed to load reviews, using mock fallback:", error);
    return [
      {
        id: "rev-1",
        rating: 5,
        comment: "La qualité du coton lourd est absolument incroyable. Coupe parfaite, lourde et structurée. Je recommande vivement !",
        approved: true,
        createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
        user: { name: "Bamba K.", pseudo: "bamba_style" },
        product: { name: "T-Shirt Infini Signature Black" }
      },
      {
        id: "rev-2",
        rating: 4,
        comment: "Excellent sweat à capuche, très chaud et minimaliste. J'enlève une étoile car la livraison a pris 2 jours de plus que prévu.",
        approved: false,
        createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
        user: { name: "Client Démo", pseudo: "client_demo" },
        product: { name: "Hoodie Structural Silence" }
      },
      {
        id: "rev-3",
        rating: 5,
        comment: "Coupe asymétrique parfaite sur le crop top, le tissu est hyper agréable sur la peau.",
        approved: true,
        createdAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
        user: { name: "Marie Diop", pseudo: "marie_d" },
        product: { name: "Crop Top Infini Rose" }
      }
    ];
  }
}

export default async function ReviewsAdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/connexion?callbackUrl=/admin/avis");
  }

  if (!["SUPER_ADMIN", "SUPPORT_AGENT"].includes(session.user.role!)) {
    redirect("/");
  }

  const reviews = await getReviews();

  return (
    <div style={{ padding: "var(--admin-page-padding)" }} className="animate-fade-up">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
            MODÉRATION DES AVIS CLIENTS ({reviews.length})
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Approuvez ou rejetez les retours d'expérience clients affichés sur les fiches produits.
          </div>
        </div>
        <Link href="/admin" style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffffff", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
          ← Retour dashboard
        </Link>
      </div>

      {/* Reviews Table Manager */}
      <ReviewsManager reviews={reviews} />
    </div>
  );
}
