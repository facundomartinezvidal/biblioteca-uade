"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "~/lib/contexts/user-context";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  useEffect(() => {
    // Don't redirect if still loading or already on access-denied page
    if (isLoading || pathname === "/auth/access-denied") {
      return;
    }

    if (!user) {
      return;
    }

    const userRole = user.rol?.toUpperCase();
    const userSubrol = user.subrol?.toUpperCase();

    // Check if user is DOCENTE and redirect
    if (userRole === "DOCENTE") {
      router.push("/auth/access-denied");
      return;
    }

    // Check if user is ADMINISTRADOR but NOT BIBLIOTECARIO
    if (userRole === "ADMINISTRADOR" && userSubrol !== "BIBLIOTECARIO") {
      router.push("/auth/access-denied");
      return;
    }
  }, [user, isLoading, router, pathname]);

  // Show children regardless, the redirect will happen if needed
  return <>{children}</>;
}

