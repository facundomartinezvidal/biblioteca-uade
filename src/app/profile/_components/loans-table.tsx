import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { LoanRow } from "./loan-row";

interface Loan {
  id: string;
  bookId: string;
  status: string;
  fromDate: string;
  toDate: string;
  book: {
    id: string;
    title: string;
    author: string;
    isbn: string;
    imageUrl: string;
  };
}

interface LoansTableProps {
  loans: Loan[];
}

export function LoansTable({ loans }: LoansTableProps) {
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
                  <TableHead className="min-w-[120px]">Desde</TableHead>
                  <TableHead className="min-w-[120px]">Hasta</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan) => (
                  <LoanRow key={loan.id} loan={loan} />
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
