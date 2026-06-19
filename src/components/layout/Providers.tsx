// src/components/layout/Providers.tsx
// Wrapper client-side pour les providers (next-auth, etc.)

"use client";

import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
