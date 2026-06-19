import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── En-têtes de sécurité HTTP ─────────────────────────────────────────────
  async headers() {
    return [
      {
        // Appliquer les en-têtes à toutes les routes
        source: "/(.*)",
        headers: [
          // Empêche l'intégration dans des iframes (clickjacking)
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Force le navigateur à respecter le type MIME déclaré
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Évite de transmettre le Referer vers des sites tiers
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Politique de permissions (désactive camera, micro, géoloc non demandés)
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Protection XSS (navigateurs legacy)
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // HSTS — force HTTPS (important en production)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
