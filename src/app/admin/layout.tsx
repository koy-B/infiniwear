// src/app/admin/layout.tsx
// Layout de l'espace admin — sidebar + header

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import ResponsiveAdminLayout from "@/components/admin/ResponsiveAdminLayout";

export const metadata = {
  title: {
    default: "Admin | InfiniWear",
    template: "%s | Admin InfiniWear",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/connexion?callbackUrl=/admin");
  }

  if (!["SUPER_ADMIN", "SUPPORT_AGENT"].includes(session.user.role!)) {
    redirect("/");
  }

  return (
    <ResponsiveAdminLayout
      sidebar={<AdminSidebar user={session.user} />}
      header={<AdminHeader user={session.user} />}
    >
      {children}
    </ResponsiveAdminLayout>
  );
}
