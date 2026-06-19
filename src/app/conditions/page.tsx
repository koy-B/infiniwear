// src/app/conditions/page.tsx
// Page des Conditions Générales d'Utilisation — InfiniWear

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation | InfiniWear",
  description: "Lisez les conditions générales d'utilisation de la plateforme InfiniWear avant de créer votre compte.",
};

export default function ConditionsPage() {
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
    position: "relative",
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

      {/* Contenu principal */}
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
            Conditions Générales d'Utilisation
          </h1>
          <p style={{ fontSize: "13px", color: "#4b5563" }}>
            Dernière mise à jour : {lastUpdate} — InfiniWear
          </p>
        </div>

        {/* Introduction */}
        <div style={{ ...sectionStyle, padding: "24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "48px" }}>
          <p style={{ ...pStyle, color: "#d1d5db", marginBottom: 0 }}>
            Bienvenue sur <strong style={{ color: "#f5f5f5" }}>InfiniWear</strong>. En accédant à notre site internet et en créant un compte, vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation (CGU). Nous vous invitons à les lire attentivement. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
          </p>
        </div>

        {/* 1. Objet */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>Article 1 — Objet et champ d'application</h2>
          <p style={pStyle}>
            Les présentes CGU régissent l'accès et l'utilisation du site internet InfiniWear, accessible à l'adresse <strong style={{ color: "#f5f5f5" }}>infiniwear.com</strong>, ainsi que tous les services associés proposés par la marque InfiniWear.
          </p>
          <p style={pStyle}>
            InfiniWear est une marque de mode proposant des vêtements de qualité premium (T-shirts, hoodies, shorts, vestes, crops tops et accessoires) pour femmes et hommes. Les commandes sont finalisées via WhatsApp avec notre équipe de vente.
          </p>
        </div>

        {/* 2. Compte utilisateur */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>Article 2 — Création et gestion de votre compte</h2>
          <p style={pStyle}>
            Pour accéder à certaines fonctionnalités (suivi de commandes, espace client), vous devez créer un compte personnel. En vous inscrivant, vous vous engagez à :
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Fournir des informations exactes, complètes et à jour lors de l'inscription.",
              "Utiliser une adresse email valide et vous appartenant réellement.",
              "Choisir un pseudo unique qui ne soit pas offensant, trompeur ou portant atteinte aux droits d'un tiers.",
              "Garder votre mot de passe strictement confidentiel et ne jamais le partager.",
              "Informer InfiniWear immédiatement en cas d'utilisation non autorisée de votre compte.",
              "Ne pas créer de compte au nom d'une autre personne sans son autorisation.",
              "Ne pas créer plus d'un compte personnel.",
            ].map((item, i) => (
              <li key={i} style={liStyle}>
                <span style={{ color: "#6b7280", marginRight: "8px" }}>—</span>
                {item}
              </li>
            ))}
          </ul>
          <p style={{ ...pStyle, marginTop: "16px" }}>
            InfiniWear se réserve le droit de suspendre ou supprimer tout compte ne respectant pas ces engagements, sans préavis.
          </p>
        </div>

        {/* 3. Utilisation acceptable */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>Article 3 — Utilisation acceptable de la plateforme</h2>
          <p style={pStyle}>
            En utilisant InfiniWear, vous vous engagez à ne pas :
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Utiliser le site à des fins illégales ou frauduleuses.",
              "Diffuser des contenus offensants, haineux, discriminatoires ou portant atteinte à la dignité humaine.",
              "Tenter d'accéder à des zones restreintes du site sans autorisation.",
              "Utiliser des robots, scripts ou tout autre outil automatisé pour accéder au site ou collecter des données.",
              "Copier, modifier ou distribuer le contenu du site (photos, textes, visuels) sans autorisation écrite.",
              "Publier de faux avis ou des informations trompeuses.",
              "Usurper l'identité d'un autre utilisateur ou membre de l'équipe InfiniWear.",
            ].map((item, i) => (
              <li key={i} style={liStyle}>
                <span style={{ color: "#6b7280", marginRight: "8px" }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Commandes et paiements */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>Article 4 — Commandes et processus d'achat</h2>
          <p style={pStyle}>
            Le processus de commande sur InfiniWear fonctionne de la manière suivante :
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Vous sélectionnez un article, votre taille et cliquez sur le bouton d'achat.",
              "Vous êtes redirigé vers WhatsApp avec un message pré-rempli contenant les détails de votre commande.",
              "Un membre de notre équipe vous confirme la disponibilité, les modalités de livraison et de paiement.",
              "La commande n'est définitivement validée qu'après confirmation de notre équipe et réception du paiement.",
            ].map((item, i) => (
              <li key={i} style={liStyle}>
                <span style={{ color: "#6b7280", marginRight: "8px" }}>—</span>
                {item}
              </li>
            ))}
          </ul>
          <p style={{ ...pStyle, marginTop: "16px" }}>
            Les prix sont affichés en <strong style={{ color: "#f5f5f5" }}>Franc CFA (FCFA)</strong>. InfiniWear se réserve le droit de modifier ses prix à tout moment, sans que cela n'affecte les commandes déjà confirmées.
          </p>
        </div>

        {/* 5. Retours et litiges */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>Article 5 — Retours, échanges et réclamations</h2>
          <p style={pStyle}>
            InfiniWear accorde une importance capitale à la satisfaction de ses clients. En cas de problème avec votre commande :
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Contactez-nous dans les 48 heures suivant la réception via WhatsApp (+22879931957).",
              "Joignez des photos claires de l'article concerné.",
              "Un échange ou un avoir sera proposé pour tout article livré défectueux ou non conforme à la commande.",
              "Les retours pour simple convenance (changement d'avis) ne sont acceptés que si l'article est neuf, non porté et dans son emballage d'origine.",
            ].map((item, i) => (
              <li key={i} style={liStyle}>
                <span style={{ color: "#6b7280", marginRight: "8px" }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 6. Propriété intellectuelle */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>Article 6 — Propriété intellectuelle</h2>
          <p style={pStyle}>
            L'ensemble du contenu présent sur le site InfiniWear (logo, photographies, visuels de produits, textes, design, interface) est la propriété exclusive d'InfiniWear et est protégé par les lois applicables en matière de propriété intellectuelle.
          </p>
          <p style={pStyle}>
            Toute reproduction, distribution, modification ou utilisation commerciale de ce contenu sans autorisation écrite préalable d'InfiniWear est strictement interdite et pourra faire l'objet de poursuites.
          </p>
        </div>

        {/* 7. Limitation de responsabilité */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>Article 7 — Limitation de responsabilité</h2>
          <p style={pStyle}>
            InfiniWear s'efforce d'assurer l'exactitude des informations présentes sur le site. Toutefois, nous ne pouvons être tenus responsables des :
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Interruptions temporaires du service dues à des opérations de maintenance ou à des problèmes techniques.",
              "Erreurs typographiques sur les prix (corrigées dans les meilleurs délais).",
              "Dommages indirects résultant de l'utilisation du site.",
              "Problèmes liés à la connexion internet de l'utilisateur.",
            ].map((item, i) => (
              <li key={i} style={liStyle}>
                <span style={{ color: "#6b7280", marginRight: "8px" }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 8. Résiliation */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>Article 8 — Résiliation du compte</h2>
          <p style={pStyle}>
            Vous pouvez à tout moment demander la suppression de votre compte en nous contactant via WhatsApp ou par email. InfiniWear se réserve également le droit de résilier ou suspendre votre compte si vous ne respectez pas les présentes CGU, sans obligation de remboursement des achats effectués.
          </p>
        </div>

        {/* 9. Modification des CGU */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>Article 9 — Modification des conditions</h2>
          <p style={pStyle}>
            InfiniWear peut modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur le site. Il vous appartient de consulter régulièrement cette page. La poursuite de l'utilisation du site après modification vaut acceptation des nouvelles conditions.
          </p>
        </div>

        {/* 10. Droit applicable */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>Article 10 — Droit applicable et juridiction</h2>
          <p style={pStyle}>
            Les présentes CGU sont régies par le droit en vigueur au <strong style={{ color: "#f5f5f5" }}>Togo</strong>. En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, le litige sera soumis aux juridictions compétentes du lieu du siège social d'InfiniWear.
          </p>
        </div>

        {/* 11. Contact */}
        <div style={{ ...sectionStyle, padding: "24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 style={{ ...h2Style, borderBottom: "none", marginBottom: "12px" }}>Contact</h2>
          <p style={{ ...pStyle, marginBottom: "8px" }}>
            Pour toute question concernant les présentes conditions, contactez-nous :
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
          <Link href="/confidentialite" style={{
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
            Politique de confidentialité →
          </Link>
        </div>
      </div>
    </div>
  );
}
