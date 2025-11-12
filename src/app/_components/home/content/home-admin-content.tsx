"use client";

import { BookOpen } from "lucide-react";
import { AdminCatalogTabs } from "./_components/admin-catalog-tabs";

export function HomeAdminContent() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto max-w-[1600px] px-8 py-8">
        <div className="mb-6 flex items-center gap-2">
          <BookOpen className="text-berkeley-blue h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">Catálogo</h1>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          Administra el catálogo de libros de la biblioteca
        </p>
        <div className="mt-6">
          <AdminCatalogTabs />
        </div>
      </main>
    </div>
  );
}
