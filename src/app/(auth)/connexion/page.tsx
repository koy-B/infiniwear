"use client";
// src/app/(auth)/connexion/page.tsx
// Page de connexion sécurisée InfiniWear

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// Validation email stricte
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/profil";
  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmailValid = EMAIL_REGEX.test(form.email);

  const handleBlur = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTouched({ email: true, password: true });

    if (!isEmailValid) {
      setError("Veuillez saisir une adresse email valide (ex: nom@domaine.com)");
      return;
    }

    if (!form.password) {
      setError("Veuillez saisir votre mot de passe");
      return;
    }

    setLoading(true);

    const result = await signIn("credentials", {
      email:    form.email.toLowerCase().trim(),
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  const handleGoogle = () => {
    signIn("google", { callbackUrl });
  };

  const emailInputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    background: "var(--bg-base)",
    border: `1px solid ${
      !touched.email
        ? "var(--border-subtle)"
        : isEmailValid
        ? "rgba(52,211,153,0.4)"
        : "rgba(251,113,133,0.4)"
    }`,
    color: "var(--text-primary)",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      {/* Background ∞ */}
      <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 0 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(200px, 40vw, 500px)", color: "rgba(0,102,255,0.03)", lineHeight: 1, userSelect: "none" }}>∞</span>
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "400px" }}>
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

        {/* Card */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", padding: "40px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, marginBottom: "8px", letterSpacing: "-0.01em" }}>
            Connexion
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "28px" }}>
            Bienvenue de retour dans l'univers InfiniWear
          </p>

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.2)", padding: "12px 16px", marginBottom: "20px", fontSize: "13px", color: "#fb7185" }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }} noValidate>
            {/* Email */}
            <div>
              <label className="iw-label">Email</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                onBlur={() => handleBlur("email")}
                placeholder="ton@email.com"
                style={emailInputStyle}
                disabled={loading}
                autoComplete="email"
                inputMode="email"
              />
              {/* Feedback email */}
              {touched.email && form.email && (
                <div style={{ fontSize: "11px", marginTop: "4px", color: isEmailValid ? "#34d399" : "#fb7185" }}>
                  {isEmailValid ? "✓ Email valide" : "✗ Format invalide — ex: nom@domaine.com"}
                </div>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label className="iw-label">Mot de passe</label>
              <input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                onBlur={() => handleBlur("password")}
                placeholder="••••••••"
                className="iw-input"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <button
              id="submit-login"
              type="submit"
              disabled={loading}
              className="iw-btn iw-btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: "8px", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Connexion en cours…" : "Se connecter"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
            <div className="iw-divider" />
            <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap", letterSpacing: "0.1em" }}>OU</span>
            <div className="iw-divider" />
          </div>

          {/* Google */}
          <button
            id="google-login"
            type="button"
            onClick={handleGoogle}
            className="iw-btn iw-btn-outline"
            style={{ width: "100%", justifyContent: "center", gap: "10px" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>

          {/* Links */}
          <div style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "var(--text-muted)" }}>
            Pas encore de compte ?{" "}
            <Link href="/inscription" style={{ color: "var(--accent-blue)", textDecoration: "none", fontWeight: 500 }}>
              S'inscrire
            </Link>
          </div>
        </div>

        {/* Back to site */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link href="/" style={{ fontSize: "11px", color: "var(--text-muted)", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "14px" }}>
        Chargement...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
