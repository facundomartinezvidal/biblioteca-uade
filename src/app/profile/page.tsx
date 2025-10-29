"use client";

import { api } from "~/trpc/react";
import { ProfileHeader } from "./_components/profile-header";
import { StatsGrid } from "./_components/stats-grid";
import { LoansTable } from "./_components/loans-table";
import { ComingSoon } from "../_components/coming-soon";
import { Settings } from "lucide-react";
import { ProfileHeaderSkeleton } from "./_components/profile-header-skeleton";
import { StatsGridSkeleton } from "./_components/stats-grid-skeleton";
import { LoansTableSkeleton } from "./_components/loans-table-skeleton";

const mockActiveLoans = [
  {
    id: "1",
    bookId: "1",
    status: "ACTIVE",
    fromDate: "2024-08-13T00:00:00.000Z",
    toDate: "2024-08-16T00:00:00.000Z",
    book: {
      id: "1",
      title: "Ciudad de los Perros",
      author: "Mario Vargas Llosa",
      isbn: "978-84-322-0002-4",
      imageUrl: "/covers/ciudad-perros.jpg",
    },
  },
  {
    id: "2",
    bookId: "2",
    status: "ACTIVE",
    fromDate: "2024-08-13T00:00:00.000Z",
    toDate: "2024-08-16T00:00:00.000Z",
    book: {
      id: "2",
      title: "Cien Años de Soledad",
      author: "Gabriel García Márquez",
      isbn: "978-84-376-0494-7",
      imageUrl: "/covers/cien-anos-soledad.jpg",
    },
  },
  {
    id: "3",
    bookId: "3",
    status: "ACTIVE",
    fromDate: "2024-08-13T00:00:00.000Z",
    toDate: "2024-08-16T00:00:00.000Z",
    book: {
      id: "3",
      title: "El Laberinto de la Soledad",
      author: "Octavio Paz",
      isbn: "9780140399103",
      imageUrl: "/covers/el-laberinto-soledad.jpg",
    },
  },
  {
    id: "4",
    bookId: "4",
    status: "ACTIVE",
    fromDate: "2024-08-13T00:00:00.000Z",
    toDate: "2024-08-16T00:00:00.000Z",
    book: {
      id: "4",
      title: "Rayuela",
      author: "Julio Cortázar",
      isbn: "978-84-376-0313-1",
      imageUrl: "/covers/rayuela.jpeg",
    },
  },
];

export default function ProfilePage() {
  const { data: user, isLoading } = api.user.getUser.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-8 py-8">
          <div className="flex flex-col gap-6">
            <ProfileHeaderSkeleton />
            <StatsGridSkeleton />
            <div className="flex flex-col gap-4">
              <div className="h-6 w-48 animate-pulse rounded-md bg-gray-200" />
              <LoansTableSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-8 py-8">
        <div className="flex flex-col gap-6">
          <ProfileHeader
            name={user?.name ?? ""}
            last_name={user?.last_name ?? ""}
            institutional_email={user?.institutional_email ?? ""}
            personal_email={user?.personal_email ?? ""}
            phone={user?.phone ?? ""}
            identity_card={user?.identity_card ?? ""}
            legacy_number={user?.legacy_number ?? ""}
            role={user?.role ?? ""}
          />

          {user?.role === "admin" && (
            <div className="flex items-center justify-center py-12">
              <ComingSoon
                title="Dashboard de administrador"
                description="Estamos trabajando en esta sección. Pronto podrás ver estadísticas y gestionar el sistema desde aquí."
                icon={<Settings className="h-6 w-6" />}
              />
            </div>
          )}

          {user?.role === "estudiante" && <StatsGrid />}
          {user?.role === "estudiante" && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Préstamos activos
              </h2>
              <LoansTable loans={mockActiveLoans} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
