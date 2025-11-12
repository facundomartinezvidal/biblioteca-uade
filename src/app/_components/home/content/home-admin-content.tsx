"use client";

import { BookOpen } from "lucide-react";
import { AdminCatalogTabs } from "./_components/admin-catalog-tabs";

export function HomeAdminContent() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-8 py-8">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="text-berkeley-blue h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">Catálogo</h1>
        </div>
        <AdminCatalogTabs />
      </main>
    </div>
  );
}
