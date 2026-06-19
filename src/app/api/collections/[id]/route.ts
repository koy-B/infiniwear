import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const collectionSchema = z.object({
  name:        z.string().min(2),
  description: z.string().optional(),
  coverImage:  z.string().min(1).optional().nullable(),
  active:      z.boolean().optional(),
});

export async function PUT(
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
      return NextResponse.json({ error: "Identifiant de la collection manquant" }, { status: 400 });
    }

    const body = await req.json();
    const parsed = collectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Validation échouée" }, { status: 400 });
    }

    const data = parsed.data;
    const slug = slugify(data.name);

    // Vérifier si une AUTRE collection porte déjà ce slug
    const existingWithSlug = await db.collection.findFirst({
      where: {
        slug,
        id: { not: id }
      }
    });

    if (existingWithSlug) {
      return NextResponse.json({ error: "Une autre collection avec ce nom existe déjà" }, { status: 409 });
    }

    const collection = await db.collection.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        description: data.description,
        coverImage: data.coverImage,
        active: data.active ?? true,
      },
    });

    // Enregistrer l'action de modification dans les logs
    await db.log.create({
      data: {
        type:    "ADMIN",
        message: `Collection modifiée — "${collection.name}" par ${session.user.email}`,
        userId:  session.user.id,
      },
    }).catch(() => null);

    return NextResponse.json({ collection }, { status: 200 });
  } catch (error) {
    console.error("[PUT COLLECTION]", error);
    return NextResponse.json({ error: "Erreur serveur lors de la mise à jour de la collection" }, { status: 500 });
  }
}
