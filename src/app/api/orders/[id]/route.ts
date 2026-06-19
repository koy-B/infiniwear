// src/app/api/orders/[id]/route.ts
// PATCH — Modifier le statut d'une commande (admin)

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const updateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"]),
});

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
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const order = await db.order.update({
      where: { id },
      data:  { status: parsed.data.status },
      include: { user: { select: { email: true, pseudo: true } } },
    });

    await db.log.create({
      data: {
        type:    "ORDER",
        message: `Commande ${id} → ${parsed.data.status} par ${session.user.email}`,
        userId:  session.user.id,
        metadata: { orderId: id, status: parsed.data.status },
      },
    }).catch(() => null);

    return NextResponse.json({ order });
  } catch (error) {
    console.error("[PATCH ORDER]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
