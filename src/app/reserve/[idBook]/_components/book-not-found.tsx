"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";

export function BookNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Libro no encontrado
        </h1>
        <p className="mb-6 text-gray-600">
          El libro que buscas no está disponible.
        </p>
        <Button asChild>
          <Link href="/">Volver al Inicio</Link>
        </Button>
      </div>
    </div>
  );
}
