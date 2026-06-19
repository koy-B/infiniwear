// src/components/products/ProductDetailsClient.tsx
"use client";

import { useState } from "react";
import { formatPrice, generateWhatsAppMessage, buildWhatsAppUrl } from "@/lib/utils";

interface ProductDetailsClientProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    images: string[];
    sizes: string[];
    stock: number;
    collectionId: string;
    collection: { name: string };
    category: { name: string } | null;
  };
  userSession?: {
    user?: {
      name?: string | null;
      email?: string | null;
    };
  } | null;
}

export default function ProductDetailsClient({ product, userSession }: ProductDetailsClientProps) {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "M");
  const [activeImage, setActiveImage] = useState<string>(product.images[0] || "");
  const [loading, setLoading] = useState(false);

  const isFeminine = product.collectionId === "feminine";
  const accentColor = "#ffffff";
  const buttonStyle = { background: "rgba(255, 255, 255, 0.08)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.15)" };

  const handleWhatsAppOrder = () => {
    setLoading(true);
    
    // Genere un identifiant de commande temporaire pour WhatsApp
    const mockOrderId = `IW-${Math.floor(100000 + Math.random() * 900000)}`;
    const pseudo = userSession?.user?.name || "Client InfiniWear";
    
    const message = generateWhatsAppMessage({
      pseudo,
      orderId: mockOrderId,
      items: [{ name: product.name, size: selectedSize, quantity: 1 }],
      total: product.price
    });
    
    // Redirige vers WhatsApp
    const waUrl = buildWhatsAppUrl(message);
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setLoading(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "48px" }} className="lg:grid-cols-[1.5fr_1fr]">
      
      {/* Immersive Gallery Column */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }} className="md:flex-row">
        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div style={{
            display: "flex",
            flexDirection: "row",
            gap: "12px",
            overflowX: "auto"
          }} className="md:flex-col md:overflow-x-visible md:sticky md:top-24 h-fit">
            {product.images.map((img) => (
              <button
                key={img}
                onClick={() => setActiveImage(img)}
                style={{
                  width: "80px",
                  aspectRatio: "3/4",
                  overflow: "hidden",
                  border: activeImage === img ? `1px solid ${accentColor}` : "1px solid rgba(255, 255, 255, 0.05)",
                  background: "var(--bg-card)",
                  padding: 0,
                  cursor: "pointer"
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="Aperçu" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
            ))}
          </div>
        )}

        {/* Main Large Image */}
        <div style={{
          flex: 1,
          aspectRatio: "3/4",
          background: "var(--bg-card)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          overflow: "hidden",
          position: "relative"
        }}>
          {activeImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeImage}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
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
              fontSize: "96px",
              color: "rgba(255, 255, 255, 0.03)"
            }}>
              ∞
            </div>
          )}
        </div>
      </div>

      {/* Info Column */}
      <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
        
        {/* Title & Collection */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{
              fontSize: "10px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              fontWeight: 700
            }}>
              {product.collection.name}
            </span>
            <div style={{ height: "1px", flex: 1, background: "rgba(255, 255, 255, 0.05)" }}></div>
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 800,
            lineHeight: 1.2,
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: "-0.01em"
          }}>
            {product.name}
          </h1>
          <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginTop: "8px" }}>
            <p style={{
              fontSize: "24px",
              fontWeight: 800,
              color: accentColor,
              margin: 0
            }}>
              {formatPrice(product.price)}
            </p>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              TVA et livraison locale calculées lors de la commande
            </span>
          </div>
        </div>

        {/* Description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <p style={{
            fontSize: "15px",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            margin: 0
          }}>
            {product.description || "Une pièce d'exception de la collection InfiniWear. No Limit Just Style."}
          </p>
        </div>

        {/* Size Selection */}
        {product.sizes.length > 0 && (
          <div>
            <span style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#ffffff",
              display: "block",
              marginBottom: "12px",
              fontWeight: 700
            }}>
              Sélectionnez une Taille
            </span>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    minWidth: "48px",
                    height: "48px",
                    padding: "0 12px",
                    fontSize: "12px",
                    fontWeight: 700,
                    background: selectedSize === size ? "#ffffff" : "transparent",
                    color: selectedSize === size ? "#000000" : "var(--text-primary)",
                    border: selectedSize === size ? "1px solid #ffffff" : "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 0,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px" }}>
          <button
            onClick={handleWhatsAppOrder}
            disabled={loading || product.stock === 0}
            className="iw-btn"
            style={{
              height: "54px",
              width: "100%",
              justifyContent: "center",
              fontSize: "11px",
              letterSpacing: "0.18em",
              fontWeight: 700,
              background: "#ffffff",
              color: "#000000",
              opacity: product.stock === 0 ? 0.5 : 1
            }}
          >
            {product.stock === 0 
              ? "Épuisé" 
              : loading 
                ? "Génération du lien..." 
                : "Commander via WhatsApp 💬"}
          </button>
          
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "center",
            fontSize: "11px",
            color: "var(--text-muted)"
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399" }} />
            Stock actuel : {product.stock} pièces disponibles
          </div>
        </div>

        {/* Editorial Details Cards */}
        <div style={{
          marginTop: "20px",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          paddingTop: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          <div style={{
            padding: "16px",
            background: "var(--bg-card)",
            borderLeft: `2px solid ${accentColor}`
          }}>
            <span style={{
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#ffffff",
              display: "block",
              marginBottom: "4px",
              fontWeight: 700
            }}>
              Qualité Artisanale
            </span>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Développé dans nos ateliers avec des coutures renforcées et du coton organique haut de grammage.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
