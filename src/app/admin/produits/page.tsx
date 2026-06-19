// src/app/admin/produits/page.tsx
// Page de gestion des produits — Style Monochrome

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { mockProducts } from "@/lib/mockProducts";
import Link from "next/link";

async function getProducts() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { collection: true },
    });
    return products;
  } catch (error) {
    console.warn("Database failed to load products in admin, using mockProducts fallback:", error);
    // Transform mockProducts to conform to Prisma shape for rendering
    return mockProducts.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      images: p.images,
      stock: p.stock,
      active: p.active,
      featured: p.featured,
      collection: { name: p.collection.name },
    }));
  }
}

export default async function ProductsAdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/connexion?callbackUrl=/admin/produits");
  }

  if (!["SUPER_ADMIN", "SUPPORT_AGENT"].includes(session.user.role!)) {
    redirect("/");
  }

  const products = await getProducts();

  return (
    <div style={{ padding: "32px" }} className="animate-fade-up">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
            CATALOGUE PRODUITS ({products.length})
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Gérez les articles de la boutique, le stock et la mise en avant des produits.
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/admin" style={{ display: "inline-flex", alignItems: "center", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffffff", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.2)", height: "36px" }}>
            ← Retour
          </Link>
          <Link href="/admin/produits/nouveau" style={{ display: "inline-flex", alignItems: "center", padding: "0 16px", height: "36px", background: "#ffffff", color: "#000000", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>
            + Ajouter un produit
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(255,255,255,0.02)" }}>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Visuel</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Nom</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Collection</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Prix</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Stock</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Statut</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isLowStock = product.stock <= 10;
              return (
                <tr key={product.id} style={{ borderBottom: "1px solid var(--border-subtle)", transition: "background 0.2s" }} className="hover:bg-white/[0.02]">
                  {/* Visual */}
                  <td style={{ padding: "12px 24px" }}>
                    <div style={{ width: "40px", height: "48px", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {product.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)" }} />
                      ) : (
                        <span style={{ fontSize: "16px", opacity: 0.1 }}>∞</span>
                      )}
                    </div>
                  </td>
                  {/* Name */}
                  <td style={{ padding: "12px 24px", fontWeight: 500, color: "var(--text-primary)" }}>
                    <div>{product.name}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>/{product.slug}</div>
                  </td>
                  {/* Collection */}
                  <td style={{ padding: "12px 24px", color: "var(--text-secondary)" }}>
                    {product.collection?.name || "Sans collection"}
                  </td>
                  {/* Price */}
                  <td style={{ padding: "12px 24px", fontWeight: 600 }}>
                    {formatPrice(product.price)}
                  </td>
                  {/* Stock */}
                  <td style={{ padding: "12px 24px" }}>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontWeight: 600,
                      color: isLowStock ? "#fb7185" : "var(--text-primary)"
                    }}>
                      <span style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: isLowStock ? "#fb7185" : "#34d399",
                        display: "inline-block"
                      }} />
                      {product.stock} pcs
                    </span>
                  </td>
                  {/* Status */}
                  <td style={{ padding: "12px 24px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {product.active && (
                        <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 6px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#ffffff" }}>
                          Actif
                        </span>
                      )}
                      {product.featured && (
                        <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 6px", background: "#ffffff", color: "#000000" }}>
                          Star
                        </span>
                      )}
                    </div>
                  </td>
                  {/* Actions */}
                  <td style={{ padding: "12px 24px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      <Link href={`/produit/${product.slug}`} target="_blank" style={{ color: "var(--text-muted)", textDecoration: "none", borderBottom: "1px solid transparent" }} className="hover:border-white hover:text-white">
                        Voir
                      </Link>
                      <Link href={`/admin/produits/modifier/${product.id}`} style={{ color: "var(--text-muted)", textDecoration: "none", borderBottom: "1px solid transparent" }} className="hover:border-white hover:text-white">
                        Éditer
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
