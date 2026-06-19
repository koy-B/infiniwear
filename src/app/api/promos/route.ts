import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const promoSchema = z.object({
  code:      z.string().min(2).toUpperCase(),
  type:      z.enum(["PERCENTAGE", "FIXED", "FREE_SHIPPING"]),
  value:     z.number().int().min(0),
  maxUses:   z.number().int().positive().nullable().optional(),
  expiresAt: z.string().nullable().optional().or(z.string().length(0).transform(() => null)),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["SUPER_ADMIN", "SUPPORT_AGENT"].includes(session.user.role!)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = promoSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Validation échouée" }, { status: 400 });
    }

    const data = parsed.data;

    // Check duplicate code
    const existing = await db.promoCode.findUnique({ where: { code: data.code } });
    if (existing) {
      return NextResponse.json({ error: "Ce code promotionnel existe déjà" }, { status: 409 });
    }

    const promo = await db.promoCode.create({
      data: {
        code:      data.code,
        type:      data.type,
        value:     data.value,
        maxUses:   data.maxUses ?? null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        active:    true,
      },
    });

    // Audit log
    await db.log.create({
      data: {
        type:    "ADMIN",
        message: `Code promo créé — "${promo.code}" par ${session.user.email}`,
        userId:  session.user.id,
      },
    }).catch(() => null);

    return NextResponse.json({ promo }, { status: 201 });
  } catch (error) {
    console.error("[POST PROMO]", error);
    return NextResponse.json({ error: "Erreur serveur lors de la création du code promo" }, { status: 500 });
  }
}
