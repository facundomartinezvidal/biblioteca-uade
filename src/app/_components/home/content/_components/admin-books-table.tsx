"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { AdminBookRow } from "./admin-book-row";

interface Book {
  id: string;
  title: string;
  description?: string | null;
  author?: string | null;
  authorMiddleName?: string | null;
  authorLastName?: string | null;
  authorId: string | null;
  isbn: string;
  year?: number | null;
  editorial?: string | null;
  editorialId: string | null;
  status: string;
  genderId: string | null;
  gender?: string | null;
  location?: string | null;
  locationId?: string | null;
  imageUrl?: string | null;
}

interface AdminBooksTableProps {
  books: Book[];
  isLoading: boolean;
  onDeleteSuccess?: () => void;
}

export function AdminBooksTable({
  books,
  isLoading,
  onDeleteSuccess,
}: AdminBooksTableProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="px-6 py-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Libro</TableHead>
                <TableHead>ISBN</TableHead>
                <TableHead>Año</TableHead>
                <TableHead>Editorial</TableHead>
                <TableHead>Género</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Skeleton rows while loading
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-16 w-12 rounded" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : books.length > 0 ? (
                books.map((book) => (
                  <AdminBookRow
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    description={book.description}
                    author={book.author}
                    authorMiddleName={book.authorMiddleName}
                    authorLastName={book.authorLastName}
                    authorId={book.authorId}
                    isbn={book.isbn}
                    year={book.year}
                    editorial={book.editorial}
                    editorialId={book.editorialId}
                    status={book.status}
                    genderId={book.genderId}
                    gender={book.gender}
                    location={book.location}
                    locationId={book.locationId}
                    imageUrl={book.imageUrl}
                    onDeleteSuccess={onDeleteSuccess}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-8 text-center text-gray-500"
                  >
                    No hay libros disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
