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
import { AdminBookRow } from "./admin-book-row";

interface Book {
  id: string;
  title: string;
  description?: string | null;
  author?: string | null;
  authorMiddleName?: string | null;
  authorLastName?: string | null;
  authorId: string;
  isbn: string;
  year?: number | null;
  editorial?: string | null;
  editorialId: string;
  status: string;
  genderId: string;
  gender?: string | null;
  location?: string | null;
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
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-gray-500"
                  >
                    Cargando libros...
                  </TableCell>
                </TableRow>
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
                    imageUrl={book.imageUrl}
                    onDeleteSuccess={onDeleteSuccess}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
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
