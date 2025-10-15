"use client";

import { History, Search } from "lucide-react";
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
  TableHead as TableHeadCell,
} from "~/components/ui/table";
import { Card, CardContent } from "~/components/ui/card";
import Image from "next/image";
import LoanDetailsModal from "../_components/loan-details-modal";
import { useState } from "react";
import PaginationControls from "../_components/home/pagination-controls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

// Local type to mirror the shape expected by LoanDetailsModal
type LoanStatus = "ACTIVE" | "RESERVED" | "FINISHED" | "EXPIRED" | "CANCELLED";
type LoanItem = {
  id: string;
  userId: string;
  endDate: string;
  status: LoanStatus;
  createdAt: string;
  book: {
    id: string;
    title: string;
    description: string;
    isbn: string;
    status: string;
    year: number;
    editorial: string;
    imageUrl: string | null;
    createdAt: string;
  };
  author: {
    id: string;
    name: string;
    middleName: string;
    lastName: string;
    createdAt: string;
  };
  gender: {
    id: string;
    name: string;
    createdAt: string;
  };
  location: {
    id: string;
    address: string;
    campus: string;
    createdAt: string;
  };
};

// Function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-berkeley-blue text-white";
    case "RESERVED":
      return "bg-berkeley-blue/80 text-white";
    case "FINISHED":
      return "bg-gray-600 text-white";
    case "EXPIRED":
      return "bg-red-600 text-white";
    case "CANCELLED":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

// Function to get status text
const getStatusText = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "Activo";
    case "RESERVED":
      return "Reservado";
    case "FINISHED":
      return "Finalizado";
    case "EXPIRED":
      return "Vencido";
    case "CANCELLED":
      return "Cancelado";
    default:
      return status;
  }
};

type ButtonVariant =
  | "link"
  | "outline"
  | "destructive"
  | "default"
  | "secondary"
  | "ghost"
  | null
  | undefined;
type Action = { label: string; variant: ButtonVariant; className?: string };

// Function to get actions based on status
const getActions = (status: string): { primary: Action; secondary: Action } => {
  switch (status) {
    case "ACTIVE":
      return {
        primary: { label: "Ver Más", variant: "outline" as const },
        secondary: { label: "Cancelar", variant: "destructive" as const },
      };
    case "RESERVED":
      return {
        primary: { label: "Ver Más", variant: "outline" as const },
        secondary: { label: "Cancelar", variant: "destructive" as const },
      };
    case "FINISHED":
      return {
        primary: { label: "Ver Más", variant: "outline" as const },
        secondary: { label: "Renovar", variant: "default" as const },
      };
    case "EXPIRED":
    case "CANCELLED":
      return {
        primary: { label: "Ver Más", variant: "outline", className: undefined },
        secondary: {
          label: "Reservar ",
          variant: "default",
          className: "bg-berkeley-blue text-white",
        },
      };
    default:
      return {
        primary: { label: "Ver Más", variant: "outline" },
        secondary: { label: "Acción", variant: "default" },
      };
  }
};

// Function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function LoansPage() {
  // Pagination state (kept for UI mock behaviour)
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Mocked loan data for the UI mockup
  const mockLoans: LoanItem[] = [
    {
      id: "1",
      userId: "temp-user-id",
      endDate: "2024-02-14T00:00:00.000Z",
      status: "ACTIVE",
      createdAt: "2024-01-14T00:00:00.000Z",
      book: {
        id: "b1",
        title: "Cien años de soledad",
        description: "",
        isbn: "",
        status: "",
        year: 1967,
        editorial: "",
        imageUrl: "/covers/cien-anos-soledad.jpg",
        createdAt: "2023-01-01T00:00:00.000Z",
      },
      author: {
        id: "a1",
        name: "Gabriel",
        middleName: "José",
        lastName: "García Márquez",
        createdAt: "2023-01-01T00:00:00.000Z",
      },
      gender: {
        id: "g1",
        name: "Ficción",
        createdAt: "2023-01-01T00:00:00.000Z",
      },
      location: {
        id: "l1",
        address: "Av. Ejemplo 123",
        campus: "Central",
        createdAt: "2023-01-01T00:00:00.000Z",
      },
    },
    {
      id: "2",
      userId: "temp-user-id",
      endDate: "2024-02-19T00:00:00.000Z",
      status: "RESERVED",
      createdAt: "2024-01-19T00:00:00.000Z",
      book: {
        id: "b2",
        title: "La ciudad y los perros",
        description: "",
        isbn: "",
        status: "",
        year: 1963,
        editorial: "",
        imageUrl: "/covers/ciudad-perros.jpg",
        createdAt: "2023-01-01T00:00:00.000Z",
      },
      author: {
        id: "a2",
        name: "Mario",
        middleName: "",
        lastName: "Vargas Llosa",
        createdAt: "2023-01-01T00:00:00.000Z",
      },
      gender: {
        id: "g2",
        name: "Ficción",
        createdAt: "2023-01-01T00:00:00.000Z",
      },
      location: {
        id: "l1",
        address: "Av. Ejemplo 123",
        campus: "Central",
        createdAt: "2023-01-01T00:00:00.000Z",
      },
    },
    {
      id: "3",
      userId: "temp-user-id",
      endDate: "2024-01-09T00:00:00.000Z",
      status: "EXPIRED",
      createdAt: "2023-12-09T00:00:00.000Z",
      book: {
        id: "b3",
        title: "Rayuela",
        description: "",
        isbn: "",
        status: "",
        year: 1963,
        editorial: "",
        imageUrl: "/covers/rayuela.jpeg",
        createdAt: "2023-01-01T00:00:00.000Z",
      },
      author: {
        id: "a3",
        name: "Julio",
        middleName: "",
        lastName: "Cortázar",
        createdAt: "2023-01-01T00:00:00.000Z",
      },
      gender: {
        id: "g3",
        name: "Ficción",
        createdAt: "2023-01-01T00:00:00.000Z",
      },
      location: {
        id: "l1",
        address: "Av. Ejemplo 123",
        campus: "Central",
        createdAt: "2023-01-01T00:00:00.000Z",
      },
    },
  ];

  // State for modal
  const [selectedLoan, setSelectedLoan] = useState<LoanItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Filters & search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LoanStatus>("all");

  // Use mock results for the UI mockup
  const results = mockLoans;
  const total = mockLoans.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  // Apply client-side filters (current page only)
  const displayedResults = results.filter((loan) => {
    const matchesStatus =
      statusFilter === "all" ? true : loan.status === statusFilter;
    const query = search.trim().toLowerCase();
    const matchesSearch = query
      ? loan.book.title.toLowerCase().includes(query) ||
        `${loan.author.name} ${loan.author.middleName} ${loan.author.lastName}`
          .toLowerCase()
          .includes(query) ||
        (loan.book.isbn ?? "").toLowerCase().includes(query)
      : true;
    return matchesStatus && matchesSearch;
  });

  // Function to open modal
  const handleViewMore = (loan: LoanItem) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLoan(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <History className="h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Historial de Préstamos
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          Encontrá el libro que estás buscando de la forma más rápida
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

            {/* Status filter */}
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as LoanStatus | "all")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ACTIVE">Activo</SelectItem>
                <SelectItem value="RESERVED">Reservado</SelectItem>
                <SelectItem value="FINISHED">Finalizado</SelectItem>
                <SelectItem value="EXPIRED">Vencido</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loans Table (styled like profile table) */}
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
                    <TableHead className="w-[240px] text-center">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedResults.length > 0 ? (
                    displayedResults.map((loan) => {
                      const actions = getActions(loan.status);
                      const primaryClass = actions.primary.className ?? "";
                      const secondaryClass = actions.secondary.className ?? "";
                      return (
                        <TableRow key={loan.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded bg-gray-200">
                                {loan.book.imageUrl ? (
                                  <Image
                                    src={loan.book.imageUrl}
                                    alt={loan.book.title}
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
                                  {loan.book.title}
                                </p>
                                <p className="truncate text-sm text-gray-600">
                                  {loan.author.name} {loan.author.middleName}{" "}
                                  {loan.author.lastName}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge
                              className={`${getStatusColor(loan.status)} border-0 text-sm font-medium`}
                            >
                              {getStatusText(loan.status)}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-sm text-gray-600">
                            {formatDate(loan.createdAt)}
                          </TableCell>

                          <TableCell className="text-sm text-gray-600">
                            {formatDate(loan.endDate)}
                          </TableCell>

                          <TableCell className="w-[240px] text-right">
                            <div className="ml-auto flex w-[240px] items-center justify-end gap-2">
                              <Button
                                variant={actions.primary.variant}
                                size="sm"
                                className={`w-24 ${primaryClass}`}
                                onClick={() => handleViewMore(loan)}
                              >
                                {actions.primary.label}
                              </Button>
                              <Button
                                variant={actions.secondary.variant}
                                size="sm"
                                className={`w-28 ${secondaryClass}`}
                              >
                                {actions.secondary.label}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-8 text-center text-gray-500"
                      >
                        No tienes préstamos registrados
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

      {/* Loan details modal */}
      {selectedLoan && (
        <LoanDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          loan={selectedLoan}
        />
      )}
    </div>
  );
}
