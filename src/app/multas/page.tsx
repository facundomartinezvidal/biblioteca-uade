"use client";

import { AlertCircle, AlertTriangle, Search } from "lucide-react";
import { useState } from "react";
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
import PenaltyDetailsModal from "~/app/_components/penalty-details-modal";
import PaginationControls from "../_components/home/pagination-controls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

// Local types for mock penalties
type PenaltyStatus = "PAID" | "PENDING" | "RESERVED";
type PenaltyItem = {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    isbn: string;
    imageUrl: string;
    gender: string;
  };
  status: PenaltyStatus;
  fromDate: string;
  toDate: string;
  amount: number;
};

// Mock penalties (UI-only)
const mockPenalties: PenaltyItem[] = [
  {
    id: "p1",
    book: {
      id: "b1",
      title: "Cien años de soledad",
      author: "Gabriel José García Márquez",
      isbn: "",
      imageUrl: "/covers/cien-anos-soledad.jpg",
      gender: "Ficción",
    },
    status: "PENDING",
    fromDate: "2024-02-01T00:00:00.000Z",
    toDate: "2024-02-08T00:00:00.000Z",
    amount: 500,
  },
  {
    id: "p2",
    book: {
      id: "b2",
      title: "La ciudad y los perros",
      author: "Mario Vargas Llosa",
      isbn: "",
      imageUrl: "/covers/ciudad-perros.jpg",
      gender: "Ficción",
    },
    status: "PAID",
    fromDate: "2024-01-10T00:00:00.000Z",
    toDate: "2024-01-15T00:00:00.000Z",
    amount: 300,
  },
  {
    id: "p3",
    book: {
      id: "b3",
      title: "Rayuela",
      author: "Julio Cortázar",
      isbn: "",
      imageUrl: "/covers/rayuela.jpeg",
      gender: "Ficción",
    },
    status: "RESERVED",
    fromDate: "2024-03-01T00:00:00.000Z",
    toDate: "2024-03-04T00:00:00.000Z",
    amount: 200,
  },
];

const getStatusBadge = (status: PenaltyStatus) => {
  switch (status) {
    case "PAID":
      return (
        <Badge className="bg-berkeley-blue/10 text-berkeley-blue border-0 text-sm">
          Pagada
        </Badge>
      );
    case "PENDING":
      return (
        <Badge className="border-0 bg-red-100 text-sm text-red-800">
          Pendiente
        </Badge>
      );
    case "RESERVED":
      return (
        <Badge className="bg-berkeley-blue border-0 text-sm text-white">
          Reservado
        </Badge>
      );
    default:
      return <Badge variant="secondary">Desconocido</Badge>;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function PenaltiesPage() {
  // Pagination state (UI mock)
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Filters and search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PenaltyStatus>(
    "all",
  );

  // Modal state
  const [selectedPenalty, setSelectedPenalty] = useState<PenaltyItem | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data and pagination derived values
  const results = mockPenalties;
  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  // Apply simple client-side filters
  const displayedResults = results.filter((p) => {
    const matchesStatus =
      statusFilter === "all" ? true : p.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch = q
      ? p.book.title.toLowerCase().includes(q) ||
        p.book.author.toLowerCase().includes(q) ||
        (p.book.isbn ?? "").toLowerCase().includes(q)
      : true;
    return matchesStatus && matchesSearch;
  });

  const handleViewMore = (p: PenaltyItem) => {
    setSelectedPenalty(p);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPenalty(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Multas y Sanciones
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          Visualizá tus multas y sanciones. Podés filtrar y buscar por libro o
          estado.
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
              onValueChange={(v) => setStatusFilter(v as "all" | PenaltyStatus)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="PAID">Pagada</SelectItem>
                <SelectItem value="RESERVED">Reservado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Penalties Table (styled like loans) */}
        <Card className="shadow-sm">
          <CardContent className="px-6 py-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Libro</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="min-w-[120px]">Desde</TableHead>
                    <TableHead className="min-w-[120px]">Hasta</TableHead>
                    <TableHead className="min-w-[120px]">Monto</TableHead>
                    <TableHead className="w-[240px] text-center">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedResults.length > 0 ? (
                    displayedResults.map((penalty) => (
                      <TableRow key={penalty.id}>
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
                                    const target = e.target as HTMLImageElement;
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
                                {penalty.book.author}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>{getStatusBadge(penalty.status)}</TableCell>

                        <TableCell className="text-sm text-gray-600">
                          {formatDate(penalty.fromDate)}
                        </TableCell>

                        <TableCell className="text-sm text-gray-600">
                          {formatDate(penalty.toDate)}
                        </TableCell>

                        <TableCell className="text-sm text-gray-600">
                          ${penalty.amount}
                        </TableCell>

                        <TableCell className="w-[240px] text-right">
                          <div className="ml-auto flex w-[240px] items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-24"
                              onClick={() => handleViewMore(penalty)}
                            >
                              Ver Más
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-berkeley-blue w-28 text-white"
                            >
                              Pagar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-8 text-center text-gray-500"
                      >
                        No se encontraron multas
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Pagination */}
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

      {/* Penalty details modal */}
      {selectedPenalty && (
        <PenaltyDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          penalty={{
            id: selectedPenalty.id,
            bookId: selectedPenalty.book.id,
            status: selectedPenalty.status,
            fromDate: selectedPenalty.fromDate,
            toDate: selectedPenalty.toDate,
            amount: selectedPenalty.amount,
          }}
          book={{
            id: selectedPenalty.book.id,
            title: selectedPenalty.book.title,
            author: selectedPenalty.book.author,
            isbn: selectedPenalty.book.isbn ?? "",
            gender: selectedPenalty.book.gender ?? "Desconocido",
            imageUrl: selectedPenalty.book.imageUrl ?? "",
          }}
        />
      )}
    </div>
  );
}
