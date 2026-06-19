import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// PATCH /api/reviews/[id] -> Toggle approval status
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
      return NextResponse.json({ error: "ID de l'avis manquant" }, { status: 400 });
    }

    const existing = await db.review.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Avis non trouvé" }, { status: 404 });
    }

    const updated = await db.review.update({
      where: { id },
      data: { approved: !existing.approved },
    });

    // Audit log
    await db.log.create({
      data: {
        type:    "ADMIN",
        message: `Avis ${id} ${updated.approved ? "approuvé" : "désapprouvé"} par ${session.user.email}`,
        userId:  session.user.id,
      },
    }).catch(() => null);

    return NextResponse.json({ review: updated });
  } catch (error) {
    console.error("[PATCH REVIEW]", error);
    return NextResponse.json({ error: "Erreur serveur lors de la mise à jour de l'avis" }, { status: 500 });
  }
}

// DELETE /api/reviews/[id] -> Delete review
export async function DELETE(
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
      return NextResponse.json({ error: "ID de l'avis manquant" }, { status: 400 });
    }

    const existing = await db.review.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Avis non trouvé" }, { status: 404 });
    }

    await db.review.delete({ where: { id } });

    // Audit log
    await db.log.create({
      data: {
        type:    "ADMIN",
        message: `Avis de @${existing.userId} supprimé par ${session.user.email}`,
        userId:  session.user.id,
      },
    }).catch(() => null);

    return NextResponse.json({ success: true, message: "Avis supprimé avec succès" });
  } catch (error) {
    console.error("[DELETE REVIEW]", error);
    return NextResponse.json({ error: "Erreur serveur lors de la suppression de l'avis" }, { status: 500 });
  }
}
