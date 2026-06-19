import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const userCreateSchema = z.object({
  email:    z.string().email("Email invalide"),
  password: z.string().min(8, "Mot de passe minimum 8 caractères"),
  pseudo:   z.string().min(3, "Pseudo minimum 3 caractères").max(20).regex(/^[a-zA-Z0-9_]+$/, "Pseudo: lettres, chiffres et _ seulement"),
  name:     z.string().min(2, "Prénom minimum 2 caractères").optional(),
  role:     z.enum(["CLIENT", "SUPPORT_AGENT", "SUPER_ADMIN"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["SUPER_ADMIN", "SUPPORT_AGENT"].includes(session.user.role!)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = userCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Validation échouée" }, { status: 400 });
    }

    const { email, password, pseudo, name, role } = parsed.data;

    // Security: Only SUPER_ADMIN can create a SUPER_ADMIN account
    if (role === "SUPER_ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Seul un Super Admin peut créer un compte Super Admin" }, { status: 403 });
    }

    // Check email duplicate
    const existingEmail = await db.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
    }

    // Check pseudo duplicate
    const existingPseudo = await db.user.findUnique({ where: { pseudo } });
    if (existingPseudo) {
      return NextResponse.json({ error: "Ce pseudo est déjà pris" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await db.user.create({
      data: {
        email,
        pseudo,
        name: name || pseudo,
        password: hashedPassword,
        role,
        suspended: false,
      },
      select: {
        id:        true,
        email:     true,
        pseudo:    true,
        name:      true,
        role:      true,
        suspended: true,
        createdAt: true,
      }
    });

    // Audit log
    await db.log.create({
      data: {
        type:    "ADMIN",
        message: `Compte créé par l'admin — @${newUser.pseudo} (Rôle: ${newUser.role}) par ${session.user.email}`,
        userId:  session.user.id,
      },
    }).catch(() => null);

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error("[POST USER CREATE]", error);
    return NextResponse.json({ error: "Erreur serveur lors de la création de l'utilisateur" }, { status: 500 });
  }
}
