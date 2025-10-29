"use client";

import {
  History,
  Search,
  RefreshCw,
  Loader2,
  MoreHorizontal,
  Eye,
  X,
} from "lucide-react";
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
import { Skeleton } from "~/components/ui/skeleton";
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
import LoansTableSkeleton from "../_components/loans-table-skeleton";
import LoanDetailsPopup from "../_components/loan-details-popup";
import CancelReservationModal from "../_components/cancel-reservation-modal";

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
    description: string | null;
    isbn: string;
    status: string;
    year: number | null;
    editorial: string;
    imageUrl: string | null;
    createdAt: string;
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-berkeley-blue text-white";
    case "RESERVED":
      return "bg-berkeley-blue/10 text-berkeley-blue";
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function LoanUserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const utils = api.useUtils();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LoanStatus>("all");
  const [selectedLoan, setSelectedLoan] = useState<LoanItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [loanToCancel, setLoanToCancel] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [loadingReserveId, setLoadingReserveId] = useState<string | null>(null);

  const { data: studentData, isLoading: isLoadingStudent } =
    api.user.getStudentById.useQuery({ userId });

  const { data, isLoading, refetch } = api.loans.getByUserIdAdmin.useQuery({
    userId,
    page,
    limit,
    status: statusFilter === "all" ? undefined : statusFilter,
    search: search.trim() || undefined,
  });

  const cancelMutation = api.loans.cancelReservation.useMutation({
    onSuccess: async () => {
      await refetch();
      await Promise.all([
        utils.books.getAll.invalidate(),
        utils.books.getById.invalidate(),
        utils.loans.getByUserId.invalidate(),
        utils.loans.getActive.invalidate(),
        utils.loans.getStats.invalidate(),
      ]);
      setIsCancelModalOpen(false);
      setLoanToCancel(null);
    },
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

  const handleViewMore = (loan: LoanItem) => {
    setSelectedLoan(loan);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedLoan(null);
  };

  const handleOpenCancelModal = (loanId: string, bookTitle: string) => {
    setLoanToCancel({ id: loanId, title: bookTitle });
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (loanToCancel) {
      cancelMutation.mutate({ loanId: loanToCancel.id });
    }
  };

  const handleReserveAgain = (bookId: string) => {
    setLoadingReserveId(bookId);
    router.push(`/reserve/${bookId}`);
  };

  const studentName = studentData
    ? `${studentData.nombre} ${studentData.apellido}`
    : "";

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-8 py-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <History className="h-6 w-6" />
            {isLoadingStudent ? (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Préstamos de
                </h1>
                <Skeleton className="h-8 w-[200px]" />
              </div>
            ) : (
              <h1 className="text-2xl font-semibold tracking-tight">
                Préstamos de {studentName}
              </h1>
            )}
          </div>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          Historial completo de préstamos del estudiante
        </p>

        <div className="mt-6 mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Buscar por título, autor, etc..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              Filtrar por:
            </span>

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

        {isLoading ? (
          <LoansTableSkeleton />
        ) : (
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
                      <TableHead className="w-[80px] text-right">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.length > 0 ? (
                      results.map((loan: LoanItem) => {
                        const canCancel = loan.status === "RESERVED";
                        const canReserve =
                          loan.status === "FINISHED" ||
                          loan.status === "CANCELLED";
                        const isLoadingReserve =
                          loadingReserveId === loan.book.id;

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
                                    {loan.author
                                      ? `${loan.author.name} ${loan.author.middleName ?? ""} ${loan.author.lastName}`
                                      : "Autor desconocido"}
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

                            <TableCell className="w-[80px] text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Abrir menú</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleViewMore(loan)}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver Más
                                  </DropdownMenuItem>
                                  {canCancel && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleOpenCancelModal(
                                          loan.id,
                                          loan.book.title,
                                        )
                                      }
                                      className="text-red-600"
                                    >
                                      <X className="mr-2 h-4 w-4" />
                                      Cancelar Reserva
                                    </DropdownMenuItem>
                                  )}
                                  {canReserve && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleReserveAgain(loan.book.id)
                                      }
                                      disabled={isLoadingReserve}
                                    >
                                      {isLoadingReserve ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Reservando...
                                        </>
                                      ) : (
                                        <>
                                          <RefreshCw className="mr-2 h-4 w-4" />
                                          Reservar Nuevamente
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
                          colSpan={5}
                          className="py-8 text-center text-gray-500"
                        >
                          Este estudiante no tiene préstamos registrados
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

      {selectedLoan && (
        <LoanDetailsPopup
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          loan={selectedLoan}
          onCancel={(loanId) => {
            handleCloseDetailsModal();
            handleOpenCancelModal(loanId, selectedLoan.book.title);
          }}
          onReserve={handleReserveAgain}
          isLoadingCancel={cancelMutation.isPending}
          isLoadingReserve={loadingReserveId === selectedLoan.book.id}
        />
      )}

      {loanToCancel && (
        <CancelReservationModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          onConfirm={handleConfirmCancel}
          bookTitle={loanToCancel.title}
          isLoading={cancelMutation.isPending}
        />
      )}
    </div>
  );
}
