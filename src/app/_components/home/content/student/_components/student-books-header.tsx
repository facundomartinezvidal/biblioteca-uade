"use client";

import { LibraryBig } from "lucide-react";

export function StudentBooksHeader() {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <LibraryBig className="h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Catálogo de Libros
          </h1>
        </div>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        Encontrá el libro que estás buscando de la forma más rápida
      </p>
    </div>
  );
}
