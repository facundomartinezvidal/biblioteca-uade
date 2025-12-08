"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Loader2, ShieldAlert } from "lucide-react";
import { logoutAction } from "~/app/auth/actions";
import { toast } from "sonner";
import Image from "next/image";

export default function AccessDeniedPage() {
  const [isLoadingLogout, setIsLoadingLogout] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoadingLogout(true);
      await logoutAction();
    } catch (error) {
      toast.error((error as Error).message ?? "Error al cerrar sesión");
      setIsLoadingLogout(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-950">
      <div className="mb-8">
        <Image
          src="/favicon.png"
          alt="UADE Logo"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>

      <Card className="w-full max-w-md border-red-200 dark:border-red-800">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Acceso No Autorizado
          </CardTitle>
          <CardDescription className="text-base">
            Lo sentimos, esta aplicación está disponible únicamente para
            alumnos y administradores.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
            <p className="font-medium">Perfil detectado: Docente</p>
            <p className="mt-2">
              Los docentes no tienen acceso a este portal. Si cree que esto es
              un error, por favor contacte al administrador del sistema.
            </p>
          </div>

          <Button
            onClick={handleLogout}
            disabled={isLoadingLogout}
            className="w-full bg-berkeley-blue hover:bg-berkeley-blue/90"
          >
            {isLoadingLogout ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cerrando sesión...
              </>
            ) : (
              "Cerrar sesión y volver"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

