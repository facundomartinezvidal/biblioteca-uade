"use client";

import {
  AlertTriangle,
  Search,
  MoreHorizontal,
  Eye,
  DollarSign,
} from "lucide-react";
import { useState, useEffect } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Card, CardContent } from "~/components/ui/card";
import Image from "next/image";
import PaginationControls from "../_components/home/pagination-controls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import PenaltiesTableSkeleton from "./_components/penalties-table-skeleton";
import PenaltyDetailsPopup from "./_components/penalty-details-popup";
import PayPenaltyModal from "./_components/pay-penalty-modal";

type PenaltyItem = {
  id: string;
  userId: string | null;
  loanId: string | null;
  amount: string | null;
  paid: boolean | null;
  createdAt: Date | null;
  expiresIn: Date | null;
  loan: {
    id: string;
    endDate: string;
    status: string;
    createdAt: string;
  } | null;
  book: {
    id: string;
    title: string;
    description: string | null;
    isbn: string;
    status: string;
    year: number | null;
    imageUrl: string | null;
    createdAt: string;
    editorial: string;
  };
  author: {
    id: string;
    name: string;
    middleName: string | null;
    lastName: string;
    createdAt: string;
  } | null;
  gender: {
    id: string;
    name: string;
    createdAt: string;
  } | null;
  location: {
    id: string;
    address: string;
    campus: string;
  } | null;
};

const getStatusBadge = (paid: boolean | null) => {
  if (paid) {
    return (
      <Badge className="bg-berkeley-blue/10 text-berkeley-blue border-0 text-sm">
        Pagada
      </Badge>
    );
  }
  return <Badge className="border-0 bg-red-600 text-sm">Pendiente</Badge>;
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

export default function PenaltiesPage() {
  const utils = api.useUtils();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [paidFilter, setPaidFilter] = useState<"all" | "paid" | "pending">(
    "all",
  );

  const [selectedPenalty, setSelectedPenalty] = useState<PenaltyItem | null>(
    null,
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [penaltyToPay, setPenaltyToPay] = useState<{
    id: string;
    title: string;
    amount: string;
  } | null>(null);

  const { data, isLoading, refetch } = api.penalties.getByUserId.useQuery({
    page,
    limit,
    paid:
      paidFilter === "all" ? undefined : paidFilter === "paid" ? true : false,
    search: search.trim() || undefined,
  });

  const markAsPaidMutation = api.penalties.markAsPaid.useMutation({
    onSuccess: async () => {
      await refetch();
      await Promise.all([
        utils.penalties.getByUserId.invalidate(),
        utils.penalties.getStats.invalidate(),
      ]);
      setIsPayModalOpen(false);
      setPenaltyToPay(null);
    },
  });

  const results = data?.results ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  // Reset page to 1 when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [search, paidFilter]);

  const handleViewMore = (penalty: PenaltyItem) => {
    setSelectedPenalty(penalty);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedPenalty(null);
  };

  const handleOpenPayModal = (
    penaltyId: string,
    bookTitle: string,
    amount: string,
  ) => {
    setPenaltyToPay({ id: penaltyId, title: bookTitle, amount });
    setIsPayModalOpen(true);
  };

  const handleConfirmPay = () => {
    if (penaltyToPay) {
      markAsPaidMutation.mutate({ penaltyId: penaltyToPay.id });
    }
  };

  const handlePayPenalty = (penaltyId: string) => {
    const penalty = results.find((p) => p.id === penaltyId);
    if (penalty) {
      handleOpenPayModal(penaltyId, penalty.book.title, penalty.amount ?? "0");
      setIsDetailsModalOpen(false);
    }
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
              value={paidFilter}
              onValueChange={(v) =>
                setPaidFilter(v as "all" | "paid" | "pending")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="paid">Pagada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Penalties Table (styled like loans) */}
        {isLoading ? (
          <PenaltiesTableSkeleton />
        ) : (
          <Card className="shadow-sm">
            <CardContent className="px-6 py-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Préstamo</TableHead>
                      <TableHead>Libro</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="min-w-[120px]">Creada</TableHead>
                      <TableHead className="min-w-[120px]">Vence</TableHead>
                      <TableHead className="min-w-[120px]">Monto</TableHead>
                      <TableHead className="w-[80px] text-right">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.length > 0 ? (
                      results.map((penalty) => {
                        const canPay = !penalty.paid;
                        const isPaying =
                          markAsPaidMutation.isPending &&
                          markAsPaidMutation.variables?.penaltyId ===
                            penalty.id;

                        return (
                          <TableRow key={penalty.id}>
                            <TableCell className="text-sm text-gray-600 font-mono">
                              {penalty.loanId ? penalty.loanId.slice(0, 8) + "..." : "N/A"}
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

                            <TableCell>
                              {getStatusBadge(penalty.paid)}
                            </TableCell>

                            <TableCell className="text-sm text-gray-600">
                              {formatDate(penalty.createdAt)}
                            </TableCell>

                            <TableCell className="text-sm text-gray-600">
                              {formatDate(penalty.expiresIn)}
                            </TableCell>

                            <TableCell className="text-sm text-gray-600">
                              ${penalty.amount ?? "0"}
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
                                    onClick={() => handleViewMore(penalty)}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver Más
                                  </DropdownMenuItem>
                                  {canPay && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleOpenPayModal(
                                          penalty.id,
                                          penalty.book.title,
                                          penalty.amount ?? "0",
                                        )
                                      }
                                      disabled={isPaying}
                                      className="text-blue-600"
                                    >
                                      {isPaying ? (
                                        <>
                                          <DollarSign className="mr-2 h-4 w-4 animate-pulse" />
                                          Procesando...
                                        </>
                                      ) : (
                                        <>
                                          <DollarSign className="mr-2 h-4 w-4" />
                                          Pagar ${penalty.amount ?? "0"}
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
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
        )}

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

      {/* Penalty details popup */}
      {selectedPenalty && (
        <PenaltyDetailsPopup
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          penalty={selectedPenalty}
          onPay={handlePayPenalty}
          isLoadingPay={markAsPaidMutation.isPending}
        />
      )}

      {/* Pay penalty confirmation modal */}
      {penaltyToPay && (
        <PayPenaltyModal
          isOpen={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
          onConfirm={handleConfirmPay}
          bookTitle={penaltyToPay.title}
          amount={penaltyToPay.amount}
          isLoading={markAsPaidMutation.isPending}
        />
      )}
    </div>
  );
}
