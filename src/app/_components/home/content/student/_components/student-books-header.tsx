"use client";

import { LibraryBig } from "lucide-react";

export function StudentBooksHeader() {
  return (
    <div className="flex items-center gap-3">
      <LibraryBig className="h-6 w-6" />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Catálogo de Libros
        </h1>
        <p className="text-muted-foreground text-sm">
          Encontrá el libro que estás buscando de la forma más rápida
        </p>
      </div>
    </div>
  );
}
