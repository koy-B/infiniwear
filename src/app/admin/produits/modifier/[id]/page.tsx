// src/app/admin/produits/modifier/[id]/page.tsx
// Page d'édition d'un produit — Style Monochrome

import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import EditProductForm from "@/components/admin/EditProductForm";
import { mockProducts } from "@/lib/mockProducts";

async function getProduct(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
    });
    if (product) return product;
  } catch (error) {
    console.warn(`Database failed to load product with id ${id}, attempting mockProducts fallback:`, error);
  }

  // Fallback to mock products if DB query fails or product not found
  const mockP = mockProducts.find((p) => p.id === id);
  if (mockP) {
    return {
      id: mockP.id,
      name: mockP.name,
      description: mockP.description || "",
      price: mockP.price,
      images: mockP.images,
      sizes: mockP.sizes,
      stock: mockP.stock,
      collectionId: mockP.collectionId || "col-normale",
      featured: mockP.featured,
      active: mockP.active,
    };
  }

  return null;
}

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
    console.warn("Database failed to load collections in edit product page, using fallback collections:", error);
    return [
      { id: "col-normale", name: "Collection Normale" },
      { id: "col-feminine", name: "Collection Féminine" },
    ];
  }
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/connexion?callbackUrl=/admin/produits");
  }

  if (!["SUPER_ADMIN", "SUPPORT_AGENT"].includes(session.user.role!)) {
    redirect("/");
  }

  const { id } = await params;
  const [product, collections] = await Promise.all([
    getProduct(id),
    getCollections(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div style={{ padding: "var(--admin-page-padding)", maxWidth: "1000px" }} className="animate-fade-up">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "28px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "20px" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
            MODIFIER LE PRODUIT
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Modifiez les informations de l'article ci-dessous.
          </div>
        </div>
        <div>
          <Link href="/admin/produits" style={{ display: "inline-flex", alignItems: "center", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffffff", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.2)", height: "36px" }}>
            ← Retour aux produits
          </Link>
        </div>
      </div>

      {/* Form Card */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", padding: "var(--admin-page-padding)" }}>
        <EditProductForm product={product} collections={collections} />
      </div>
    </div>
  );
}
