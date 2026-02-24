"use client";

import { AuthProvider } from "@/contexts/auth-context";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
