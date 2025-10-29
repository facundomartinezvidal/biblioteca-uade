"use client";

import { usePathname } from "next/navigation";
import AppNavbar from "./app-navbar";

export function NavbarWrapper() {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");

  if (isAuthRoute) return null;

  return <AppNavbar />;
}
