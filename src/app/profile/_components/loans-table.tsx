"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { LoanRow } from "./loan-row";

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

interface LoansTableProps {
  loans: Loan[];
  onViewMore: (loan: Loan) => void;
  onCancel: (loanId: string, bookTitle: string) => void;
  onReserve: (bookId: string) => void;
  isLoadingCancel: boolean;
  isLoadingReserve: boolean;
}

export function LoansTable({
  loans,
  onViewMore,
  onCancel,
  onReserve,
  isLoadingCancel,
  isLoadingReserve,
}: LoansTableProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Préstamos actuales
          </h3>
          <Badge className="text-berkeley-blue border-0 bg-blue-100 text-sm">
            {loans.length} activos
          </Badge>
        </div>

        {loans.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Libro</TableHead>
                  <TableHead className="min-w-[120px]">ISBN</TableHead>
                  <TableHead className="min-w-[120px]">Fecha Reserva</TableHead>
                  <TableHead className="min-w-[120px]">Vencimiento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[80px] text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan) => (
                  <LoanRow
                    key={loan.id}
                    loan={loan}
                    onViewMore={onViewMore}
                    onCancel={onCancel}
                    onReserve={onReserve}
                    isLoadingCancel={isLoadingCancel}
                    isLoadingReserve={isLoadingReserve}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            No tienes préstamos activos
          </div>
        )}
      </CardContent>
    </Card>
  );
}
