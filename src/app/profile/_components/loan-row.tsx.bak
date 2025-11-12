import Image from "next/image";
import { TableCell, TableRow } from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { formatDate } from "../_lib/format-utils";
import { MoreHorizontal, Eye, X, RefreshCw, Loader2 } from "lucide-react";

type LoanStatus = "RESERVED" | "ACTIVE" | "FINISHED" | "EXPIRED" | "CANCELLED";

interface Loan {
  id: string;
  userId: string;
  endDate: string;
  status: LoanStatus;
  createdAt: string;
  book: {
    id: string;
    title: string;
    description: string | null;
    isbn: string | null;
    status: string | null;
    year: number | null;
    imageUrl: string | null;
    createdAt: string;
    editorial: string;
  };
  author: {
    id: string;
    name: string;
    middleName: string | null;
    lastName: string | null;
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
  editorial: string | null;
}

interface LoanRowProps {
  loan: Loan;
  onViewMore: (loan: Loan) => void;
  onCancel: (loanId: string, bookTitle: string) => void;
  onReserve: (bookId: string) => void;
  isLoadingCancel: boolean;
  isLoadingReserve: boolean;
}

const getStatusInfo = (status: LoanStatus) => {
  switch (status) {
    case "RESERVED":
      return {
        label: "Reservado",
        className: "bg-berkeley-blue text-white border-0",
      };
    case "ACTIVE":
      return {
        label: "Activo",
        className: "bg-emerald-100 text-emerald-800 border-0",
      };
    case "FINISHED":
      return {
        label: "Finalizado",
        className: "bg-gray-100 text-gray-800 border-0",
      };
    case "EXPIRED":
      return {
        label: "Vencido",
        className: "bg-orange-100 text-orange-800 border-0",
      };
    case "CANCELLED":
      return {
        label: "Cancelado",
        className: "bg-rose-100 text-rose-800 border-0",
      };
  }
};

export function LoanRow({
  loan,
  onViewMore,
  onCancel,
  onReserve,
  isLoadingCancel,
  isLoadingReserve,
}: LoanRowProps) {
  const statusInfo = getStatusInfo(loan.status);
  const canCancel = loan.status === "RESERVED";
  const canReserve = loan.status === "FINISHED" || loan.status === "CANCELLED";

  const authorName = loan.author
    ? `${loan.author.name} ${loan.author.middleName ?? ""} ${loan.author.lastName ?? ""}`.trim()
    : "Autor desconocido";

  return (
    <TableRow>
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
                  const t = e.target as HTMLImageElement;
                  t.style.display = "none";
                }}
              />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">
              {loan.book.title}
            </p>
            <p className="truncate text-sm text-gray-600">{authorName}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm text-gray-600">
        {loan.book.isbn ?? "N/A"}
      </TableCell>
      <TableCell className="text-sm text-gray-600">
        {formatDate(loan.createdAt)}
      </TableCell>
      <TableCell className="text-gray-600">
        {formatDate(loan.endDate)}
      </TableCell>
      <TableCell>
        <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
      </TableCell>
      <TableCell className="w-[80px] text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewMore(loan)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver Más
            </DropdownMenuItem>
            {canCancel && (
              <DropdownMenuItem
                onClick={() => onCancel(loan.id, loan.book.title)}
                className="text-red-600"
                disabled={isLoadingCancel}
              >
                {isLoadingCancel ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelando...
                  </>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Cancelar Reserva
                  </>
                )}
              </DropdownMenuItem>
            )}
            {canReserve && (
              <DropdownMenuItem
                onClick={() => onReserve(loan.book.id)}
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
}
