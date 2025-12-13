"use client";

import { AlertTriangle, Search, ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardContent } from "~/components/ui/card";
import Image from "next/image";
import { useState, useEffect } from "react";
import PaginationControls from "../../_components/home/pagination-controls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import { useRouter, useParams } from "next/navigation";
import PenaltiesTableSkeleton from "../_components/penalties-table-skeleton";

const getStatusBadge = (status: "PENDING" | "PAID") => {
  if (status === "PAID") {
    return (
      <Badge className="bg-berkeley-blue/10 text-berkeley-blue border-0 text-sm">
        Pagada
      </Badge>
    );
  }
  return (
    <Badge className="border-0 bg-red-600 text-sm text-white">Pendiente</Badge>
  );
};

const formatDate = (dateString: string | Date | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function PenaltyUserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "PENDING" | "PAID"
  >("all");

  const { data: studentData, isLoading: isLoadingStudent } =
    api.user.getStudentById.useQuery({ userId });

  const { data, isLoading } = api.penalties.getByUserIdAdmin.useQuery({
    userId,
    page,
    limit,
    status: statusFilter === "all" ? undefined : statusFilter,
    search: search.trim() || undefined,
  });

  const results = data?.results ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  // Reset to first page when search or status filter changes
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-8 py-8">
        {/* Header with back button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/users")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Usuarios
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Multas y Sanciones de{" "}
              {isLoadingStudent
                ? "..."
                : `${studentData?.nombre ?? ""} ${studentData?.apellido ?? ""}`}
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          {isLoadingStudent
            ? "Cargando información del usuario..."
            : `Legajo: ${studentData?.legajo ?? "N/A"} | DNI: ${studentData?.dni ?? "N/A"}`}
        </p>

        {/* Search + Filters */}
        <div className="mt-6 mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Buscar por título, autor, etc..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              Filtrar por:
            </span>
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                setStatusFilter(v as "all" | "PENDING" | "PAID")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="PAID">Pagada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Penalties Table */}
        {isLoading ? (
          <PenaltiesTableSkeleton showActions={false} />
        ) : (
          <Card className="shadow-sm">
            <CardContent className="px-6 py-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Préstamo</TableHead>
                      <TableHead>Libro</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="min-w-[120px]">Creada</TableHead>
                      <TableHead className="min-w-[120px]">Vencimiento</TableHead>
                      <TableHead className="min-w-[120px]">Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.length > 0 ? (
                      results.map((penalty) => {
                        return (
                          <TableRow key={penalty.id}>
                            <TableCell className="font-mono text-sm text-gray-600">
                              {penalty.loanId
                                ? penalty.loanId.slice(0, 8) + "..."
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded bg-gray-200">
                                  {penalty.book.imageUrl ? (
                                    <Image
                                      src={penalty.book.imageUrl}
                                      alt={penalty.book.title}
                                      fill
                                      className="object-cover"
                                      onError={(e) => {
                                        const target =
                                          e.target as HTMLImageElement;
                                        target.style.display = "none";
                                      }}
                                    />
                                  ) : null}
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium text-gray-900">
                                    {penalty.book.title}
                                  </p>
                                  <p className="truncate text-sm text-gray-600">
                                    {penalty.author
                                      ? `${penalty.author.name} ${penalty.author.middleName ?? ""} ${penalty.author.lastName}`
                                      : "Autor desconocido"}
                                  </p>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="text-sm capitalize text-gray-700">
                              {penalty.parameter?.type ?? "Sin especificar"}
                            </TableCell>

                            <TableCell className="text-sm text-gray-700">
                              {penalty.parameter?.name ?? "Sin especificar"}
                            </TableCell>

                            <TableCell>
                              {getStatusBadge(penalty.status)}
                            </TableCell>

                            <TableCell className="text-sm text-gray-600">
                              {formatDate(penalty.createdAt)}
                            </TableCell>

                            <TableCell className="text-sm text-gray-600">
                              {(() => {
                                if (!penalty.createdAt) return "N/A";
                                const dueDate = new Date(penalty.createdAt);
                                dueDate.setDate(dueDate.getDate() + 14);
                                const isOverdue =
                                  new Date() > dueDate &&
                                  penalty.status === "PENDING";
                                return (
                                  <span
                                    className={
                                      isOverdue
                                        ? "font-medium text-red-600"
                                        : "text-gray-600"
                                    }
                                  >
                                    {formatDate(dueDate)}
                                  </span>
                                );
                              })()}
                            </TableCell>

                            <TableCell className="text-sm text-gray-600">
                              ${penalty.parameter?.amount ?? "0"}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="py-8 text-center text-gray-500"
                        >
                          {search || statusFilter !== "all"
                            ? "No se encontraron multas con los filtros aplicados"
                            : "Este usuario no tiene multas"}
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
