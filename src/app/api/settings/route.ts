import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import fs from "fs";
import path from "path";
import { z } from "zod";

const settingsSchema = z.object({
  whatsappNumber:   z.string().min(5),
  appName:          z.string().min(2),
  heroImage:        z.string().min(1),
  heroTitle:        z.string().min(1),
  heroSubtitle:     z.string().min(1),
  savoirFaireImage: z.string().min(1),
  savoirFaireTitle: z.string().min(1),
  savoirFaireDesc:  z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Validation échouée" }, { status: 400 });
    }

    const configPath = path.join(process.cwd(), "src", "lib", "homeConfig.json");
    await fs.promises.writeFile(configPath, JSON.stringify(parsed.data, null, 2), "utf-8");

    return NextResponse.json({ success: true, settings: parsed.data });
  } catch (error) {
    console.error("[SETTINGS ERROR]", error);
    return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 });
  }
}
