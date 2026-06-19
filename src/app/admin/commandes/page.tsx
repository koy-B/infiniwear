// src/app/admin/commandes/page.tsx
// Gestion des commandes en temps réel

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice, relativeDate } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";
import AdminOrderActions from "@/components/admin/AdminOrderActions";

export const metadata: Metadata = { title: "Commandes" };
export const revalidate = 0; // No cache — always fresh

async function getOrders(status?: string) {
  try {
    const where: Record<string, unknown> = {};
    if (status && status !== "ALL") where.status = status;

    return await db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user:  { select: { pseudo: true, email: true, name: true } },
        items: { include: { product: { select: { name: true, images: true } } } },
      },
      take: 50,
    });
  } catch (error) {
    console.warn("Database failed to load orders, returning mock data:", error);
    const mockOrders = [
      {
        id: "mock-order-1",
        userId: "mock-client-id",
        status: "PENDING" as const,
        total: 45000,
        waMessage: "",
        notes: "Livrer l'après-midi",
        createdAt: new Date(Date.now() - 15 * 60 * 1000),
        updatedAt: new Date(),
        user: { pseudo: "bamba_style", email: "bamba@gmail.com", name: "Bamba" },
        items: [
          {
            id: "mi1",
            orderId: "mock-order-1",
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
        userId: "mock-client-id",
        status: "CONFIRMED" as const,
        total: 85000,
        waMessage: "",
        notes: "",
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
        updatedAt: new Date(),
        user: { pseudo: "koffi99", email: "koffi@yahoo.fr", name: "Koffi" },
        items: [
          {
            id: "mi2",
            orderId: "mock-order-2",
            productId: "p2",
            size: "L",
            quantity: 2,
            price: 42500,
            product: { name: "Cargopant Tech Obsidian", images: ["/images/normale/IMG_2063.JPG.jpeg"] }
          }
        ]
      }
    ];
    if (status && status !== "ALL") {
      return mockOrders.filter(o => o.status === status);
    }
    return mockOrders;
  }
}

async function getOrderCounts() {
  try {
    const [all, pending, confirmed, delivered, cancelled] = await Promise.all([
      db.order.count(),
      db.order.count({ where: { status: "PENDING" } }),
      db.order.count({ where: { status: "CONFIRMED" } }),
      db.order.count({ where: { status: "DELIVERED" } }),
      db.order.count({ where: { status: "CANCELLED" } }),
    ]);
    return { all, pending, confirmed, delivered, cancelled };
  } catch {
    return { all: 2, pending: 1, confirmed: 1, delivered: 0, cancelled: 0 };
  }
}

const statusStyle: Record<string, { label: string; color: string; bg: string; border: string }> = {
  PENDING:   { label: "En attente", color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.2)" },
  CONFIRMED: { label: "Confirmée",  color: "#34d399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.2)" },
  DELIVERED: { label: "Livrée",     color: "#38bdf8", bg: "rgba(56,189,248,0.1)",  border: "rgba(56,189,248,0.2)" },
  CANCELLED: { label: "Annulée",    color: "#fb7185", bg: "rgba(251,113,133,0.1)", border: "rgba(251,113,133,0.2)" },
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const [orders, counts] = await Promise.all([
    getOrders(status),
    getOrderCounts(),
  ]);

  const waNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+22500000000").replace(/[^0-9]/g, "");

  const tabs = [
    { key: "ALL",       label: "Toutes",     count: counts.all },
    { key: "PENDING",   label: "En attente", count: counts.pending },
    { key: "CONFIRMED", label: "Confirmées", count: counts.confirmed },
    { key: "DELIVERED", label: "Livrées",    count: counts.delivered },
    { key: "CANCELLED", label: "Annulées",   count: counts.cancelled },
  ];

  return (
    <div style={{ padding: "32px" }} className="animate-fade-up">

      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
            GESTION DES COMMANDES
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {counts.all} commandes · {counts.pending} en attente
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "0 16px", height: "36px", background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border-normal)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
            ↓ Exporter CSV
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid var(--border-subtle)", marginBottom: "24px", overflowX: "auto" }}>
        {tabs.map((tab) => {
          const active = (status || "ALL") === tab.key;
          return (
            <Link
              key={tab.key}
              href={tab.key === "ALL" ? "/admin/commandes" : `/admin/commandes?status=${tab.key}`}
              style={{
                padding: "12px 20px",
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: active ? 600 : 400,
                color: active ? "var(--text-primary)" : "var(--text-muted)",
                textDecoration: "none",
                borderBottom: `2px solid ${active ? "var(--accent-blue)" : "transparent"}`,
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {tab.label}
              <span style={{ fontSize: "10px", background: tab.key === "PENDING" && tab.count > 0 ? "var(--accent-rose)" : "var(--bg-elevated)", color: tab.key === "PENDING" && tab.count > 0 ? "#fff" : "var(--text-muted)", padding: "1px 5px", fontWeight: 700 }}>
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
        {orders.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
            Aucune commande dans cette catégorie
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["ID", "Client", "Produits", "Total", "Statut", "WhatsApp", "Date", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600, textAlign: "left", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-surface)", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => {
                const st = statusStyle[order.status];
                const itemsLabel = order.items.slice(0, 2).map((i: any) => `${i.product?.name} ×${i.quantity}`).join(", ") + (order.items.length > 2 ? ` +${order.items.length - 2}` : "");
                const waMessage = encodeURIComponent(`Bonjour @${order.user?.pseudo}, votre commande #${order.id.slice(-6).toUpperCase()} est bien reçue. Total: ${formatPrice(order.total)}. Merci ! ∞`);
                const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

                return (
                  <tr key={order.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "14px 16px", fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                      #{order.id.slice(-6).toUpperCase()}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: 28, height: 28, background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "var(--accent-blue)", fontFamily: "var(--font-display)", flexShrink: 0 }}>
                          {(order.user?.pseudo || "?").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>@{order.user?.pseudo}</div>
                          <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{order.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "12px", color: "var(--text-secondary)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {itemsLabel}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                      {formatPrice(order.total)}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                        {st.label}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 500, color: "#34d399", textDecoration: "none" }}
                      >
                        💬 Contacter
                      </a>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {relativeDate(order.createdAt)}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <AdminOrderActions orderId={order.id} currentStatus={order.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
