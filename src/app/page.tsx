"use client";

import { useUser } from "~/lib/contexts";
import { HomeAdminContent } from "./_components/home/content/home-admin-content";
import { HomeStudentContent } from "./_components/home/content/home-student-content";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { user, isLoading: isLoadingUser } = useUser();

  if (isLoadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-berkeley-blue h-10 w-10 animate-spin" />
      </div>
    );
  }

  return user?.rol === "admin" ? <HomeAdminContent /> : <HomeStudentContent />;
}
