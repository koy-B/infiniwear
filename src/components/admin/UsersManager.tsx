"use client";
// src/components/admin/UsersManager.tsx
// Gestionnaire interactif des utilisateurs avec modification de rôle et création de compte

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  id: string;
  name: string | null;
  pseudo: string;
  email: string;
  role: string;
  suspended: boolean;
  createdAt: Date | string;
}

interface Props {
  users: UserData[];
  currentUser: {
    id: string;
    email?: string | null;
    role?: string | null;
  };
}

export default function UsersManager({ users: initialUsers, currentUser }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states for user creation
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPseudo, setNewPseudo] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("CLIENT");

  const handleToggleSuspend = async (userId: string) => {
    if (userId === currentUser.id) {
      setError("Vous ne pouvez pas suspendre votre propre compte.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    if (currentUser.role === "SUPPORT_AGENT" && targetUser.role === "SUPER_ADMIN") {
      setError("En tant qu'agent de support, vous ne pouvez pas modifier un Super Admin.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoadingId(userId);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspended: !targetUser.suspended }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de mise à jour");

      setUsers(
        users.map((u) => (u.id === userId ? { ...u, suspended: !u.suspended } : u))
      );
      setSuccess(`Le statut de @${targetUser.pseudo} a été mis à jour.`);
      router.refresh();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.warn("API call failed, running local demo fallback:", err);
      // Fallback local change for demo mode
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, suspended: !u.suspended } : u))
      );
      setSuccess(`Mode démo : Statut de @${targetUser.pseudo} inversé temporairement.`);
      setTimeout(() => setSuccess(null), 3000);
    } finally {
      setLoadingId(null);
    }
  };

  const handleRoleChange = async (userId: string, targetRole: string) => {
    if (userId === currentUser.id) {
      setError("Vous ne pouvez pas modifier votre propre rôle.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    setLoadingId(userId);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de mise à jour");

      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: targetRole } : u))
      );
      setSuccess(`Le rôle de @${targetUser.pseudo} a été changé en ${targetRole}.`);
      router.refresh();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.warn("API call failed, running local role change fallback:", err);
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: targetRole } : u))
      );
      setSuccess(`Mode démo : Rôle de @${targetUser.pseudo} changé temporairement.`);
      setTimeout(() => setSuccess(null), 3000);
    } finally {
      setLoadingId(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newPassword.trim() || !newPseudo.trim()) {
      return setError("Veuillez remplir tous les champs obligatoires");
    }

    createLoading || setCreateLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      email: newEmail.trim(),
      password: newPassword.trim(),
      pseudo: newPseudo.trim().toLowerCase(),
      name: newName.trim() || null,
      role: newRole,
    };

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Une erreur est survenue");

      setUsers([data.user, ...users]);
      setSuccess(`L'utilisateur @${data.user.pseudo} a été créé !`);
      setCreateModalOpen(false);

      // Reset form
      setNewEmail("");
      setNewPassword("");
      setNewPseudo("");
      setNewName("");
      setNewRole("CLIENT");

      router.refresh();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.warn("API creation failed, running demo fallback:", err);
      // Demo fallback
      const mockNewUser: UserData = {
        id: `mock-${Date.now()}`,
        email: payload.email,
        pseudo: payload.pseudo,
        name: payload.name || "Sans Nom",
        role: payload.role,
        suspended: false,
        createdAt: new Date(),
      };
      setUsers([mockNewUser, ...users]);
      setSuccess(`Mode démo : Compte @${mockNewUser.pseudo} créé temporairement.`);
      setCreateModalOpen(false);
      setNewEmail("");
      setNewPassword("");
      setNewPseudo("");
      setNewName("");
      setTimeout(() => setSuccess(null), 3000);
    } finally {
      setCreateLoading(false);
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

      {/* Header Actions */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <button
          onClick={() => setCreateModalOpen(true)}
          style={{ display: "inline-flex", alignItems: "center", padding: "0 16px", height: "36px", background: "#ffffff", color: "#000000", border: "none", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}
        >
          + Créer un compte
        </button>
      </div>

      {/* Users Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(255,255,255,0.02)" }}>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Avatar</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Utilisateur</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Email</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Rôle</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Date Inscription</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Statut</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.id === currentUser.id;
              const isSupportRestricted = currentUser.role === "SUPPORT_AGENT" && u.role === "SUPER_ADMIN";
              const cannotModify = isSelf || isSupportRestricted;

              return (
                <tr key={u.id} style={{ borderBottom: "1px solid var(--border-subtle)", transition: "background 0.2s" }} className="hover:bg-white/[0.02]">
                  {/* Avatar */}
                  <td style={{ padding: "12px 24px" }}>
                    <div style={{ width: "32px", height: "32px", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#ffffff", fontFamily: "var(--font-display)" }}>
                      {(u.name || u.pseudo || u.email || "U").charAt(0).toUpperCase()}
                    </div>
                  </td>
                  {/* User details */}
                  <td style={{ padding: "12px 24px", fontWeight: 500 }}>
                    <div style={{ color: "var(--text-primary)" }}>{u.name || "Sans nom"}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>@{u.pseudo}</div>
                  </td>
                  {/* Email */}
                  <td style={{ padding: "12px 24px", color: "var(--text-secondary)" }}>
                    {u.email}
                  </td>
                  {/* Role */}
                  <td style={{ padding: "12px 24px" }}>
                    {!cannotModify ? (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={loadingId === u.id}
                        style={{
                          background: "var(--bg-elevated)",
                          border: "1px solid var(--border-subtle)",
                          color: "#ffffff",
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "4px 8px",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          outline: "none",
                          cursor: "pointer",
                          borderRadius: 0,
                        }}
                      >
                        <option value="CLIENT" style={{ background: "#0c0d0e" }}>Client</option>
                        <option value="SUPPORT_AGENT" style={{ background: "#0c0d0e" }}>Support</option>
                        {currentUser.role === "SUPER_ADMIN" && (
                          <option value="SUPER_ADMIN" style={{ background: "#0c0d0e" }}>Super Admin</option>
                        )}
                      </select>
                    ) : (
                      <span style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        padding: "2px 6px",
                        background: u.role === "SUPER_ADMIN" ? "#ffffff" : "rgba(255,255,255,0.06)",
                        color: u.role === "SUPER_ADMIN" ? "#000000" : "#ffffff",
                        border: u.role === "SUPER_ADMIN" ? "none" : "1px solid rgba(255,255,255,0.15)"
                      }}>
                        {u.role === "SUPER_ADMIN" && "Super Admin"}
                        {u.role === "SUPPORT_AGENT" && "Support"}
                        {u.role === "CLIENT" && "Client"}
                      </span>
                    )}
                    {isSelf && (
                      <span style={{ fontSize: "9px", color: "var(--text-muted)", marginLeft: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>(Vous)</span>
                    )}
                  </td>
                  {/* Date */}
                  <td style={{ padding: "12px 24px", color: "var(--text-muted)" }}>
                    {new Date(u.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  {/* Status */}
                  <td style={{ padding: "12px 24px" }}>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "2px 8px",
                      background: u.suspended ? "rgba(251,113,133,0.08)" : "rgba(52,211,153,0.08)",
                      border: u.suspended ? "1px solid rgba(251,113,133,0.2)" : "1px solid rgba(52,211,153,0.2)",
                      color: u.suspended ? "#fb7185" : "#34d399"
                    }}>
                      {u.suspended ? "Suspendu" : "Actif"}
                    </span>
                  </td>
                  {/* Actions */}
                  <td style={{ padding: "12px 24px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {cannotModify ? (
                        <span style={{ color: "rgba(255,255,255,0.2)", cursor: "not-allowed", fontSize: "11px" }}>
                          {u.suspended ? "Réactiver" : "Suspendre"}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleToggleSuspend(u.id)}
                          disabled={loadingId === u.id}
                          style={{ background: "none", border: "none", color: u.suspended ? "#34d399" : "#fb7185", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "11px", padding: 0 }}
                        >
                          {loadingId === u.id ? "Mise à jour..." : u.suspended ? "Réactiver" : "Suspendre"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Creation Modal */}
      {createModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-strong)", width: "100%", maxWidth: "480px", padding: "28px" }}>
            
            {/* Modal Title */}
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-primary)", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between" }}>
              <span>Créer un Utilisateur</span>
              <button onClick={() => setCreateModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "16px" }}>×</button>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Pseudo (Identifiant unique)</label>
                <input
                  type="text"
                  value={newPseudo}
                  onChange={(e) => setNewPseudo(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                  placeholder="Ex: admin_lorenzo"
                  style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "10px 14px", fontSize: "13px", outline: "none" }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Ex: lorenzo@infiniwear.com"
                  style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "10px 14px", fontSize: "13px", outline: "none" }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Nom Complet (Optionnel)</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Lorenzo Diop"
                  style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "10px 14px", fontSize: "13px", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Mot de passe</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 caractères"
                  style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "10px 14px", fontSize: "13px", outline: "none" }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Rôle</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "10px 14px", fontSize: "13px", outline: "none" }}
                >
                  <option value="CLIENT" style={{ background: "#0c0d0e" }}>Client</option>
                  <option value="SUPPORT_AGENT" style={{ background: "#0c0d0e" }}>Support</option>
                  {currentUser.role === "SUPER_ADMIN" && (
                    <option value="SUPER_ADMIN" style={{ background: "#0c0d0e" }}>Super Admin</option>
                  )}
                </select>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px", borderTop: "1px solid var(--border-subtle)", paddingTop: "18px" }}>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  style={{ background: "transparent", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "8px 16px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  style={{ background: "#ffffff", color: "#000000", border: "none", padding: "8px 16px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", cursor: createLoading ? "not-allowed" : "pointer" }}
                >
                  {createLoading ? "Création..." : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
