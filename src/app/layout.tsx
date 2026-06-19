import type { Metadata } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "InfiniWear — No Limit Just Style",
    template: "%s | InfiniWear",
  },
  description:
    "InfiniWear — Marque de streetwear et mode haut de gamme. Découvrez nos collections Normale et Féminine. No Limit Just Style.",
  keywords: ["InfiniWear", "streetwear", "mode", "vêtements", "collection", "fashion", "Côte d'Ivoire"],
  authors: [{ name: "InfiniWear" }],
  creator: "InfiniWear",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "InfiniWear",
    title: "InfiniWear — No Limit Just Style",
    description: "Marque de streetwear haut de gamme. Collections Normale & Féminine.",
  },
  twitter: {
    card: "summary_large_image",
    title: "InfiniWear — No Limit Just Style",
    description: "Marque de streetwear haut de gamme. Collections Normale & Féminine.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${bodoni.variable} ${hanken.variable}`}>
      <body className="antialiased bg-iw-base text-iw-primary font-body">
        {children}
      </body>
    </html>
  );
}
