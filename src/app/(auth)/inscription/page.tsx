"use client";
// src/app/(auth)/inscription/page.tsx
// Page d'inscription InfiniWear — avec validation sécurisée

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

// Validation email stricte (RFC 5322 simplifié)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: "Très faible", color: "#ef4444" };
  if (score === 2) return { score, label: "Faible", color: "#f97316" };
  if (score === 3) return { score, label: "Moyen", color: "#eab308" };
  if (score === 4) return { score, label: "Fort", color: "#22c55e" };
  return { score, label: "Très fort", color: "#34d399" };
}

export default function InscriptionPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", pseudo: "", name: "", password: "", confirm: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [accepted, setAccepted] = useState(false);
  const [acceptedError, setAcceptedError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Validation en temps réel
  const isEmailValid = EMAIL_REGEX.test(form.email);
  const isEmailTouched = touched.email;
  const passwordStrength = getPasswordStrength(form.password);
  const passwordsMatch = form.confirm === form.password && form.confirm !== "";
  const isPseudoValid = /^[a-zA-Z0-9_]{3,20}$/.test(form.pseudo);

  const handleBlur = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTouched({ email: true, pseudo: true, name: true, password: true, confirm: true });

    if (!accepted) {
      setAcceptedError(true);
      setError("Vous devez accepter les conditions d'utilisation et la politique de confidentialité pour créer un compte.");
      return;
    }
    setAcceptedError(false);

    // Validations côté client
    if (!isEmailValid) {
      setError("Veuillez saisir une adresse email valide (ex: nom@domaine.com)");
      return;
    }
    if (!isPseudoValid) {
      setError("Le pseudo doit contenir entre 3 et 20 caractères (lettres, chiffres, _)");
      return;
    }
    if (form.password.length < 8) {
      setError("Le mot de passe doit contenir au minimum 8 caractères");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        email:    form.email.toLowerCase().trim(),
        pseudo:   form.pseudo,
        name:     form.name,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erreur lors de l'inscription");
      setLoading(false);
      return;
    }

    // Connexion automatique après inscription
    await signIn("credentials", {
      email:    form.email.toLowerCase().trim(),
      password: form.password,
      redirect: false,
    });

    setSuccess(true);
    setTimeout(() => router.push("/profil"), 1500);
  };

  const inputStyle = (field: string, extraValid?: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "10px 14px",
    background: "var(--bg-base)",
    border: `1px solid ${
      !touched[field]
        ? "var(--border-subtle)"
        : (extraValid ?? true)
        ? "rgba(52,211,153,0.4)"
        : "rgba(251,113,133,0.4)"
    }`,
    color: "var(--text-primary)",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      {/* Background ∞ */}
      <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 0 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(200px, 40vw, 500px)", color: "rgba(0,102,255,0.03)", lineHeight: 1, userSelect: "none" }}>∞</span>
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "440px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-primary)" }}>
              INFINI<span style={{ color: "var(--accent-blue)" }}>WEAR</span>
            </div>
            <div style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "4px" }}>
              No Limit Just Style
            </div>
          </Link>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", padding: "40px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>
            Créer un compte
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "28px" }}>
            Rejoins l'univers InfiniWear
          </p>

          {/* Success */}
          {success && (
            <div style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", padding: "12px 16px", marginBottom: "20px", fontSize: "13px", color: "#34d399" }}>
              ✓ Compte créé avec succès ! Redirection…
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.2)", padding: "12px 16px", marginBottom: "20px", fontSize: "13px", color: "#fb7185" }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }} noValidate>
            {/* Prénom + Pseudo */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label className="iw-label">Prénom</label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  onBlur={() => handleBlur("name")}
                  placeholder="Konan"
                  className="iw-input"
                  disabled={loading}
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="iw-label">Pseudo *</label>
                <input
                  id="pseudo"
                  type="text"
                  required
                  value={form.pseudo}
                  onChange={(e) => setForm((f) => ({ ...f, pseudo: e.target.value.replace(/[^a-zA-Z0-9_]/g, "") }))}
                  onBlur={() => handleBlur("pseudo")}
                  placeholder="konand"
                  style={inputStyle("pseudo", isPseudoValid || !form.pseudo)}
                  disabled={loading}
                  autoComplete="username"
                  maxLength={20}
                />
                {touched.pseudo && form.pseudo && !isPseudoValid && (
                  <div style={{ fontSize: "11px", color: "#fb7185", marginTop: "4px" }}>3-20 caractères : lettres, chiffres, _</div>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="iw-label">Email *</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                onBlur={() => handleBlur("email")}
                placeholder="ton@email.com"
                style={inputStyle("email", isEmailValid || !form.email)}
                disabled={loading}
                autoComplete="email"
                inputMode="email"
              />
              {/* Feedback email */}
              {isEmailTouched && form.email && (
                <div style={{ fontSize: "11px", marginTop: "4px", color: isEmailValid ? "#34d399" : "#fb7185" }}>
                  {isEmailValid ? "✓ Email valide" : "✗ Format invalide — ex: nom@domaine.com"}
                </div>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label className="iw-label">Mot de passe *</label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                onBlur={() => handleBlur("password")}
                placeholder="Minimum 8 caractères"
                className="iw-input"
                disabled={loading}
                autoComplete="new-password"
              />
              {/* Indicateur de force */}
              {form.password && (
                <div style={{ marginTop: "6px" }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} style={{
                        flex: 1,
                        height: "3px",
                        background: i <= passwordStrength.score ? passwordStrength.color : "var(--border-subtle)",
                        transition: "background 0.3s",
                        borderRadius: "2px",
                      }} />
                    ))}
                  </div>
                  <div style={{ fontSize: "11px", color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </div>
                </div>
              )}
            </div>

            {/* Confirmer mot de passe */}
            <div>
              <label className="iw-label">Confirmer le mot de passe *</label>
              <input
                id="confirm-password"
                type="password"
                required
                value={form.confirm}
                onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                onBlur={() => handleBlur("confirm")}
                placeholder="••••••••"
                style={inputStyle("confirm", passwordsMatch || !form.confirm)}
                disabled={loading}
                autoComplete="new-password"
              />
              {touched.confirm && form.confirm && (
                <div style={{ fontSize: "11px", marginTop: "4px", color: passwordsMatch ? "#34d399" : "#fb7185" }}>
                  {passwordsMatch ? "✓ Les mots de passe correspondent" : "✗ Les mots de passe ne correspondent pas"}
                </div>
              )}
            </div>

            {/* Case à cocher — Conditions obligatoires */}
            <div style={{
              padding: "14px 16px",
              background: acceptedError ? "rgba(251,113,133,0.05)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${acceptedError ? "rgba(251,113,133,0.3)" : "rgba(255,255,255,0.06)"}`,
              transition: "all 0.2s",
            }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                <input
                  id="accept-terms"
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => {
                    setAccepted(e.target.checked);
                    if (e.target.checked) {
                      setAcceptedError(false);
                      setError(null);
                    }
                  }}
                  style={{
                    width: "16px",
                    height: "16px",
                    marginTop: "2px",
                    flexShrink: 0,
                    accentColor: "#f5f5f5",
                    cursor: "pointer",
                  }}
                />
                <span style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  J'ai lu et j'accepte les{" "}
                  <a
                    href="/conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--text-primary)", textDecoration: "underline", textUnderlineOffset: "3px" }}
                  >
                    Conditions Générales d'Utilisation
                  </a>
                  {" "}et la{" "}
                  <a
                    href="/confidentialite"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--text-primary)", textDecoration: "underline", textUnderlineOffset: "3px" }}
                  >
                    Politique de Confidentialité
                  </a>
                  {" "}d'InfiniWear. <span style={{ color: "#fb7185" }}>*</span>
                </span>
              </label>
              {acceptedError && (
                <div style={{ fontSize: "11px", color: "#fb7185", marginTop: "8px", marginLeft: "28px" }}>
                  ✗ Vous devez accepter les conditions pour continuer.
                </div>
              )}
            </div>

            <button
              id="submit-register"
              type="submit"
              disabled={loading || success}
              className="iw-btn iw-btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: "4px", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Création en cours…" : "Créer mon compte"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
            <div className="iw-divider" />
            <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap", letterSpacing: "0.1em" }}>OU</span>
            <div className="iw-divider" />
          </div>

          <button
            id="google-register"
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/profil" })}
            className="iw-btn iw-btn-outline"
            style={{ width: "100%", justifyContent: "center", gap: "10px" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            S'inscrire avec Google
          </button>

          <div style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "var(--text-muted)" }}>
            Déjà un compte ?{" "}
            <Link href="/connexion" style={{ color: "var(--accent-blue)", textDecoration: "none", fontWeight: 500 }}>
              Se connecter
            </Link>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link href="/" style={{ fontSize: "11px", color: "var(--text-muted)", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}
