// src/app/produit/[slug]/page.tsx
// Fiche produit éditoriale - Server Component

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ProductDetailsClient from "@/components/products/ProductDetailsClient";
import { mockProducts } from "@/lib/mockProducts";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// Résolution dynamique de la route
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    const product = await db.product.findUnique({
      where: { slug },
      include: { collection: true, category: true },
    });
    return product;
  } catch (error) {
    console.warn(`Prisma error fetching product ${slug}, trying mock catalog fallback:`, error);
    const mock = mockProducts.find((p) => p.slug === slug);
    if (mock) {
      return {
        id: mock.id,
        name: mock.name,
        slug: mock.slug,
        description: mock.description,
        price: mock.price,
        images: mock.images,
        sizes: mock.sizes,
        stock: mock.stock,
        active: mock.active,
        featured: mock.featured,
        collectionId: mock.collectionId,
        collection: { name: mock.collection.name },
        category: mock.category ? { name: mock.category.name } : null
      };
    }
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    return {
      title: "Produit non trouvé",
      description: "L'article demandé n'est pas disponible.",
    };
  }

  return {
    title: `${product.name}`,
    description: product.description || "Découvrez cet article exclusif InfiniWear. No Limit Just Style.",
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  const session = await auth();

  if (!product) {
    notFound();
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* Navbar */}
      <Navbar />

      <main style={{ padding: "120px 24px 80px", maxWidth: "1440px", margin: "0 auto" }}>
        <ProductDetailsClient product={product} userSession={session} />
      </main>
    </div>
  );
}
