"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, Loader2, LogOut, UserStarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { Separator } from "~/components/ui/separator";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";
import { supabase } from "~/lib/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { useUser } from "~/lib/contexts";
import { NotificationsPopover } from "./notifications-popover";

export default function AppNavbar() {
  const pathname = usePathname();
  const [isLoadingLogout, setIsLoadingLogout] = useState(false);
  const router = useRouter();
  const { user, isLoading: isLoadingUser, isAuthenticated } = useUser();

  let navLinks: { href: string; label: string }[] = [];
  if (user?.rol === "admin") {
    navLinks = [
      { href: routes.home, label: "Libros" },
      { href: routes.users, label: "Usuarios" },
      { href: routes.profile, label: "Perfil" },
    ];
  } else if (user?.rol === "estudiante") {
    navLinks = [
      { href: routes.home, label: "Inicio" },
      { href: routes.loans, label: "Préstamos" },
      { href: routes.penalties, label: "Multas" },
      { href: routes.profile, label: "Perfil" },
    ];
  }

  const handleLogout = async () => {
    try {
      setIsLoadingLogout(true);
      await supabase.auth.signOut();
      toast.success("Sesión cerrada exitosamente");
      router.push("/auth/login");
    } catch (error) {
      toast.error((error as Error).message ?? "Error al cerrar sesión");
    }
    toast.success("Sesión cerrada exitosamente");
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-berkeley-blue border-b border-white/10 px-6 py-2 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href={routes.home}
            className="flex items-center transition-opacity hover:opacity-80"
          >
            <div className="relative flex h-8 w-20 items-center overflow-visible">
              <Image
                src="/favicon.png"
                alt="UADE Logo"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
          </Link>

          <Separator orientation="vertical" className="h-6 bg-white/20" />

          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {isLoadingUser ? (
                <>
                  <Skeleton className="h-8 w-20 animate-pulse rounded-md opacity-30" />
                  <Skeleton className="h-8 w-24 animate-pulse rounded-md opacity-30" />
                  <Skeleton className="h-8 w-20 animate-pulse rounded-md opacity-30" />
                </>
              ) : (
                navLinks.map((link) => {
                  return (
                    <NavigationMenuItem key={link.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={link.href}
                          className={cn(
                            "group inline-flex h-8 w-max items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                            isActive(link.href)
                              ? "bg-white/20 text-white"
                              : "text-white/70",
                          )}
                        >
                          {link.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-12 items-center justify-center overflow-visible">
            <Image
              src="/booky.png"
              alt="Booky mascot"
              width={60}
              height={60}
              className="object-contain"
            />
          </div>

          <Separator orientation="vertical" className="h-8 bg-white/20" />

          <div className="flex items-center gap-2">
            {isLoadingUser ? (
              <>
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </>
            ) : isAuthenticated && user ? (
              <>
                <Avatar className="h-8 w-8 border-white/20">
                  <AvatarImage
                    src="/fmartinezvidal-profile.jpeg"
                    alt={`${user.name} ${user.last_name}`}
                  />
                  <AvatarFallback className="bg-white/20 text-xs font-semibold">
                    {user.name?.[0]}
                    {user.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium leading-none">
                    {user.name} {user.last_name}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="w-fit bg-white/20 px-1.5 py-0 text-sm text-white hover:bg-white/30"
                >
                  {user.rol === "admin" && (
                    <>
                      <UserStarIcon className="h-4 w-4" />
                      Administrador
                    </>
                  )}
                  {user.rol === "estudiante" && (
                    <>
                      <GraduationCap className="h-4 w-4" />
                      Estudiante
                    </>
                  )}
                </Badge>
              </>
            ) : (
              <>
                <Skeleton className="h-8 w-8 animate-pulse rounded-full opacity-30" />
                <Skeleton className="h-4 w-32 animate-pulse opacity-30" />
                <Skeleton className="h-6 w-20 animate-pulse rounded-full opacity-30" />
              </>
            )}
          </div>

          <Separator orientation="vertical" className="h-8 bg-white/20" />

          <div className="flex items-center gap-1">
            {user?.rol === "estudiante" && <NotificationsPopover />}
            {/* {user?.rol === "estudiante" && <CalendarPopover />} */}

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md text-white hover:bg-white/10 hover:text-white"
              onClick={handleLogout}
              disabled={isLoadingLogout}
            >
              {isLoadingLogout ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
