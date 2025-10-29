"use client";

import { Clock } from "lucide-react";
import { ComingSoon } from "~/app/_components/coming-soon";
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

interface StudentBooksFavoritesTabProps {
  books: Book[];
  isLoading: boolean;
  onReserve: (book: Book) => void;
  onViewMore: (book: Book) => void;
  favoriteIds?: string[];
  onToggleFavorite?: (bookId: string) => void;
  favoriteLoadingIds?: Set<string>;
  reserveLoadingIds?: Set<string>;
}

export function StudentBooksFavoritesTab({
  books,
  isLoading,
  onReserve,
  onViewMore,
  favoriteIds = [],
  onToggleFavorite,
  favoriteLoadingIds,
  reserveLoadingIds = new Set(),
}: StudentBooksFavoritesTabProps) {
  const emptyMessage = (
    <div className="col-span-2 flex items-center justify-center py-12">
      <div className="text-center">
        <p className="text-lg text-gray-500">
          No tienes libros en favoritos aún.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Explora el catálogo y marca tus libros favoritos.
        </p>
      </div>
    </div>
  );

  return (
    <StudentBooksGrid
      books={books}
      isLoading={isLoading}
      emptyMessage={emptyMessage}
      skeletonCount={4}
      onReserve={onReserve}
      reserveLoadingIds={reserveLoadingIds}
      onViewMore={onViewMore}
      favoriteIds={favoriteIds}
      onToggleFavorite={onToggleFavorite}
      favoriteLoadingIds={favoriteLoadingIds}
    />
  );
}
