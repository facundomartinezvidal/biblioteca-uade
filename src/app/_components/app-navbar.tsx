"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, Calendar, GraduationCap, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { Separator } from "~/components/ui/separator";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";

export default function AppNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/prestamos", label: "Préstamos" },
    { href: "/multas", label: "Multas" },
    { href: "/perfil", label: "Perfil" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-berkeley-blue border-b border-white/10 px-8 py-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href={routes.home}
            className="flex items-center transition-opacity hover:opacity-80"
          >
            <div className="relative flex h-12 w-30 items-center overflow-visible">
              <Image
                src="/favicon.png"
                alt="UADE Logo"
                width={160}
                height={160}
                className="object-contain"
              />
            </div>
          </Link>

          <Separator orientation="vertical" className="h-8 bg-white/20" />

          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                          active ? "bg-white/20 text-white" : "text-white/70",
                        )}
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-16 items-center justify-center overflow-visible">
            <Image
              src="/booky.png"
              alt="Booky mascot"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>

          <Separator orientation="vertical" className="h-10 bg-white/20" />

          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white/20">
              <AvatarImage src="" alt="Eva Menendez" />
              <AvatarFallback className="bg-white/20 text-sm font-semibold">
                EM
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm leading-none font-medium">
                Eva Menendez
              </span>
              <Badge
                variant="secondary"
                className="w-fit bg-white/20 px-2 py-0 text-xs text-white hover:bg-white/30"
              >
                <GraduationCap className="h-4 w-4" />
                Estudiante
              </Badge>
            </div>
          </div>

          <Separator orientation="vertical" className="h-10 bg-white/20" />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-md text-white hover:bg-white/10 hover:text-white"
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-md text-white hover:bg-white/10 hover:text-white"
            >
              <Calendar className="h-5 w-5" />
              <span className="sr-only">Calendar</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-md text-white hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
