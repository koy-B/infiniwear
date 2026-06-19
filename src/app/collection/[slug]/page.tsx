// src/app/collection/[slug]/page.tsx
// Page éditoriale d'une collection spécifique - Server Component

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { mockProducts } from "@/lib/mockProducts";
import { formatPrice } from "@/lib/utils";
import { db } from "@/lib/db";

// Force la résolution dynamique de la route
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCollectionData(slug: string) {
  try {
    const collection = await db.collection.findUnique({
      where: { slug },
      include: { products: { where: { active: true } } },
    });
    return collection;
  } catch (error) {
    console.warn(`Prisma error fetching collection ${slug}, using mock fallback:`, error);
    
    if (slug === "normale") {
      return {
        id: "col-normale",
        name: "Collection Normale",
        slug: "normale",
        description: "L'essence du streetwear contemporain. Des lignes architecturales, des cotons lourds et des finitions brutes méticuleuses.",
        coverImage: "/images/normale/ChatGPT Image 14 juin 2026, 20_26_45.png",
        products: mockProducts.filter((p) => p.collectionId === "normale"),
      };
    } else if (slug === "feminine") {
      return {
        id: "col-feminine",
        name: "Collection Féminine",
        slug: "feminine",
        description: "L'harmonie parfaite du minimalisme et du luxe streetwear. Conçu pour sculpter des silhouettes affirmées sans limites.",
        coverImage: "/images/feminine/IMG_3409.JPG.jpeg",
        products: mockProducts.filter((p) => p.collectionId === "feminine"),
      };
    }
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const colName = slug === "feminine" ? "Collection Féminine" : "Collection Normale";
  return {
    title: `Collection ${colName}`,
    description: `Découvrez la collection ${colName} InfiniWear. No Limit Just Style.`,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  
  if (slug !== "normale" && slug !== "feminine") {
    notFound();
  }

  const collection = await getCollectionData(slug);

  if (!collection) {
    notFound();
  }

  const isFeminine = slug === "feminine";
  const accentColor = "#ffffff";
  const bgGlow = "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)", position: "relative" }}>
      {/* Background radial glow */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "600px",
        background: bgGlow,
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Navbar */}
      <Navbar />

      <main style={{ padding: "120px 24px 80px", maxWidth: "1440px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        
        {/* Editorial Collection Hero Banner */}
        <section style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "40px",
          marginBottom: "80px",
          alignItems: "center"
        }} className="md:grid-cols-[1.2fr_1fr]">
          
          {/* Cover Image */}
          <div style={{
            aspectRatio: "16/10",
            background: "var(--bg-card)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            overflow: "hidden",
            position: "relative"
          }}>
            {collection.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={collection.coverImage}
                alt={collection.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: isFeminine ? "top" : "center"
                }}
              />
            ) : (
              <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontSize: "72px",
                color: "rgba(255, 255, 255, 0.03)"
              }}>
                ∞
              </div>
            )}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(8,9,10,0.8) 0%, transparent 60%)"
            }} />
          </div>

          {/* Texts */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <span style={{
              fontSize: "10px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: accentColor,
              fontWeight: 700
            }}>
              Collection Exclusive
            </span>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              textTransform: "uppercase"
            }}>
              {collection.name}
            </h1>
            <p style={{
              fontSize: "16px",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: "520px"
            }}>
              {collection.description || "Une vision moderne alliant design géométrique et confort absolu."}
            </p>
            <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
              <Link
                href="/marketplace"
                className="iw-btn iw-btn-outline"
                style={{ height: "44px", fontSize: "11px" }}
              >
                Tout le catalogue
              </Link>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "60px" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: "40px",
            textTransform: "uppercase"
          }}>
            Les Pièces de la Collection ({collection.products?.length || 0})
          </h2>

          {(!collection.products || collection.products.length === 0) ? (
            <div style={{
              padding: "60px",
              textAlign: "center",
              border: "1px dashed rgba(255,255,255,0.08)",
              color: "var(--text-secondary)"
            }}>
              Aucun produit n'est disponible pour le moment dans cette collection.
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px"
            }}>
              {collection.products.map((product) => (
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
                    
                    {/* Image */}
                    <div className="product-card-img" style={{
                      aspectRatio: "3/4",
                      background: "var(--bg-elevated)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      position: "relative"
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
                          color: "rgba(255, 255, 255, 0.03)"
                        }}>
                          ∞
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ padding: "24px" }}>
                      <span style={{
                        fontSize: "9px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: accentColor,
                        display: "block",
                        marginBottom: "4px",
                        fontWeight: 700
                      }}>
                        {collection.name}
                      </span>
                      <h3 style={{
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
                      </h3>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline"
                      }}>
                        <span style={{
                          fontSize: "15px",
                          fontWeight: 700,
                          color: accentColor
                        }}>
                          {formatPrice(product.price)}
                        </span>
                        <span style={{
                          fontSize: "10px",
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em"
                        }}>
                          Voir la pièce →
                        </span>
                      </div>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
