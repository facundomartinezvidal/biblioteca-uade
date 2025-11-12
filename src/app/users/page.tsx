"use client";

import { Users, Search, MoreHorizontal, Eye, AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Card, CardContent } from "~/components/ui/card";
import { useState } from "react";
import PaginationControls from "../_components/home/pagination-controls";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import UsersTableSkeleton from "./_components/users-table-skeleton";

type Student = {
  id: string;
  nombre: string;
  apellido: string;
  correo_institucional: string;
  correo_personal: string;
  dni: string;
  legajo: string;
  telefono_personal: string;
  status: boolean;
};

export default function UsersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const { data, isLoading } = api.user.getAllStudents.useQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const results = data?.results ?? [];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 300);
  };

  const handleViewLoans = (userId: string) => {
    router.push(`/loans/${userId}`);
  };

  const handleViewPenalties = (userId: string) => {
    router.push(`/penalties/${userId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-8 py-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
          </div>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          Gestión de usuarios con rol de estudiante
        </p>

        <div className="mt-6 mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Buscar por nombre, apellido, legajo, correo, DNI..."
              className="pl-10"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <UsersTableSkeleton />
        ) : (
          <Card className="shadow-sm">
            <CardContent className="px-6 py-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre Completo</TableHead>
                      <TableHead>Legajo</TableHead>
                      <TableHead>Correo Institucional</TableHead>
                      <TableHead>DNI</TableHead>
                      <TableHead className="w-[80px] text-right">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                    {results.length > 0 ? (
                      /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
                      results.map((student: Student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <p className="text-sm font-medium text-gray-900">
                              {student.nombre} {student.apellido}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-600">
                              {student.legajo}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-600">
                              {student.correo_institucional}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-600">
                              {student.dni}
                            </p>
                          </TableCell>
                          <TableCell className="w-[80px] text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Abrir menú</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleViewLoans(student.id)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver Préstamos
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleViewPenalties(student.id)}
                                >
                                  <AlertCircle className="mr-2 h-4 w-4" />
                                  Ver Multas
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-8 text-center text-gray-500"
                        >
                          No se encontraron estudiantes
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        <PaginationControls
          className="mt-6"
          currentPage={page}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onPageChange={(p) => {
            if (p >= 1 && p <= totalPages) setPage(p);
          }}
        />
      </main>
    </div>
  );
}
