// src/types/next-auth.d.ts
// Extension des types Auth.js pour inclure le rôle et l'ID

import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id:         string;
      role:       Role;
      suspended:  boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?:      Role;
    suspended?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?:        string;
    role?:      Role;
    suspended?: boolean;
  }
}
