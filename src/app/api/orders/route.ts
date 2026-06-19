// src/app/api/orders/route.ts
// POST — Créer une commande + générer message WhatsApp

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateWhatsAppMessage, buildWhatsAppUrl } from "@/lib/utils";

const orderItemSchema = z.object({
  productId: z.string(),
  size:      z.string(),
  quantity:  z.number().int().positive(),
});

const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  notes: z.string().optional(),
});

// GET /api/orders (admin — all orders; client — own orders)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page   = parseInt(searchParams.get("page") || "1");
    const limit  = parseInt(searchParams.get("limit") || "20");
    const isAdmin = ["SUPER_ADMIN", "SUPPORT_AGENT"].includes(session.user.role!);

    const where: Record<string, unknown> = {};
    if (!isAdmin) where.userId = session.user.id;
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          user:  { select: { pseudo: true, email: true, name: true } },
          items: { include: { product: { select: { name: true, images: true } } } },
        },
        orderBy: { createdAt: "desc" },
        skip:    (page - 1) * limit,
        take:    limit,
      }),
      db.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET ORDERS]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/orders — Créer une commande
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Connectez-vous pour commander" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Validation échouée" }, { status: 400 });
    }

    const { items, notes } = parsed.data;

    // Récupérer les produits et vérifier le stock
    const productIds = items.map((i) => i.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds }, active: true },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "Un ou plusieurs produits introuvables" }, { status: 400 });
    }

    // Calculer le total
    let total = 0;
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      if (!product.sizes.includes(item.size)) {
        throw new Error(`Taille ${item.size} indisponible pour ${product.name}`);
      }
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      return {
        productId: item.productId,
        size:      item.size,
        quantity:  item.quantity,
        price:     product.price,
      };
    });

    // Récupérer l'utilisateur pour le pseudo
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { pseudo: true },
    });

    // Générer le message WhatsApp
    const orderId = `#${Date.now().toString().slice(-6)}`;
    const waMessage = generateWhatsAppMessage({
      pseudo:  user?.pseudo || session.user.name || "Client",
      orderId,
      items: items.map((item) => {
        const product = products.find((p) => p.id === item.productId)!;
        return { name: product.name, size: item.size, quantity: item.quantity };
      }),
      total,
    });

    const waUrl = buildWhatsAppUrl(waMessage);

    // Créer la commande en DB
    const order = await db.order.create({
      data: {
        userId:    session.user.id,
        total,
        waMessage,
        notes,
        items: { create: orderItems },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    // Log
    await db.log.create({
      data: {
        type:    "ORDER",
        message: `Nouvelle commande ${orderId} — ${total} FCFA par ${session.user.email}`,
        userId:  session.user.id,
      },
    }).catch(() => null);

    return NextResponse.json({ order, waUrl, waMessage }, { status: 201 });
  } catch (error) {
    console.error("[POST ORDER]", error);
    const msg = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
