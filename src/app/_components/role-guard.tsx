"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "~/lib/contexts/user-context";
import { Loader2 } from "lucide-react";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Don't check if still loading or already on access-denied page
    if (isLoading) {
      return;
    }

    if (pathname === "/auth/access-denied") {
      setIsAuthorized(true);
      return;
    }

    if (!user) {
      setIsAuthorized(true);
      return;
    }

    const userRole = user.rol?.toUpperCase();
    const userSubrol = user.subrol?.toUpperCase();

    // Check if user is DOCENTE and redirect
    if (userRole === "DOCENTE") {
      router.push("/auth/access-denied?reason=docente");
      return;
    }

    // Check if user is ADMINISTRADOR but NOT BIBLIOTECARIO
    if (userRole === "ADMINISTRADOR" && userSubrol !== "BIBLIOTECARIO") {
      router.push("/auth/access-denied?reason=admin-no-bibliotecario");
      return;
    }

    // User is authorized
    setIsAuthorized(true);
  }, [user, isLoading, router, pathname]);

  // Show loading while checking authorization
  if (isLoading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return <>{children}</>;
}
