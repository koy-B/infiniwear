import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const productSchema = z.object({
  name:         z.string().min(2),
  description:  z.string().optional(),
  price:        z.number().int().positive(),
  images:       z.array(z.string().url()).min(1),
  sizes:        z.array(z.string()).min(1),
  stock:        z.number().int().min(0),
  collectionId: z.string(),
  categoryId:   z.string().optional(),
  featured:     z.boolean().optional(),
  active:       z.boolean().optional(),
});

// PUT /api/products/[id] (Admin only)
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
      return NextResponse.json({ error: "ID du produit manquant" }, { status: 400 });
    }

    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Validation échouée" }, { status: 400 });
    }

    const data = parsed.data;
    const slug = slugify(data.name);

    // Vérifier si un AUTRE produit a déjà ce slug
    const existingWithSlug = await db.product.findFirst({
      where: {
        slug,
        id: { not: id }
      }
    });

    if (existingWithSlug) {
      return NextResponse.json({ error: "Un autre produit avec ce nom existe déjà" }, { status: 409 });
    }

    // Mettre à jour le produit
    const updatedProduct = await db.product.update({
      where: { id },
      data: { ...data, slug },
      include: { collection: true },
    });

    // Enregistrer l'action de modification
    await db.log.create({
      data: {
        type:    "PRODUCT",
        message: `Produit mis à jour — "${updatedProduct.name}" par ${session.user.email}`,
        userId:  session.user.id,
      },
    }).catch(() => null);

    return NextResponse.json({ product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("[PUT PRODUCT]", error);
    return NextResponse.json({ error: "Erreur serveur lors de la mise à jour" }, { status: 500 });
  }
}
