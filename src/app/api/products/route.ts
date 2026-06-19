// src/app/api/products/route.ts
// GET tous les produits + POST créer un produit (admin)

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const productSchema = z.object({
  name:         z.string().min(2),
  description:  z.string().optional(),
  price:        z.number().int().positive(),
  images:       z.array(z.string().min(1)).min(1),
  sizes:        z.array(z.string()).min(1),
  stock:        z.number().int().min(0),
  collectionId: z.string(),
  categoryId:   z.string().optional(),
  featured:     z.boolean().optional(),
  active:       z.boolean().optional(),
});

// GET /api/products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const collection = searchParams.get("collection");
    const featured   = searchParams.get("featured");
    const search     = searchParams.get("search");
    const page       = parseInt(searchParams.get("page") || "1");
    const limit      = parseInt(searchParams.get("limit") || "12");

    const where: Record<string, unknown> = { active: true };
    if (collection) where.collection = { slug: collection };
    if (featured === "true") where.featured = true;
    if (search) where.name = { contains: search, mode: "insensitive" };

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: { collection: true, category: true },
        orderBy: { createdAt: "desc" },
        skip:  (page - 1) * limit,
        take:  limit,
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET PRODUCTS]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/products (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["SUPER_ADMIN", "SUPPORT_AGENT"].includes(session.user.role!)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Validation échouée" }, { status: 400 });
    }

    const data = parsed.data;
    const slug = slugify(data.name);

    // Vérifier slug unique
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Un produit avec ce nom existe déjà" }, { status: 409 });
    }

    const product = await db.product.create({
      data: { ...data, slug },
      include: { collection: true },
    });

    // Log admin action
    await db.log.create({
      data: {
        type:    "PRODUCT",
        message: `Produit ajouté — "${product.name}" par ${session.user.email}`,
        userId:  session.user.id,
      },
    }).catch(() => null);

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("[POST PRODUCT]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
