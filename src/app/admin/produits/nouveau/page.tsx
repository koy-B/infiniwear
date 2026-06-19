// src/app/admin/produits/nouveau/page.tsx
// Page de création d'un produit — Style Monochrome

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import NewProductForm from "@/components/admin/NewProductForm";

async function getCollections() {
  try {
    const collections = await db.collection.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });
    return collections;
  } catch (error) {
    console.warn("Database failed to load collections in new product page, using fallback collections:", error);
    return [
      { id: "col-normale", name: "Collection Normale" },
      { id: "col-feminine", name: "Collection Féminine" },
    ];
  }
}

export default async function NewProductPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/connexion?callbackUrl=/admin/produits/nouveau");
  }

  if (!["SUPER_ADMIN", "SUPPORT_AGENT"].includes(session.user.role!)) {
    redirect("/");
  }

  const collections = await getCollections();

  return (
    <div style={{ padding: "32px", maxWidth: "1000px" }} className="animate-fade-up">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "28px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "20px" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
            AJOUTER UN NOUVEAU PRODUIT
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Remplissez les informations ci-dessous pour ajouter un nouvel article au catalogue.
          </div>
        </div>
        <div>
          <Link href="/admin/produits" style={{ display: "inline-flex", alignItems: "center", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffffff", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.2)", height: "36px" }}>
            ← Retour aux produits
          </Link>
        </div>
      </div>

      {/* Form Card */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", padding: "32px" }}>
        <NewProductForm collections={collections} />
      </div>
    </div>
  );
}
