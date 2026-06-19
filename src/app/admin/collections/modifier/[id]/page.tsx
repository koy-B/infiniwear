// src/app/admin/collections/modifier/[id]/page.tsx
// Page d'édition d'une collection — Style Monochrome

import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import EditCollectionForm from "@/components/admin/EditCollectionForm";

async function getCollection(id: string) {
  try {
    const col = await db.collection.findUnique({
      where: { id },
    });
    if (col) return col;
  } catch (error) {
    console.warn(`Database failed to load collection with id ${id}, attempting mock fallback:`, error);
  }

  // Fallback if DB query fails or collection not found
  const mockCollections = [
    {
      id: "col-normale",
      name: "Collection Normale",
      slug: "normale",
      description: "L'essence du streetwear contemporain. Des lignes architecturales, des cotons lourds et des finitions brutes méticuleuses.",
      coverImage: "/images/normale/IMG_2210.PNG",
      active: true,
    },
    {
      id: "col-feminine",
      name: "Collection Féminine",
      slug: "feminine",
      description: "L'harmonie parfaite du minimalisme et du luxe streetwear. Conçu pour sculpter des silhouettes affirmées sans limites.",
      coverImage: "/images/feminine/IMG_3413.JPG.jpeg",
      active: true,
    }
  ];

  const mockC = mockCollections.find((c) => c.id === id);
  if (mockC) return mockC;

  return null;
}

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/connexion?callbackUrl=/admin/collections");
  }

  if (!["SUPER_ADMIN", "SUPPORT_AGENT"].includes(session.user.role!)) {
    redirect("/");
  }

  const { id } = await params;
  const collection = await getCollection(id);

  if (!collection) {
    notFound();
  }

  return (
    <div style={{ padding: "32px", maxWidth: "1000px" }} className="animate-fade-up">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "28px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "20px" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
            MODIFIER LA COLLECTION
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Modifiez les informations de l'univers créatif ci-dessous.
          </div>
        </div>
        <div>
          <Link href="/admin/collections" style={{ display: "inline-flex", alignItems: "center", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffffff", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.2)", height: "36px" }}>
            ← Retour aux collections
          </Link>
        </div>
      </div>

      {/* Form Card */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", padding: "32px" }}>
        <EditCollectionForm collection={collection} />
      </div>
    </div>
  );
}
