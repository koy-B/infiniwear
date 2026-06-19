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

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["SUPER_ADMIN", "SUPPORT_AGENT"].includes(session.user.role!)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = collectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Validation échouée" }, { status: 400 });
    }

    const data = parsed.data;
    const slug = slugify(data.name);

    // Vérifier slug unique
    const existing = await db.collection.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Une collection avec ce nom existe déjà" }, { status: 409 });
    }

    const collection = await db.collection.create({
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
        message: `Collection créée — "${collection.name}" par ${session.user.email}`,
        userId:  session.user.id,
      },
    }).catch(() => null);

    return NextResponse.json({ collection }, { status: 201 });
  } catch (error) {
    console.error("[POST COLLECTION]", error);
    return NextResponse.json({ error: "Erreur serveur lors de la création de la collection" }, { status: 500 });
  }
}
