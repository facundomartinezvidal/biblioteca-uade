"use client";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { CORE_FRONTEND_URL } from "~/lib/core-api";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Biblioteca UADE</CardTitle>
          <CardDescription>
            Inicia sesión a través del portal centralizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="bg-berkeley-blue hover:bg-berkeley-blue/90 w-full"
            onClick={() => (window.location.href = CORE_FRONTEND_URL)}
          >
            Ir al Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
