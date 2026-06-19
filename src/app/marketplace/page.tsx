// src/app/marketplace/page.tsx
// Page de boutique (Marketplace) premium - Server Component

import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { mockProducts } from "@/lib/mockProducts";
import { formatPrice } from "@/lib/utils";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Boutique Marketplace",
  description: "Découvrez notre catalogue complet de vêtements streetwear haut de gamme. No Limit Just Style.",
};

async function getProducts() {
  try {
    return await db.product.findMany({
      where: { active: true },
      include: { collection: true, category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.warn("Database failed to load products, using mock fallback:", error);
    return mockProducts;
  }
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{
    collection?: string;
    category?: string;
    sort?: string;
    priceMax?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const dbProducts = await getProducts();

  // ─── Filter & Sort Logic ───
  let filtered = [...dbProducts];

  // Collection
  if (params.collection) {
    filtered = filtered.filter(
      (p: any) => p.collection?.slug === params.collection
    );
  }

  // Category
  if (params.category) {
    filtered = filtered.filter(
      (p: any) => p.category?.slug === params.category
    );
  }

  // Max Price
  if (params.priceMax) {
    const max = parseInt(params.priceMax, 10);
    if (!isNaN(max)) {
      filtered = filtered.filter((p: any) => p.price <= max);
    }
  }

  // Search
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (p: any) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // Sort
  if (params.sort === "price_asc") {
    filtered.sort((a: any, b: any) => a.price - b.price);
  } else if (params.sort === "price_desc") {
    filtered.sort((a: any, b: any) => b.price - a.price);
  }

  // Gather categories for filter list
  const categories = Array.from(
    new Map<string, string>(
      dbProducts.map((p: any) => [p.category?.slug || "", p.category?.name || ""])
    ).entries()
  ).filter(([slug]: any) => slug !== "");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* Navbar */}
      <Navbar />

      <main style={{ padding: "120px 24px 80px", maxWidth: "1440px", margin: "0 auto" }}>
        
        {/* Header Title */}
        <header style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          paddingBottom: "32px",
          marginBottom: "40px"
        }}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em"
          }}>
            MARKETPLACE
          </h1>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            <p style={{
              fontSize: "11px",
              fontFamily: "var(--font-body)",
              color: "var(--text-secondary)",
              letterSpacing: "0.2em",
              textTransform: "uppercase"
            }}>
              Curated Selection — {filtered.length} Pièces disponibles
            </p>

            {/* Sorting links */}
            <div style={{ display: "flex", gap: "24px", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <span style={{ color: "var(--text-muted)" }}>Trier par :</span>
              <Link
                href={{ query: { ...params, sort: "newest" } }}
                style={{
                  color: !params.sort || params.sort === "newest" ? "var(--accent-blue)" : "var(--text-secondary)",
                  textDecoration: "none",
                  fontWeight: !params.sort || params.sort === "newest" ? 700 : 400
                }}
              >
                Nouveautés
              </Link>
              <Link
                href={{ query: { ...params, sort: "price_asc" } }}
                style={{
                  color: params.sort === "price_asc" ? "var(--accent-blue)" : "var(--text-secondary)",
                  textDecoration: "none",
                  fontWeight: params.sort === "price_asc" ? 700 : 400
                }}
              >
                Prix croissant
              </Link>
              <Link
                href={{ query: { ...params, sort: "price_desc" } }}
                style={{
                  color: params.sort === "price_desc" ? "var(--accent-blue)" : "var(--text-secondary)",
                  textDecoration: "none",
                  fontWeight: params.sort === "price_desc" ? 700 : 400
                }}
              >
                Prix décroissant
              </Link>
            </div>
          </div>
        </header>

        {/* Content Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px" }} className="lg:grid-cols-[240px_1fr]">
          
          {/* Filters Sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
            
            {/* Filter by Collection */}
            <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "24px" }}>
              <h3 style={{
                fontSize: "12px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#ffffff",
                marginBottom: "16px",
                fontWeight: 700
              }}>
                Collection
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link
                  href={{ query: { ...params, collection: undefined } }}
                  style={{
                    fontSize: "13px",
                    color: !params.collection ? "#ffffff" : "var(--text-secondary)",
                    textDecoration: "none",
                    fontWeight: !params.collection ? 600 : 400
                  }}
                >
                  Toutes les collections
                </Link>
                <Link
                  href={{ query: { ...params, collection: "normale" } }}
                  style={{
                    fontSize: "13px",
                    color: params.collection === "normale" ? "#ffffff" : "var(--text-secondary)",
                    textDecoration: "none",
                    fontWeight: params.collection === "normale" ? 600 : 400
                  }}
                >
                  Collection Normale
                </Link>
                <Link
                  href={{ query: { ...params, collection: "feminine" } }}
                  style={{
                    fontSize: "13px",
                    color: params.collection === "feminine" ? "#ffffff" : "var(--text-secondary)",
                    textDecoration: "none",
                    fontWeight: params.collection === "feminine" ? 600 : 400
                  }}
                >
                  Collection Féminine
                </Link>
              </div>
            </div>

            {/* Filter by Category */}
            {categories.length > 0 && (
              <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "24px" }}>
                <h3 style={{
                  fontSize: "12px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  marginBottom: "16px",
                  fontWeight: 700
                }}>
                  Catégorie
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Link
                    href={{ query: { ...params, category: undefined } }}
                    style={{
                      fontSize: "13px",
                      color: !params.category ? "#ffffff" : "var(--text-secondary)",
                      textDecoration: "none",
                      fontWeight: !params.category ? 600 : 400
                    }}
                  >
                    Toutes
                  </Link>
                  {categories.map(([slug, name]: any) => (
                    <Link
                      key={slug}
                      href={{ query: { ...params, category: slug } }}
                      style={{
                        fontSize: "13px",
                        color: params.category === slug ? "#ffffff" : "var(--text-secondary)",
                        textDecoration: "none",
                        fontWeight: params.category === slug ? 600 : 400
                      }}
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Filter by Price */}
            <div>
              <h3 style={{
                fontSize: "12px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#ffffff",
                marginBottom: "16px",
                fontWeight: 700
              }}>
                Budget Max
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {[20000, 30000, 50000].map((price) => (
                    <Link
                      key={price}
                      href={{ query: { ...params, priceMax: price.toString() } }}
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.08em",
                        padding: "6px 12px",
                        background: params.priceMax === price.toString() ? "#ffffff" : "var(--bg-card)",
                        color: params.priceMax === price.toString() ? "#000000" : "var(--text-secondary)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        textDecoration: "none"
                      }}
                    >
                      {formatPrice(price)}
                    </Link>
                  ))}
                </div>
                {params.priceMax && (
                  <Link
                    href={{ query: { ...params, priceMax: undefined } }}
                    style={{
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.2)"
                    }}
                  >
                    Réinitialiser le prix ×
                  </Link>
                )}
              </div>
            </div>

          </aside>

          {/* Product Grid */}
          <section>
            {filtered.length === 0 ? (
              <div style={{
                padding: "80px 24px",
                textAlign: "center",
                border: "1px dashed rgba(255, 255, 255, 0.1)",
                color: "var(--text-secondary)"
              }}>
                <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>∞</span>
                <p style={{ fontSize: "14px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Aucun article ne correspond à votre recherche.
                </p>
                <Link
                  href="/marketplace"
                  style={{
                    display: "inline-block",
                    marginTop: "20px",
                    fontSize: "11px",
                    color: "#ffffff",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    textDecoration: "none",
                    fontWeight: 700,
                    borderBottom: "1px solid rgba(255,255,255,0.2)"
                  }}
                >
                  Voir tout le catalogue
                </Link>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "24px"
              }}>
                {filtered.map((product: any) => (
                  <Link
                    key={product.id}
                    href={`/produit/${product.slug}`}
                    style={{ textDecoration: "none", color: "inherit", display: "block" }}
                    className="group"
                  >
                    <div style={{
                      background: "var(--bg-card)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      transition: "border-color 0.3s"
                    }} className="hover:border-white/20">
                      {/* Product Image */}
                      <div className="product-card-img" style={{
                        aspectRatio: "3/4",
                        background: "var(--bg-elevated)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        overflow: "hidden"
                      }}>
                        {product.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }}
                          />
                        ) : (
                          <span style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "48px",
                            color: "rgba(255,255,255,0.05)"
                          }}>
                            ∞
                          </span>
                        )}
                        {/* Collection overlay tag */}
                        <span style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          fontSize: "8px",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          padding: "4px 8px",
                          background: "rgba(255, 255, 255, 0.08)",
                          color: "#ffffff",
                          fontWeight: 700
                        }}>
                          {product.collection?.name}
                        </span>
                      </div>

                      {/* Product Info */}
                      <div style={{ padding: "20px" }}>
                        <span style={{
                          fontSize: "10px",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "var(--text-muted)",
                          display: "block",
                          marginBottom: "4px"
                        }}>
                          {product.category?.name || "Streetwear"}
                        </span>
                        <h2 style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "18px",
                          fontWeight: 600,
                          lineHeight: 1.2,
                          color: "#ffffff",
                          marginBottom: "12px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>
                          {product.name}
                        </h2>
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline"
                        }}>
                          <span style={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#ffffff"
                          }}>
                            {formatPrice(product.price)}
                          </span>
                          <span style={{
                            fontSize: "10px",
                            color: "var(--text-muted)"
                          }}>
                            {product.stock > 0 ? "Disponible" : "Épuisé"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}
