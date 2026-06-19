// src/app/confidentialite/page.tsx
// Politique de Confidentialité — InfiniWear

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | InfiniWear",
  description: "Comment InfiniWear collecte, utilise et protège vos données personnelles.",
};

export default function ConfidentialitePage() {
  const lastUpdate = "18 juin 2026";

  const sectionStyle: React.CSSProperties = {
    marginBottom: "40px",
  };

  const h2Style: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#f5f5f5",
    marginBottom: "14px",
    paddingBottom: "8px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  };

  const pStyle: React.CSSProperties = {
    fontSize: "14px",
    lineHeight: 1.85,
    color: "#9ca3af",
    marginBottom: "12px",
  };

  const liStyle: React.CSSProperties = {
    fontSize: "14px",
    lineHeight: 1.85,
    color: "#9ca3af",
    marginBottom: "8px",
    paddingLeft: "12px",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
    marginBottom: "20px",
  };

  const thStyle: React.CSSProperties = {
    padding: "10px 16px",
    background: "rgba(255,255,255,0.03)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    textAlign: "left",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#6b7280",
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    color: "#9ca3af",
    verticalAlign: "top",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#08090a", color: "#f5f5f5" }}>

      {/* Header barre */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: "#08090a",
        zIndex: 50,
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 700, letterSpacing: "0.12em", color: "#f5f5f5" }}>
            INFINI<span style={{ color: "#e5e5e5" }}>WEAR</span>
          </span>
        </Link>
        <Link href="/inscription" style={{
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#9ca3af",
          textDecoration: "none",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
          paddingBottom: "2px",
        }}>
          ← Retour à l'inscription
        </Link>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px 80px" }}>

        {/* Titre */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4b5563", marginBottom: "12px" }}>
            Document légal
          </div>
          <h1 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "#f5f5f5",
            marginBottom: "16px",
            lineHeight: 1.2,
          }}>
            Politique de Confidentialité
          </h1>
          <p style={{ fontSize: "13px", color: "#4b5563" }}>
            Dernière mise à jour : {lastUpdate} — InfiniWear
          </p>
        </div>

        {/* Intro */}
        <div style={{ ...sectionStyle, padding: "24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "48px" }}>
          <p style={{ ...pStyle, color: "#d1d5db", marginBottom: 0 }}>
            Chez <strong style={{ color: "#f5f5f5" }}>InfiniWear</strong>, nous respectons votre vie privée et nous engageons à protéger vos données personnelles. Cette politique de confidentialité vous informe sur la manière dont nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre plateforme.
          </p>
        </div>

        {/* 1. Responsable */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>1. Responsable du traitement</h2>
          <p style={pStyle}>
            Le responsable du traitement de vos données personnelles est la société <strong style={{ color: "#f5f5f5" }}>InfiniWear</strong>, marque de prêt-à-porter basée au Togo, joignable à l'adresse suivante :
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "📱 WhatsApp / Téléphone : +22879931957",
              "🌐 Site internet : infiniwear.com",
            ].map((item, i) => (
              <li key={i} style={liStyle}>
                <span style={{ color: "#6b7280", marginRight: "8px" }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Données collectées */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>2. Données personnelles collectées</h2>
          <p style={pStyle}>
            Nous collectons uniquement les données strictement nécessaires au bon fonctionnement de nos services :
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Donnée</th>
                  <th style={thStyle}>Utilisation</th>
                  <th style={thStyle}>Obligatoire</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Adresse email", "Connexion, communication", "Oui"],
                  ["Pseudo", "Identification sur la plateforme", "Oui"],
                  ["Prénom", "Personnalisation de l'expérience", "Non"],
                  ["Mot de passe (chiffré)", "Authentification sécurisée", "Oui"],
                  ["Historique des commandes", "Suivi et service client", "Automatique"],
                  ["Avis et commentaires", "Modération et affichage produits", "Volontaire"],
                  ["Adresse IP", "Sécurité et lutte contre la fraude", "Automatique"],
                ].map(([data, use, required], i) => (
                  <tr key={i}>
                    <td style={{ ...tdStyle, color: "#f5f5f5", fontWeight: 500 }}>{data}</td>
                    <td style={tdStyle}>{use}</td>
                    <td style={{ ...tdStyle, color: required === "Oui" ? "#34d399" : required === "Non" ? "#9ca3af" : "#6b7280" }}>
                      {required}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={pStyle}>
            <strong style={{ color: "#f5f5f5" }}>Important :</strong> Nous ne collectons jamais vos informations bancaires ou de paiement directement. Toutes les transactions financières sont gérées hors plateforme via WhatsApp.
          </p>
        </div>

        {/* 3. Finalités */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>3. Finalités du traitement</h2>
          <p style={pStyle}>Vos données sont utilisées exclusivement pour :</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Créer et gérer votre compte utilisateur.",
              "Personnaliser votre expérience de navigation sur InfiniWear.",
              "Traiter et suivre vos commandes effectuées via WhatsApp.",
              "Vous contacter en cas de problème avec votre commande.",
              "Améliorer nos produits et services grâce aux retours d'expérience.",
              "Assurer la sécurité de la plateforme (détection de fraudes et d'abus).",
              "Respecter nos obligations légales et réglementaires.",
            ].map((item, i) => (
              <li key={i} style={liStyle}>
                <span style={{ color: "#6b7280", marginRight: "8px" }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Partage */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>4. Partage de vos données</h2>
          <p style={pStyle}>
            InfiniWear <strong style={{ color: "#f5f5f5" }}>ne vend jamais vos données personnelles</strong> à des tiers. Vos informations peuvent être partagées uniquement dans les cas suivants :
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Prestataires techniques (hébergement, infrastructure) agissant pour notre compte et sous notre instruction.",
              "Autorités légales si requis par la loi ou en cas de procédure judiciaire.",
              "En cas de cession ou fusion de la marque InfiniWear (vous en serez notifié).",
            ].map((item, i) => (
              <li key={i} style={liStyle}>
                <span style={{ color: "#6b7280", marginRight: "8px" }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 5. Conservation */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>5. Durée de conservation</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Type de donnée</th>
                  <th style={thStyle}>Durée de conservation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Données de compte (email, pseudo, prénom)", "Jusqu'à suppression du compte + 1 an"],
                  ["Historique des commandes", "5 ans (obligation légale comptable)"],
                  ["Avis et commentaires publiés", "Jusqu'à suppression manuelle"],
                  ["Logs de sécurité (IP, connexions)", "90 jours maximum"],
                  ["Données inactives", "Suppression automatique après 3 ans d'inactivité"],
                ].map(([type, duration], i) => (
                  <tr key={i}>
                    <td style={{ ...tdStyle, color: "#f5f5f5" }}>{type}</td>
                    <td style={tdStyle}>{duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. Sécurité */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>6. Sécurité de vos données</h2>
          <p style={pStyle}>
            InfiniWear met en œuvre des mesures techniques et organisationnelles pour protéger vos données :
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Chiffrement des mots de passe avec l'algorithme bcrypt (coût 12).",
              "Connexions sécurisées via HTTPS (TLS).",
              "Accès aux données limité au personnel autorisé.",
              "Surveillance des activités suspectes et blocage automatique.",
              "En-têtes HTTP de sécurité (HSTS, X-Frame-Options, CSP).",
            ].map((item, i) => (
              <li key={i} style={liStyle}>
                <span style={{ color: "#34d399", marginRight: "8px" }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
          <p style={{ ...pStyle, marginTop: "16px" }}>
            Cependant, aucun système n'est infaillible. En cas de violation de données susceptible de vous affecter, nous vous en informerons dans les meilleurs délais.
          </p>
        </div>

        {/* 7. Droits */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>7. Vos droits sur vos données</h2>
          <p style={pStyle}>
            Conformément aux réglementations applicables en matière de protection des données, vous disposez des droits suivants :
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              { label: "Droit d'accès", desc: "Obtenir une copie de vos données personnelles détenues par InfiniWear." },
              { label: "Droit de rectification", desc: "Corriger des données inexactes ou incomplètes vous concernant." },
              { label: "Droit à l'effacement", desc: "Demander la suppression de votre compte et de vos données personnelles." },
              { label: "Droit d'opposition", desc: "Vous opposer au traitement de vos données pour des motifs légitimes." },
              { label: "Droit à la portabilité", desc: "Recevoir vos données dans un format structuré et lisible par machine." },
            ].map(({ label, desc }, i) => (
              <li key={i} style={{ ...liStyle, marginBottom: "14px" }}>
                <span style={{ color: "#6b7280", marginRight: "8px" }}>—</span>
                <strong style={{ color: "#f5f5f5" }}>{label}</strong> : {desc}
              </li>
            ))}
          </ul>
          <p style={{ ...pStyle, marginTop: "16px" }}>
            Pour exercer l'un de ces droits, contactez-nous via WhatsApp au <strong style={{ color: "#f5f5f5" }}>+22879931957</strong>. Nous répondrons dans un délai de <strong style={{ color: "#f5f5f5" }}>30 jours</strong>.
          </p>
        </div>

        {/* 8. Cookies */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>8. Cookies et technologies de suivi</h2>
          <p style={pStyle}>
            InfiniWear utilise des cookies essentiels au fonctionnement du site (gestion de session, authentification). Nous n'utilisons <strong style={{ color: "#f5f5f5" }}>pas de cookies publicitaires ou de traçage tiers</strong>.
          </p>
          <p style={pStyle}>
            Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela pourrait affecter le bon fonctionnement de certaines fonctionnalités, notamment la connexion à votre compte.
          </p>
        </div>

        {/* 9. Contact */}
        <div style={{ ...sectionStyle, padding: "24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 style={{ ...h2Style, borderBottom: "none", marginBottom: "12px" }}>Contact — Délégué à la protection des données</h2>
          <p style={{ ...pStyle, marginBottom: "8px" }}>
            Pour toute question relative à la gestion de vos données personnelles :
          </p>
          <p style={{ ...pStyle, marginBottom: "4px" }}>
            📱 WhatsApp : <strong style={{ color: "#f5f5f5" }}>+22879931957</strong>
          </p>
          <p style={pStyle}>
            🌐 Site : <strong style={{ color: "#f5f5f5" }}>infiniwear.com</strong>
          </p>
        </div>

        {/* Retour */}
        <div style={{ display: "flex", gap: "16px", marginTop: "40px" }}>
          <Link href="/inscription" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: "#f5f5f5",
            color: "#08090a",
            textDecoration: "none",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}>
            ← Retour à l'inscription
          </Link>
          <Link href="/conditions" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#9ca3af",
            textDecoration: "none",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}>
            Conditions d'utilisation →
          </Link>
        </div>
      </div>
    </div>
  );
}
