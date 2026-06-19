// src/app/profil/page.tsx
// Espace Profil Client - Server Component

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { auth, signOut } from "@/lib/auth";
import { formatPrice, relativeDate } from "@/lib/utils";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Mon Profil",
  description: "Gérez vos commandes et informations de compte InfiniWear.",
};

async function getClientOrders(userId: string) {
  try {
    return await db.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { product: { select: { name: true, images: true } } } },
      },
      take: 20,
    });
  } catch (error) {
    console.warn(`Prisma error fetching client orders for ${userId}, using mock fallback:`, error);
    
    // Return mock orders for testing
    return [
      {
        id: "mock-order-1",
        status: "PENDING",
        total: 45000,
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
        items: [
          {
            id: "mi1",
            productId: "p1",
            size: "M",
            quantity: 1,
            price: 45000,
            product: { name: "Oversized Hoodie Signature", images: ["/images/normale/IMG_2210.PNG"] }
          }
        ]
      },
      {
        id: "mock-order-2",
        status: "DELIVERED",
        total: 20000,
        createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
        items: [
          {
            id: "mi2",
            productId: "p2",
            size: "L",
            quantity: 1,
            price: 20000,
            product: { name: "Short Molleton Noir Classique", images: ["/images/normale/IMG_2063.JPG.jpeg"] }
          }
        ]
      }
    ];
  }
}

const statusStyle: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: "En attente", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
  CONFIRMED: { label: "Confirmée",  color: "#34d399", bg: "rgba(52,211,153,0.1)" },
  DELIVERED: { label: "Livrée",     color: "#38bdf8", bg: "rgba(56,189,248,0.1)" },
  CANCELLED: { label: "Annulée",    color: "#fb7185", bg: "rgba(251,113,133,0.1)" },
};

export default async function ProfilPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/connexion?callbackUrl=/profil");
  }

  const orders = await getClientOrders(user.id || "mock-client-id");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* Navbar */}
      <Navbar />

      <main style={{ padding: "120px 24px 80px", maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Title */}
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          paddingBottom: "24px",
          marginBottom: "40px",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div>
            <span style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
              Espace Client
            </span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 800, marginTop: "4px" }}>
              Mon Compte
            </h1>
          </div>

          {/* Logout Action */}
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}>
            <button
              type="submit"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                height: "36px",
                padding: "0 16px",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer"
              }}
            >
              Déconnexion
            </button>
          </form>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px" }} className="md:grid-cols-[300px_1fr]">
          
          {/* User Profile Card */}
          <section style={{
            background: "var(--bg-card)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            padding: "28px",
            height: "fit-content"
          }}>
            <h2 style={{
              fontSize: "12px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "20px",
              fontWeight: 700
            }}>
              Vos Informations
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-muted)", display: "block" }}>Nom complet</span>
                <span style={{ fontSize: "14px", fontWeight: 600 }}>{user.name || "Utilisateur InfiniWear"}</span>
              </div>
              <div>
                <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-muted)", display: "block" }}>Adresse Email</span>
                <span style={{ fontSize: "14px", fontWeight: 600 }}>{user.email}</span>
              </div>
              <div>
                <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-muted)", display: "block" }}>Statut Compte</span>
                <span style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "3px 8px",
                  background: "rgba(52, 211, 153, 0.08)",
                  color: "#34d399",
                  width: "fit-content"
                }}>
                  {user.role === "SUPER_ADMIN" ? "Administrateur" : "Membre Actif"}
                </span>
              </div>
              
              {["SUPER_ADMIN", "SUPPORT_AGENT"].includes(user.role || "") && (
                <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "20px" }}>
                  <Link
                    href="/admin"
                    className="iw-btn iw-btn-primary"
                    style={{ width: "100%", justifyContent: "center", height: "40px", fontSize: "10px" }}
                  >
                    Accéder au Panel Admin
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Orders History List */}
          <section>
            <h2 style={{
              fontSize: "16px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              marginBottom: "20px"
            }}>
              Historique des Commandes ({orders.length})
            </h2>

            {orders.length === 0 ? (
              <div style={{
                padding: "40px",
                textAlign: "center",
                background: "var(--bg-card)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                color: "var(--text-secondary)"
              }}>
                Vous n'avez pas encore passé de commande.
                <div style={{ marginTop: "16px" }}>
                  <Link href="/marketplace" className="iw-btn iw-btn-primary" style={{ height: "36px", fontSize: "10px" }}>
                    Visiter la boutique
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {orders.map((order) => {
                  const st = statusStyle[order.status] || statusStyle.PENDING;
                  return (
                    <div
                      key={order.id}
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        padding: "24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px"
                      }}
                    >
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
                        paddingBottom: "12px"
                      }}>
                        <div>
                          <span style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--text-muted)" }}>
                            #{order.id.slice(-8).toUpperCase()}
                          </span>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "12px" }}>
                            {relativeDate(order.createdAt)}
                          </span>
                        </div>
                        <span style={{
                          fontSize: "9px",
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          padding: "3px 8px",
                          color: st.color,
                          background: st.bg,
                          border: `1px solid ${st.color}20`
                        }}>
                          {st.label}
                        </span>
                      </div>

                      {/* Items */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {order.items.map((item) => (
                          <div key={item.id} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                            <div style={{
                              width: "48px",
                              aspectRatio: "3/4",
                              background: "var(--bg-elevated)",
                              overflow: "hidden"
                            }}>
                              {item.product?.images?.[0] && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <span style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff" }}>
                                {item.product?.name}
                              </span>
                              <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>
                                Taille : {item.size} · Qté : {item.quantity}
                              </div>
                            </div>
                            <span style={{ fontSize: "13px", fontWeight: 600 }}>
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid rgba(255, 255, 255, 0.03)",
                        paddingTop: "12px",
                        marginTop: "4px"
                      }}>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          Total de la commande
                        </span>
                        <span style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff" }}>
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>

      </main>
    </div>
  );
}
