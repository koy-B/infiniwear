// src/app/api/admin/stats/route.ts
// Dashboard stats pour l'admin panel

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || !["SUPER_ADMIN", "SUPPORT_AGENT"].includes(session.user.role!)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalOrders,
      totalOrdersLastMonth,
      totalUsers,
      totalUsersLastMonth,
      totalProducts,
      pendingOrders,
      totalRevenue,
      totalRevenueLastMonth,
      recentOrders,
      recentLogs,
      topProducts,
      lowStockProducts,
    ] = await Promise.all([
      // Commandes
      db.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      db.order.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } } }),
      // Utilisateurs
      db.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      db.user.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } } }),
      // Produits actifs
      db.product.count({ where: { active: true } }),
      // Commandes en attente
      db.order.count({ where: { status: "PENDING" } }),
      // Revenus du mois
      db.order.aggregate({
        where:  { createdAt: { gte: startOfMonth }, status: { not: "CANCELLED" } },
        _sum:   { total: true },
      }),
      // Revenus mois précédent
      db.order.aggregate({
        where:  { createdAt: { gte: startOfLastMonth, lt: startOfMonth }, status: { not: "CANCELLED" } },
        _sum:   { total: true },
      }),
      // Commandes récentes
      db.order.findMany({
        take:    10,
        orderBy: { createdAt: "desc" },
        include: {
          user:  { select: { pseudo: true, email: true } },
          items: { include: { product: { select: { name: true } } }, take: 1 },
        },
      }),
      // Logs récents
      db.log.findMany({
        take:    20,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { pseudo: true, email: true } } },
      }),
      // Top produits
      db.orderItem.groupBy({
        by:      ["productId"],
        _sum:    { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take:    5,
      }),
      // Stock faible
      db.product.findMany({
        where:   { stock: { lte: 15 }, active: true },
        orderBy: { stock: "asc" },
        take:    6,
        include: { collection: { select: { name: true } } },
      }),
    ]);

    // Calcul deltas
    const revenueTotal = totalRevenue._sum.total || 0;
    const revenueLastMonth = totalRevenueLastMonth._sum.total || 1;
    const revenueDelta = revenueLastMonth
      ? Math.round(((revenueTotal - revenueLastMonth) / revenueLastMonth) * 100)
      : 0;

    // Top products avec noms
    const topProductIds = topProducts.map((p: any) => p.productId);
    const topProductDetails = await db.product.findMany({
      where:   { id: { in: topProductIds } },
      include: { collection: { select: { name: true } } },
    });
    const topProductsWithDetails = topProducts.map((p: any) => ({
      ...p,
      product: topProductDetails.find((d: any) => d.id === p.productId),
    }));

    return NextResponse.json({
      stats: {
        revenue:       revenueTotal,
        revenueDelta,
        orders:        totalOrders,
        ordersDelta:   totalOrders - totalOrdersLastMonth,
        users:         totalUsers,
        usersDelta:    totalUsers - totalUsersLastMonth,
        products:      totalProducts,
        pendingOrders,
      },
      recentOrders,
      recentLogs,
      topProducts: topProductsWithDetails,
      lowStockProducts,
    });
  } catch (error) {
    console.error("[ADMIN STATS]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
