"use client";

import PaginationControls from "~/app/_components/home/pagination-controls";
import { StudentBooksGrid } from "./student-books-grid";

interface Book {
  id: string;
  title: string;
  author?: string | null;
  authorMiddleName?: string | null;
  authorLastName?: string | null;
  editorial?: string | null;
  year?: number | null;
  gender?: string | null;
  description?: string | null;
  isbn?: string | null;
  location?: string | null;
  imageUrl?: string | null;
  status?: string | null;
}

interface Pagination {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface StudentBooksAllTabProps {
  books: Book[];
  isLoading: boolean;
  pagination?: Pagination;
  onReserve: (book: Book) => void;
  onViewMore: (book: Book) => void;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

export function StudentBooksAllTab({
  books,
  isLoading,
  pagination,
  onReserve,
  onViewMore,
  onPageChange,
  onClearFilters,
}: StudentBooksAllTabProps) {
  const emptyMessage = (
    <div className="col-span-2 py-12 text-center">
      <p className="text-lg text-gray-500">
        No se encontraron libros que coincidan con los filtros.
      </p>
      <button
        onClick={onClearFilters}
        className="text-berkeley-blue mt-4 hover:underline"
      >
        Limpiar filtros
      </button>
    </div>
  );

  return (
    <div>
      <StudentBooksGrid
        books={books}
        isLoading={isLoading}
        emptyMessage={emptyMessage}
        onReserve={onReserve}
        onViewMore={onViewMore}
      />

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <PaginationControls
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
        />
      )}
    </div>
  );
}
