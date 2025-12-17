"use client";

import { BookOpen } from "lucide-react";
import { AdminCatalogTabs } from "./_components/admin-catalog-tabs";

export function HomeAdminContent() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto max-w-[1600px] px-8 py-8">
        <AdminCatalogTabs />
      </main>
    </div>
  );
}
