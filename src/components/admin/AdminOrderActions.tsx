"use client";
// src/components/admin/AdminOrderActions.tsx
// Boutons d'action pour changer le statut d'une commande

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  orderId: string;
  currentStatus: string;
}

const actions: Record<string, Array<{ label: string; status: string; variant: "primary" | "ghost" | "danger" }>> = {
  PENDING: [
    { label: "Confirmer", status: "CONFIRMED", variant: "primary" },
    { label: "Annuler",   status: "CANCELLED", variant: "danger" },
  ],
  CONFIRMED: [
    { label: "Livrer",  status: "DELIVERED", variant: "primary" },
    { label: "Annuler", status: "CANCELLED", variant: "danger" },
  ],
  DELIVERED: [],
  CANCELLED: [],
};

const variants = {
  primary: { background: "var(--accent-blue)", color: "#fff", border: "none" },
  ghost:   { background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border-normal)" },
  danger:  { background: "rgba(251,113,133,0.1)", color: "#fb7185", border: "1px solid rgba(251,113,133,0.2)" },
};

export default function AdminOrderActions({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const available = actions[currentStatus] || [];

  if (available.length === 0) {
    return (
      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>—</span>
    );
  }

  const handleAction = async (status: string) => {
    setLoading(status);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Erreur");
        return;
      }
      router.refresh();
    } catch {
      alert("Erreur réseau");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ display: "flex", gap: "6px" }}>
      {available.map((action) => (
        <button
          key={action.status}
          onClick={() => handleAction(action.status)}
          disabled={loading !== null}
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0 10px",
            height: "28px",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            opacity: loading !== null ? 0.6 : 1,
            whiteSpace: "nowrap",
            ...variants[action.variant],
          }}
        >
          {loading === action.status ? "…" : action.label}
        </button>
      ))}
    </div>
  );
}
