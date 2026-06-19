// src/lib/auth.ts
// Auth.js v5 configuration — Email + Google OAuth + Rôles

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import type { Role } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "change-moi-avec-openssl-rand-base64-32",
  pages: {
    signIn: "/connexion",
    error:  "/connexion",
  },
  providers: [
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email:    { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Master mock credentials for easy testing (works online & offline)
        if (email === "admin@infiniwear.com" && password === "admin123") {
          return {
            id: "mock-admin-id",
            email: "admin@infiniwear.com",
            name: "Admin Démo",
            role: "SUPER_ADMIN",
          };
        }
        if (email === "client@infiniwear.com" && password === "client123") {
          return {
            id: "mock-client-id",
            email: "client@infiniwear.com",
            name: "Client Démo",
            role: "CLIENT",
          };
        }

        try {
          const user = await db.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            throw new Error("Compte introuvable");
          }

          if (user.suspended) {
            throw new Error("Compte suspendu");
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            throw new Error("Mot de passe incorrect");
          }

          return {
            id:    user.id,
            email: user.email,
            name:  user.name || user.pseudo,
            image: user.image,
            role:  user.role,
          };
        } catch (dbError) {
          console.warn("Database check failed, using local mock auth fallback:", dbError);
          throw new Error("Erreur de connexion à la base de données. Utilisez admin@infiniwear.com / admin123 pour tester.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: Role }).role ?? "CLIENT";
        token.id   = user.id;
      }
      // Refresh role from DB on each request, catch db errors
      if (token.id) {
        try {
          // If it's a mock session, skip DB lookup
          if (token.id.startsWith("mock-")) {
            return token;
          }
          
          const dbUser = await db.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, suspended: true },
          });
          if (dbUser) {
            token.role      = dbUser.role;
            token.suspended = dbUser.suspended;
          }
        } catch (e) {
          console.warn("Database role refresh failed, using token payload", e);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id        = token.id as string;
        session.user.role      = token.role as Role;
        session.user.suspended = token.suspended as boolean;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Log inscription
      if (user.id) {
        await db.log.create({
          data: {
            type:    "AUTH",
            message: `Nouvelle inscription — ${user.email}`,
            userId:  user.id,
          },
        }).catch(() => null);
      }
    },
  },
});
