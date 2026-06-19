// src/app/admin/collections/page.tsx
// Page de gestion des collections — Style Monochrome

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { mockProducts } from "@/lib/mockProducts";
import Link from "next/link";

async function getCollections() {
  try {
    const collections = await db.collection.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    return collections;
  } catch (error) {
    console.warn("Database failed to load collections in admin, using mock fallback:", error);
    const countNormale = mockProducts.filter(p => p.collectionId === "normale").length;
    const countFeminine = mockProducts.filter(p => p.collectionId === "feminine").length;
    return [
      {
        id: "col-normale",
        name: "Collection Normale",
        slug: "normale",
        description: "L'essence du streetwear contemporain. Des lignes architecturales, des cotons lourds et des finitions brutes méticuleuses.",
        active: true,
        _count: { products: countNormale }
      },
      {
        id: "col-feminine",
        name: "Collection Féminine",
        slug: "feminine",
        description: "L'harmonie parfaite du minimalisme et du luxe streetwear. Conçu pour sculpter des silhouettes affirmées sans limites.",
        active: true,
        _count: { products: countFeminine }
      }
    ];
  }
}

export default async function CollectionsAdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/connexion?callbackUrl=/admin/collections");
  }

  if (!["SUPER_ADMIN", "SUPPORT_AGENT"].includes(session.user.role!)) {
    redirect("/");
  }

  const collections = await getCollections();

  return (
    <div style={{ padding: "32px" }} className="animate-fade-up">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
            GESTION DES COLLECTIONS ({collections.length})
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Éditez les lignes de vêtements, activez/désactivez des univers créatifs entiers.
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/admin" style={{ display: "inline-flex", alignItems: "center", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffffff", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.2)", height: "36px" }}>
            ← Retour
          </Link>
          <Link href="/admin/collections/nouveau" style={{ display: "inline-flex", alignItems: "center", padding: "0 16px", height: "36px", background: "#ffffff", color: "#000000", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>
            + Nouvelle collection
          </Link>
        </div>
      </div>

      {/* Collections Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(255,255,255,0.02)" }}>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Nom</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Identifiant (Slug)</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Description</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Nombre d'articles</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Statut</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((col: any) => (
              <tr key={col.id} style={{ borderBottom: "1px solid var(--border-subtle)", transition: "background 0.2s" }} className="hover:bg-white/[0.02]">
                {/* Name */}
                <td style={{ padding: "18px 24px", fontWeight: 600, color: "var(--text-primary)" }}>
                  {col.name}
                </td>
                {/* Slug */}
                <td style={{ padding: "18px 24px", color: "var(--text-muted)" }}>
                  /{col.slug}
                </td>
                {/* Description */}
                <td style={{ padding: "18px 24px", color: "var(--text-secondary)", maxWidth: "340px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={col.description || ""}>
                  {col.description || "Aucune description"}
                </td>
                {/* Products Count */}
                <td style={{ padding: "18px 24px", fontWeight: 600 }}>
                  {col._count?.products || 0} articles
                </td>
                {/* Active */}
                <td style={{ padding: "18px 24px" }}>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "2px 8px",
                    background: col.active ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                    border: col.active ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.05)",
                    color: col.active ? "#ffffff" : "var(--text-muted)"
                  }}>
                    {col.active ? "Actif" : "Inactif"}
                  </span>
                </td>
                {/* Actions */}
                <td style={{ padding: "18px 24px", textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    <Link href={`/collection/${col.slug}`} target="_blank" style={{ color: "var(--text-muted)", textDecoration: "none", borderBottom: "1px solid transparent" }} className="hover:border-white hover:text-white">
                      Voir
                    </Link>
                    <Link href={`/admin/collections/modifier/${col.id}`} style={{ color: "var(--text-muted)", textDecoration: "none", borderBottom: "1px solid transparent" }} className="hover:border-white hover:text-white">
                      Éditer
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
