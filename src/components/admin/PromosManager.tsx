"use client";
// src/components/admin/PromosManager.tsx
// Gestionnaire interactif des codes promos avec création de coupon via modal monochrome

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PromoData {
  id: string;
  code: string;
  type: string;
  value: number;
  maxUses: number | null;
  uses: number;
  active: boolean;
  expiresAt: Date | string | null;
  createdAt: Date | string;
}

interface Props {
  promos: PromoData[];
}

export default function PromosManager({ promos: initialPromos }: Props) {
  const router = useRouter();
  const [promos, setPromos] = useState<PromoData[]>(initialPromos);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [code, setCode] = useState("");
  const [type, setType] = useState("PERCENTAGE");
  const [value, setValue] = useState(10);
  const [maxUses, setMaxUses] = useState<number | "">("");
  const [expiresAt, setExpiresAt] = useState("");

  const handleToggleActive = async (id: string) => {
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/promos/${id}`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de mise à jour");

      // Update local state
      setPromos(
        promos.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
      );
      setSuccess("Le statut du coupon a été mis à jour !");
      router.refresh();
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      console.warn("API call failed, running local demo fallback:", err);
      // Fallback local change for demo mode
      setPromos(
        promos.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
      );
      setSuccess("Mode démo : Statut du coupon inversé avec succès.");
      setTimeout(() => setSuccess(null), 2000);
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return setError("Le code est requis");

    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      maxUses: maxUses === "" ? null : Number(maxUses),
      expiresAt: expiresAt || null,
    };

    try {
      const res = await fetch("/api/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Une erreur est survenue");

      setPromos([data.promo, ...promos]);
      setSuccess(`Le code promo ${data.promo.code} a été créé !`);
      setModalOpen(false);
      
      // Reset form
      setCode("");
      setType("PERCENTAGE");
      setValue(10);
      setMaxUses("");
      setExpiresAt("");

      router.refresh();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.warn("API creation failed, running demo fallback:", err);
      // Demo fallback
      const mockNewPromo: PromoData = {
        id: `mock-${Date.now()}`,
        code: payload.code,
        type: payload.type,
        value: payload.value,
        maxUses: payload.maxUses,
        uses: 0,
        active: true,
        expiresAt: payload.expiresAt,
        createdAt: new Date(),
      };
      setPromos([mockNewPromo, ...promos]);
      setSuccess(`Mode démo : Coupon ${mockNewPromo.code} créé temporairement.`);
      setModalOpen(false);
      setCode("");
      setTimeout(() => setSuccess(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Alert banners */}
      {error && (
        <div style={{ padding: "12px 16px", background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.2)", color: "#fb7185", fontSize: "13px", marginBottom: "16px" }}>
          ⚠ {error}
        </div>
      )}
      {success && (
        <div style={{ padding: "12px 16px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399", fontSize: "13px", marginBottom: "16px" }}>
          ✓ {success}
        </div>
      )}

      {/* Header buttons linked */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginBottom: "28px", marginTop: "-64px" }}>
        <button
          onClick={() => setModalOpen(true)}
          style={{ display: "inline-flex", alignItems: "center", padding: "0 16px", height: "36px", background: "#ffffff", color: "#000000", border: "none", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}
        >
          + Créer un coupon
        </button>
      </div>

      {/* Promos Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(255,255,255,0.02)" }}>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Code</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Type</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Valeur</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Utilisations</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Expiration</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Statut</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((promo) => {
              const maxUsesLabel = promo.maxUses ? `/ ${promo.maxUses}` : "∞";
              const expired = promo.expiresAt ? new Date(promo.expiresAt) < new Date() : false;
              const activeStatus = promo.active && !expired;

              return (
                <tr key={promo.id} style={{ borderBottom: "1px solid var(--border-subtle)", transition: "background 0.2s" }} className="hover:bg-white/[0.02]">
                  {/* Code */}
                  <td style={{ padding: "18px 24px", fontWeight: 700, letterSpacing: "0.05em", color: "var(--text-primary)" }}>
                    {promo.code}
                  </td>
                  {/* Type */}
                  <td style={{ padding: "18px 24px", color: "var(--text-secondary)" }}>
                    {promo.type === "PERCENTAGE" && "Pourcentage (%)"}
                    {promo.type === "FIXED" && "Montant Fixe"}
                    {promo.type === "FREE_SHIPPING" && "Livraison Gratuite"}
                  </td>
                  {/* Value */}
                  <td style={{ padding: "18px 24px", fontWeight: 600 }}>
                    {promo.type === "PERCENTAGE" && `-${promo.value}%`}
                    {promo.type === "FIXED" && `-${promo.value.toLocaleString()} FCFA`}
                    {promo.type === "FREE_SHIPPING" && "Offert"}
                  </td>
                  {/* Uses */}
                  <td style={{ padding: "18px 24px" }}>
                    <span style={{ fontWeight: 500 }}>{promo.uses}</span>
                    <span style={{ color: "var(--text-muted)", marginLeft: "4px" }}>{maxUsesLabel}</span>
                  </td>
                  {/* Expiration */}
                  <td style={{ padding: "18px 24px", color: expired ? "#fb7185" : "var(--text-secondary)" }}>
                    {promo.expiresAt ? (
                      new Date(promo.expiresAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>Illimité</span>
                    )}
                    {expired && <span style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", marginLeft: "6px", color: "#fb7185" }}>(Expiré)</span>}
                  </td>
                  {/* Status */}
                  <td style={{ padding: "18px 24px" }}>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "2px 8px",
                      background: activeStatus ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                      border: activeStatus ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.05)",
                      color: activeStatus ? "#ffffff" : "var(--text-muted)"
                    }}>
                      {activeStatus ? "Actif" : "Désactivé"}
                    </span>
                  </td>
                  {/* Actions */}
                  <td style={{ padding: "18px 24px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      <button
                        onClick={() => handleToggleActive(promo.id)}
                        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "11px" }}
                        className="hover:text-white"
                      >
                        {promo.active ? "Désactiver" : "Activer"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Creation Modal */}
      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-strong)", width: "100%", maxWidth: "480px", padding: "28px" }} className="animate-fade-up">
            
            {/* Modal Title */}
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-primary)", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between" }}>
              <span>Créer un Code Promo</span>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "16px" }}>×</button>
            </div>

            <form onSubmit={handleCreatePromo} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Code Promo (Majuscules)</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Ex: SPECIAL30"
                  style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "10px 14px", fontSize: "13px", outline: "none" }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Type de réduction</label>
                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setValue(e.target.value === "PERCENTAGE" ? 10 : e.target.value === "FIXED" ? 5000 : 0);
                  }}
                  style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "10px 14px", fontSize: "13px", outline: "none" }}
                >
                  <option value="PERCENTAGE" style={{ background: "#0c0d0e" }}>Pourcentage (%)</option>
                  <option value="FIXED" style={{ background: "#0c0d0e" }}>Montant Fixe (FCFA)</option>
                  <option value="FREE_SHIPPING" style={{ background: "#0c0d0e" }}>Livraison Gratuite</option>
                </select>
              </div>

              {type !== "FREE_SHIPPING" && (
                <div>
                  <label style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>
                    {type === "PERCENTAGE" ? "Valeur du coupon (%)" : "Montant (FCFA)"}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    min={1}
                    max={type === "PERCENTAGE" ? 100 : undefined}
                    style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "10px 14px", fontSize: "13px", outline: "none" }}
                    required
                  />
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Nombre Max d'utilisations</label>
                  <input
                    type="number"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Illimité"
                    min={1}
                    style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "10px 14px", fontSize: "13px", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Date d'expiration</label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "9px 14px", fontSize: "13px", outline: "none" }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px", borderTop: "1px solid var(--border-subtle)", paddingTop: "18px" }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ background: "transparent", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "8px 16px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ background: "#ffffff", color: "#000000", border: "none", padding: "8px 16px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {loading ? "Création..." : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
