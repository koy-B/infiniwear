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
      return NextResponse.json({ error: "ID de l'utilisateur manquant" }, { status: 400 });
    }

    const targetUser = await db.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // A SUPPORT_AGENT cannot modify a SUPER_ADMIN
    if (session.user.role === "SUPPORT_AGENT" && targetUser.role === "SUPER_ADMIN") {
      return NextResponse.json({ error: "Un agent de support ne peut pas modifier un Super Admin" }, { status: 403 });
    }

    // Parse optional body
    const body = await req.json().catch(() => null);
    const dataToUpdate: any = {};
    let auditMessage = "";

    if (body) {
      // 1. Role Update
      if (body.role) {
        if (!["CLIENT", "SUPPORT_AGENT", "SUPER_ADMIN"].includes(body.role)) {
          return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
        }
        // A user cannot change their own role
        if (session.user.id === id) {
          return NextResponse.json({ error: "Vous ne pouvez pas modifier votre propre rôle" }, { status: 400 });
        }
        // Only SUPER_ADMIN can assign SUPER_ADMIN role or modify a SUPER_ADMIN user
        if ((body.role === "SUPER_ADMIN" || targetUser.role === "SUPER_ADMIN") && session.user.role !== "SUPER_ADMIN") {
          return NextResponse.json({ error: "Seul un Super Admin peut attribuer ou modifier le rôle Super Admin" }, { status: 403 });
        }
        dataToUpdate.role = body.role;
        auditMessage = `Rôle de l'utilisateur @${targetUser.pseudo} (${targetUser.email}) modifié de ${targetUser.role} à ${body.role} par ${session.user.email}`;
      }
      
      // 2. Explicit Suspended Update
      if (typeof body.suspended === "boolean") {
        if (session.user.id === id) {
          return NextResponse.json({ error: "Vous ne pouvez pas suspendre votre propre compte" }, { status: 400 });
        }
        dataToUpdate.suspended = body.suspended;
        auditMessage = `Statut de suspension de l'utilisateur @${targetUser.pseudo} (${targetUser.email}) modifié à ${body.suspended ? "suspendu" : "actif"} par ${session.user.email}`;
      }
    } else {
      // Toggle suspended if no body (backward compatibility)
      if (session.user.id === id) {
        return NextResponse.json({ error: "Vous ne pouvez pas suspendre votre propre compte" }, { status: 400 });
      }
      dataToUpdate.suspended = !targetUser.suspended;
      auditMessage = `Statut de suspension de l'utilisateur @${targetUser.pseudo} (${targetUser.email}) modifié à ${!targetUser.suspended ? "suspendu" : "actif"} par ${session.user.email}`;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ error: "Aucune donnée à modifier" }, { status: 400 });
    }

    const updated = await db.user.update({
      where: { id },
      data: dataToUpdate,
    });

    // Audit log
    await db.log.create({
      data: {
        type: "ADMIN",
        message: auditMessage,
        userId: session.user.id,
      },
    }).catch(() => null);

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("[PATCH USER]", error);
    return NextResponse.json({ error: "Erreur serveur lors de la modification de l'utilisateur" }, { status: 500 });
  }
}
