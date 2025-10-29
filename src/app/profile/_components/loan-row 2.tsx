import Image from "next/image";
import { TableCell, TableRow } from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { formatDate } from "../_lib/format-utils";

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

interface LoanRowProps {
  loan: Loan;
}

export function LoanRow({ loan }: LoanRowProps) {
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
            <p className="truncate text-sm text-gray-600">{loan.book.author}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm text-gray-600">{loan.book.isbn}</TableCell>
      <TableCell className="text-sm text-gray-600">
        {formatDate(loan.fromDate)}
      </TableCell>
      <TableCell className="text-gray-600">{formatDate(loan.toDate)}</TableCell>
      <TableCell>
        <Badge className="bg-berkeley-blue border-0 text-sm font-medium text-white">
          Activo
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm">
            Ver más
          </Button>
          <Button variant="destructive" size="sm">
            Cancelar
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
