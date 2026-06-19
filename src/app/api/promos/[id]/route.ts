import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || !["SUPER_ADMIN", "SUPPORT_AGENT"].includes(session.user.role!)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID du coupon manquant" }, { status: 400 });
    }

    // Toggle active status
    const existing = await db.promoCode.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Coupon non trouvé" }, { status: 404 });
    }

    const updated = await db.promoCode.update({
      where: { id },
      data: { active: !existing.active },
    });

    // Audit log
    await db.log.create({
      data: {
        type:    "ADMIN",
        message: `Statut code promo changé — "${updated.code}" (${updated.active ? "activé" : "désactivé"}) par ${session.user.email}`,
        userId:  session.user.id,
      },
    }).catch(() => null);

    return NextResponse.json({ promo: updated });
  } catch (error) {
    console.error("[PATCH PROMO]", error);
    return NextResponse.json({ error: "Erreur serveur lors de la mise à jour du code promo" }, { status: 500 });
  }
}
