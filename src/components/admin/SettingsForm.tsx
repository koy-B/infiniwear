"use client";
// src/components/admin/SettingsForm.tsx
// Formulaire d'édition des paramètres réactif, responsive et monochrome

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ConfigData {
  whatsappNumber: string;
  appName: string;
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  savoirFaireImage: string;
  savoirFaireTitle: string;
  savoirFaireDesc: string;
}

interface Props {
  config: ConfigData;
}

export default function SettingsForm({ config }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingSavoir, setUploadingSavoir] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // States
  const [appName, setAppName] = useState(config.appName);
  const [whatsappNumber, setWhatsappNumber] = useState(config.whatsappNumber);
  const [heroImage, setHeroImage] = useState(config.heroImage);
  const [heroTitle, setHeroTitle] = useState(config.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(config.heroSubtitle);
  const [savoirFaireImage, setSavoirFaireImage] = useState(config.savoirFaireImage);
  const [savoirFaireTitle, setSavoirFaireTitle] = useState(config.savoirFaireTitle);
  const [savoirFaireDesc, setSavoirFaireDesc] = useState(config.savoirFaireDesc);

  const handleImageUpload = async (file: File, type: "hero" | "savoir") => {
    if (type === "hero") setUploadingHero(true);
    else setUploadingSavoir(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "L'upload a échoué");
      }

      if (type === "hero") setHeroImage(data.url);
      else setSavoirFaireImage(data.url);
    } catch (err: any) {
      console.warn("Upload failed, falling back to local Base64:", err);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          if (type === "hero") setHeroImage(reader.result);
          else setSavoirFaireImage(reader.result);
          setError("Note: Image chargée en local (mode démo - Base64) car Cloudinary n'est pas configuré.");
        }
      };
      reader.readAsDataURL(file);
    } finally {
      if (type === "hero") setUploadingHero(false);
      else setUploadingSavoir(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const payload: ConfigData = {
      appName,
      whatsappNumber,
      heroImage,
      heroTitle,
      heroSubtitle,
      savoirFaireImage,
      savoirFaireTitle,
      savoirFaireDesc,
    };

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Échec de l'enregistrement");
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Save settings error:", err);
      setError(err.message || "Erreur de communication avec le serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Alert Banners */}
      {error && (
        <div style={{ padding: "12px 16px", background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.2)", color: "#fb7185", fontSize: "13px" }}>
          ⚠ {error}
        </div>
      )}
      {success && (
        <div style={{ padding: "12px 16px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399", fontSize: "13px" }}>
          ✓ Paramètres enregistrés avec succès !
        </div>
      )}

      {/* Grid configuration settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column - General & Brand Settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Brand details card */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", padding: "24px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-primary)", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid var(--border-subtle)" }}>
              Informations Générales de la Boutique
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>
                  Nom de la marque
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "10px 14px", fontSize: "13px", outline: "none" }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>
                  Numéro WhatsApp Ventes
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="Ex: +22507000000"
                  style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "10px 14px", fontSize: "13px", outline: "none" }}
                  required
                />
                <span style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                  Le numéro de téléphone WhatsApp de l'administrateur pour recevoir les commandes.
                </span>
              </div>
            </div>
          </div>

          {/* Hero Section Config Card */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", padding: "24px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-primary)", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid var(--border-subtle)" }}>
              Bannière d'Accueil (Section Hero)
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>
                  Surtitre Hero
                </label>
                <input
                  type="text"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "10px 14px", fontSize: "13px", outline: "none" }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>
                  Titre Hero (utilisez \n pour sauter une ligne)
                </label>
                <textarea
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  rows={2}
                  style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "10px 14px", fontSize: "13px", outline: "none", resize: "none" }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>
                  Image de couverture Hero
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {/* Uploader */}
                  <div 
                    style={{
                      border: "1px dashed var(--border-strong)",
                      background: "var(--bg-elevated)",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer"
                    }}
                    onClick={() => document.getElementById("hero-file-input")?.click()}
                  >
                    <input
                      type="file"
                      id="hero-file-input"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, "hero");
                      }}
                      style={{ display: "none" }}
                    />
                    {uploadingHero ? (
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Téléchargement...</span>
                    ) : (
                      <div>
                        <div style={{ fontSize: "18px", marginBottom: "4px" }}>⤓</div>
                        <span style={{ fontSize: "11px", fontWeight: 600 }}>Remplacer l'image Hero</span>
                      </div>
                    )}
                  </div>
                  
                  {/* URL Text Input */}
                  <input
                    type="text"
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "8px 12px", fontSize: "11px", outline: "none" }}
                    required
                  />

                  {/* Preview */}
                  {heroImage && (
                    <div style={{ width: "100%", height: "160px", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={heroImage} alt="Hero preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Savoir-Faire Config Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", padding: "24px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-primary)", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid var(--border-subtle)" }}>
              Section Éditoriale (Savoir-Faire)
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>
                  Titre Savoir-Faire
                </label>
                <input
                  type="text"
                  value={savoirFaireTitle}
                  onChange={(e) => setSavoirFaireTitle(e.target.value)}
                  style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "10px 14px", fontSize: "13px", outline: "none" }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>
                  Description Savoir-Faire
                </label>
                <textarea
                  value={savoirFaireDesc}
                  onChange={(e) => setSavoirFaireDesc(e.target.value)}
                  rows={4}
                  style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "10px 14px", fontSize: "13px", outline: "none", resize: "vertical" }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>
                  Image Savoir-Faire
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {/* Uploader */}
                  <div 
                    style={{
                      border: "1px dashed var(--border-strong)",
                      background: "var(--bg-elevated)",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer"
                    }}
                    onClick={() => document.getElementById("savoir-file-input")?.click()}
                  >
                    <input
                      type="file"
                      id="savoir-file-input"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, "savoir");
                      }}
                      style={{ display: "none" }}
                    />
                    {uploadingSavoir ? (
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Téléchargement...</span>
                    ) : (
                      <div>
                        <div style={{ fontSize: "18px", marginBottom: "4px" }}>⤓</div>
                        <span style={{ fontSize: "11px", fontWeight: 600 }}>Remplacer l'image Savoir-Faire</span>
                      </div>
                    )}
                  </div>
                  
                  {/* URL Text Input */}
                  <input
                    type="text"
                    value={savoirFaireImage}
                    onChange={(e) => setSavoirFaireImage(e.target.value)}
                    style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", padding: "8px 12px", fontSize: "11px", outline: "none" }}
                    required
                  />

                  {/* Preview */}
                  {savoirFaireImage && (
                    <div style={{ width: "100%", height: "160px", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={savoirFaireImage} alt="Savoir preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={loading || uploadingHero || uploadingSavoir}
          className="w-full sm:w-auto text-center"
          style={{ background: "#ffffff", color: "#000000", border: "none", padding: "12px 28px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", cursor: (loading || uploadingHero || uploadingSavoir) ? "not-allowed" : "pointer", opacity: (loading || uploadingHero || uploadingSavoir) ? 0.7 : 1 }}
        >
          {loading ? "Enregistrement..." : "Enregistrer les paramètres"}
        </button>
      </div>

    </form>
  );
}
