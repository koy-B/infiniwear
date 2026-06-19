// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Formatage prix en FCFA ───
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " FCFA";
}

// ─── Génération message WhatsApp ───
export function generateWhatsAppMessage({
  pseudo,
  orderId,
  items,
  total,
}: {
  pseudo: string;
  orderId: string;
  items: Array<{ name: string; size: string; quantity: number }>;
  total: number;
}): string {
  const itemsList = items
    .map((item) => `   • ${item.name} — Taille ${item.size} × ${item.quantity}`)
    .join("\n");

  return (
    `Bonjour InfiniWear 👋\n\n` +
    `Je souhaite confirmer ma commande :\n\n` +
    `🏷 Pseudo : ${pseudo}\n` +
    `🆔 Commande : ${orderId}\n\n` +
    `👕 Produits commandés :\n${itemsList}\n\n` +
    `💰 Total : ${formatPrice(total)}\n\n` +
    `Merci de confirmer ! ∞`
  );
}

// ─── URL WhatsApp ───
export function buildWhatsAppUrl(message: string): string {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+22500000000").replace(/[^0-9]/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

// ─── Slug generator ───
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Truncate text ───
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

// ─── Date relative ───
export function relativeDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "il y a quelques secondes";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  if (diffHour < 24) return `il y a ${diffHour}h`;
  if (diffDay === 1) return "hier";
  if (diffDay < 7) return `il y a ${diffDay} jours`;
  return d.toLocaleDateString("fr-FR");
}

// ─── Stock level ───
export function getStockLevel(stock: number): "ok" | "warn" | "danger" | "out" {
  if (stock === 0) return "out";
  if (stock <= 5) return "danger";
  if (stock <= 15) return "warn";
  return "ok";
}
