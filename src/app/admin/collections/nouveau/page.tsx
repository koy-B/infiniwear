// src/app/admin/collections/nouveau/page.tsx
// Page d'ajout d'une collection — Style Monochrome

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import NewCollectionForm from "@/components/admin/NewCollectionForm";

export default async function NewCollectionPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/connexion?callbackUrl=/admin/collections/nouveau");
  }

  if (!["SUPER_ADMIN", "SUPPORT_AGENT"].includes(session.user.role!)) {
    redirect("/");
  }

  return (
    <div style={{ padding: "var(--admin-page-padding)", maxWidth: "1000px" }} className="animate-fade-up">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "28px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "20px" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
            AJOUTER UNE NOUVELLE COLLECTION
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Remplissez les informations ci-dessous pour ajouter un nouvel univers créatif à la boutique.
          </div>
        </div>
        <div>
          <Link href="/admin/collections" style={{ display: "inline-flex", alignItems: "center", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffffff", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.2)", height: "36px" }}>
            ← Retour aux collections
          </Link>
        </div>
      </div>

      {/* Form Card */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", padding: "var(--admin-page-padding)" }}>
        <NewCollectionForm />
      </div>
    </div>
  );
}
