// src/app/admin/parametres/page.tsx
// Page de configuration générale du site — Style Monochrome

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import SettingsForm from "@/components/admin/SettingsForm";

async function getConfig() {
  try {
    const configPath = path.join(process.cwd(), "src", "lib", "homeConfig.json");
    const data = await fs.promises.readFile(configPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.warn("Failed to load settings config from file, using defaults:", error);
    return {
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+22507000000",
      appName: process.env.NEXT_PUBLIC_APP_NAME || "InfiniWear",
      heroImage: "/images/normale/ChatGPT Image 14 juin 2026, 20_26_45.png",
      heroTitle: "SILENCE\nARCHITECTURAL",
      heroSubtitle: "∞ L'Édition Permanente",
      savoirFaireImage: "/images/feminine/IMG_3409.JPG.jpeg",
      savoirFaireTitle: "L'ART DE LA\nMATIÈRE",
      savoirFaireDesc: "Chaque création InfiniWear est pensée comme une oeuvre architecturale. Nous développons nos coupes avec une attention obsessionnelle aux structures et aux matières haut de grammage."
    };
  }
}

export default async function SettingsAdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/connexion?callbackUrl=/admin/parametres");
  }

  if (session.user.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const config = await getConfig();

  return (
    <div style={{ padding: "var(--admin-page-padding)" }} className="animate-fade-up">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
            CONFIGURATION DE LA BOUTIQUE
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Configurez les détails du site internet, les photos de la page d'accueil et les redirections WhatsApp.
          </div>
        </div>
        <Link href="/admin" style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffffff", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
          ← Retour dashboard
        </Link>
      </div>

      {/* Settings Form component wrapper */}
      <SettingsForm config={config} />
    </div>
  );
}
