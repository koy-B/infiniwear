// src/app/page.tsx
// Landing page principale InfiniWear — Style Éditorial & Monochrome

import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import { mockProducts } from "@/lib/mockProducts";
import fs from "fs";
import path from "path";

async function getHomeConfig() {
  try {
    const configPath = path.join(process.cwd(), "src", "lib", "homeConfig.json");
    const data = await fs.promises.readFile(configPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.warn("Failed to load settings config on home page, using defaults:", error);
    return {
      appName: "InfiniWear",
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+22507000000",
      heroImage: "/images/normale/ChatGPT Image 14 juin 2026, 20_26_45.png",
      heroTitle: "SILENCE\nARCHITECTURAL",
      heroSubtitle: "∞ L'Édition Permanente",
      savoirFaireImage: "/images/feminine/IMG_3409.JPG.jpeg",
      savoirFaireTitle: "L'ART DE LA\nMATIÈRE",
      savoirFaireDesc: "Chaque création InfiniWear est pensée comme une oeuvre architecturale. Nous développons nos coupes avec une attention obsessionnelle aux structures et aux matières haut de grammage."
    };
  }
}

export const metadata: Metadata = {
  title: "InfiniWear — L'Infini du Style",
  description: "Marque de streetwear haut de gamme et luxe minimaliste. Collections Normale & Féminine. No Limit Just Style.",
};

async function getFeaturedProducts() {
  try {
    const products = await db.product.findMany({
      where: { active: true, featured: true },
      include: { collection: true },
      take: 4,
      orderBy: { createdAt: "desc" },
    });
    return products;
  } catch {
    console.warn("Database failed to load featured products, using mock fallback.");
    return mockProducts.filter((p) => p.featured).slice(0, 4);
  }
}

async function getCollections() {
  try {
    return await db.collection.findMany({ where: { active: true }, orderBy: { name: "asc" } });
  } catch {
    return [
      { id: "col-normale", name: "Collection Normale", slug: "normale", description: "Streetwear & essentiels" },
      { id: "col-feminine", name: "Collection Féminine", slug: "feminine", description: "Lignes fluides & crops" },
    ];
  }
}

export default async function HomePage() {
  const [featuredProducts, collections, homeConfig] = await Promise.all([
    getFeaturedProducts(),
    getCollections(),
    getHomeConfig(),
  ]);

  return (
    <div style={{ minHeight: "100vh", background: "#08090a", color: "#ffffff", overflowX: "hidden" }}>
      
      {/* ─── NAVBAR ─── */}
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Background Image / Overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.4 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={homeConfig.heroImage}
            alt="Infiniwear Cinematic Editorial"
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)" }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, #08090a via-transparent to-transparent)"
          }} />
        </div>

        {/* Hero Content */}
        <div style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "0 24px",
          textAlign: "left"
        }}>
          <div style={{ maxWidth: "800px" }}>
            <p style={{
              fontSize: "11px",
              fontFamily: "var(--font-body)",
              color: "var(--text-secondary)",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              marginBottom: "24px"
            }}>
              {homeConfig.heroSubtitle}
            </p>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(48px, 9vw, 96px)",
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              marginBottom: "36px",
              textTransform: "uppercase"
            }}>
              {homeConfig.heroTitle.split("\n").map((line: string, i: number) => {
                const isEven = i % 2 === 1;
                return (
                  <span key={i} style={{ display: "block" }}>
                    {isEven ? (
                      <em style={{ fontStyle: "italic", fontWeight: 400 }}>{line}</em>
                    ) : (
                      line
                    )}
                  </span>
                );
              })}
            </h1>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <Link
                href="/marketplace"
                className="iw-btn iw-btn-primary"
                style={{ height: "48px", padding: "0 28px", fontSize: "11px" }}
              >
                Explorer lookbook
              </Link>
              <Link
                href="/collection/normale"
                className="iw-btn iw-btn-outline"
                style={{ height: "48px", padding: "0 28px", fontSize: "11px" }}
              >
                Collections
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          opacity: 0.4
        }}>
          <span style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}>Scroll</span>
          <div style={{ width: 1, height: 24, background: "rgba(255, 255, 255, 0.2)" }} />
        </div>
      </section>

      {/* ─── SEASON ESSENTIALS ─── */}
      <section style={{ padding: "120px 24px 80px", maxWidth: "1440px", margin: "0 auto" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          paddingBottom: "24px",
          marginBottom: "48px"
        }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            textTransform: "uppercase"
          }}>
            Season Essentials
          </h2>
          <Link
            href="/marketplace"
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: 600,
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
            }}
          >
            Voir tout →
          </Link>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px"
        }}>
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/produit/${product.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
              className="group"
            >
              <div style={{
                background: "var(--bg-card)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                transition: "border-color 0.3s"
              }} className="hover:border-white/20">
                <div className="product-card-img" style={{
                  aspectRatio: "3/4",
                  background: "var(--bg-elevated)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden"
                }}>
                  {product.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "48px", color: "rgba(255,255,255,0.05)" }}>∞</span>
                  )}
                </div>
                <div style={{ padding: "20px" }}>
                  <span style={{
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    display: "block",
                    marginBottom: "4px",
                    fontWeight: 700
                  }}>
                    {product.collection?.name || "Premium Series"}
                  </span>
                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "18px",
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: "#ffffff",
                    marginBottom: "8px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {product.name}
                  </h3>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── SAVOIR-FAIRE ─── */}
      <section style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        padding: "120px 24px"
      }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "60px", alignItems: "center" }} className="lg:grid-cols-12">
            
            {/* Left Column Texts */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="lg:col-span-5">
              <span style={{
                fontSize: "11px",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                fontWeight: 700
              }}>
                Savoir-Faire
              </span>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.02em"
              }}>
                {homeConfig.savoirFaireTitle.split("\n").map((line: string, i: number) => (
                  <span key={i} style={{ display: "block" }}>{line}</span>
                ))}
              </h2>
              <p style={{
                fontSize: "16px",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                maxWidth: "480px"
              }}>
                {homeConfig.savoirFaireDesc}
              </p>
              
              {/* Features List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "baseline", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "12px" }}>
                  <span style={{ fontSize: "18px", fontWeight: 700, opacity: 0.3, fontFamily: "var(--font-display)" }}>01</span>
                  <div>
                    <h4 style={{ fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
                      Coupes Architecturales
                    </h4>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      Épaules marquées, tombés fluides et asymétries calculées.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "baseline", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "12px" }}>
                  <span style={{ fontSize: "18px", fontWeight: 700, opacity: 0.3, fontFamily: "var(--font-display)" }}>02</span>
                  <div>
                    <h4 style={{ fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
                      Coton Lourd Organique
                    </h4>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      Mailles denses sélectionnées pour leur longévité éthique et leur tenue parfaite.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column Editorial Image */}
            <div className="lg:col-span-7" style={{ position: "relative" }}>
              <div style={{
                aspectRatio: "4/3",
                background: "var(--bg-elevated)",
                border: "1px solid rgba(255,255,255,0.05)",
                overflow: "hidden"
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={homeConfig.savoirFaireImage}
                  alt="Fabric detail close-up"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", filter: "grayscale(100%)" }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── TWO COLLECTIONS BANNER ─── */}
      <section style={{ padding: "120px 24px", maxWidth: "1440px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }} className="md:grid-cols-2">
          {collections.slice(0, 2).map((col) => {
            const isFeminine = col.slug === "feminine";
            const cover = isFeminine 
              ? "/images/feminine/IMG_3413.JPG.jpeg" 
              : "/images/normale/IMG_2210.PNG";
            return (
              <Link
                key={col.id}
                href={`/collection/${col.slug}`}
                style={{
                  textDecoration: "none",
                  display: "block",
                  position: "relative",
                  aspectRatio: "4/5",
                  background: "var(--bg-card)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  overflow: "hidden"
                }}
                className="group"
              >
                {/* Image background */}
                <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.5 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover}
                    alt={col.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "grayscale(100%)",
                      transition: "transform 0.8s var(--transition-slow)"
                    }}
                    className="group-hover:scale-105"
                  />
                </div>
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, #08090a 15%, transparent 70%)"
                }} />

                {/* Content */}
                <div style={{
                  position: "absolute",
                  bottom: "40px",
                  left: "40px",
                  right: "40px",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}>
                  <span style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    Découvrir la
                  </span>
                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "36px",
                    fontWeight: 900,
                    letterSpacing: "-0.01em",
                    color: "#ffffff"
                  }}>
                    {col.name.toUpperCase()}
                  </h3>
                  <span style={{
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#ffffff",
                    fontWeight: 700,
                    borderBottom: "1px solid #ffffff",
                    width: "fit-content",
                    paddingBottom: "2px",
                    marginTop: "8px"
                  }}>
                    Explorer la collection →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        padding: "120px 24px",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 800,
            letterSpacing: "-0.02em"
          }}>
            L'INSIDER CIRCLE
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 auto 16px", maxWidth: "440px" }}>
            Inscrivez-vous pour recevoir des invitations privées de nos présentations de collection et de nos pièces d'exception.
          </p>
          <form style={{
            display: "flex",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
          }}>
            <input
              type="email"
              placeholder="VOTRE ADRESSE EMAIL"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#ffffff",
                padding: "12px 0",
                fontSize: "12px",
                letterSpacing: "0.15em",
                fontFamily: "var(--font-body)"
              }}
              required
            />
            <button
              type="submit"
              style={{
                background: "transparent",
                border: "none",
                color: "#ffffff",
                fontSize: "11px",
                letterSpacing: "0.2em",
                fontWeight: 700,
                textTransform: "uppercase",
                cursor: "pointer",
                padding: "0 16px"
              }}
            >
              Rejoindre
            </button>
          </form>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        background: "#08090a",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        padding: "80px 24px 40px"
      }}>
        <div style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "48px",
          marginBottom: "60px"
        }} className="md:grid-cols-12">
          
          <div className="md:col-span-6" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: 800,
              letterSpacing: "0.2em"
            }}>
              {homeConfig.appName.toUpperCase()}
            </span>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7, maxWidth: "400px" }}>
              Redéfinir le vestiaire contemporain par la précision de la coupe et une longévité esthétique absolue. No Limit Just Style.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ffffff", fontWeight: 700, marginBottom: "20px" }}>
              Services
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", padding: 0 }}>
              <li><Link href="/marketplace" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Boutique en ligne</Link></li>
              <li><Link href="/profil" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Mon Profil</Link></li>
              <li><a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Livraisons & Retours</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ffffff", fontWeight: 700, marginBottom: "20px" }}>
              Maison
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", padding: 0 }}>
              <li><a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Notre Vision</a></li>
              <li><a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Savoir-Faire</a></li>
              <li><a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Contact WhatsApp</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom footer */}
        <div style={{
          maxWidth: "1440px",
          margin: "0 auto",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          paddingTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "10px",
          letterSpacing: "0.1em",
          color: "var(--text-muted)",
          textTransform: "uppercase"
        }}>
          <span>© 2026 {homeConfig.appName.toUpperCase()}. No Limit Just Style.</span>
          <div style={{ display: "flex", gap: "24px" }}>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Confidentialité</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Conditions</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
