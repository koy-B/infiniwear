// src/app/api/auth/register/route.ts
// Inscription email/password avec validation Zod sécurisée

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

// ─── Schéma de validation strict ────────────────────────────────────────────
const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Format email invalide — ex: nom@domaine.com")
    .max(254, "Email trop long"),
  password: z
    .string()
    .min(8, "Mot de passe minimum 8 caractères")
    .max(128, "Mot de passe trop long"),
  pseudo: z
    .string()
    .min(3, "Pseudo minimum 3 caractères")
    .max(20, "Pseudo maximum 20 caractères")
    .regex(/^[a-zA-Z0-9_]+$/, "Pseudo: lettres, chiffres et _ seulement"),
  name: z
    .string()
    .min(2, "Prénom minimum 2 caractères")
    .max(50, "Prénom trop long")
    .optional(),
});

// ─── Rate limiting simple en mémoire ─────────────────────────────────────────
const registerAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5; // max 5 inscriptions par IP par fenêtre

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = registerAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    registerAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true; // OK
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false; // Bloqué
  }

  entry.count++;
  return true; // OK
}

// ─── Handler POST ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Trop de tentatives. Veuillez réessayer dans 15 minutes." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const { email, password, pseudo, name } = parsed.data;

    // Vérifier si l'email existe déjà
    const existingEmail = await db.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Cet email est déjà associé à un compte" },
        { status: 409 }
      );
    }

    // Vérifier si le pseudo existe déjà
    const existingPseudo = await db.user.findUnique({ where: { pseudo } });
    if (existingPseudo) {
      return NextResponse.json(
        { error: "Ce pseudo est déjà pris" },
        { status: 409 }
      );
    }

    // Hasher le mot de passe (bcrypt, coût=12)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const user = await db.user.create({
      data: {
        email,
        pseudo,
        name: name?.trim() || pseudo,
        password: hashedPassword,
        role: "CLIENT",
      },
      select: {
        id:     true,
        email:  true,
        pseudo: true,
        name:   true,
        role:   true,
      },
    });

    // Log l'inscription
    await db.log.create({
      data: {
        type:    "AUTH",
        message: `Inscription email — ${email} (@${pseudo})`,
        userId:  user.id,
      },
    }).catch(() => null);

    return NextResponse.json(
      { success: true, user, message: "Compte créé avec succès" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    return NextResponse.json(
      { error: "Erreur serveur, veuillez réessayer" },
      { status: 500 }
    );
  }
}
