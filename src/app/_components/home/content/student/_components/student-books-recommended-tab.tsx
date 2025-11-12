"use client";

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

interface StudentBooksRecommendedTabProps {
  books: Book[];
  isLoading: boolean;
  onReserve: (book: Book) => void;
  onViewMore: (book: Book) => void;
  reserveLoadingIds?: Set<string>;
  favoriteIds?: string[];
  onToggleFavorite?: (bookId: string) => void;
  favoriteLoadingIds?: Set<string>;
  userReservedBookIds?: string[];
  userActiveBookIds?: string[];
}

export function StudentBooksRecommendedTab({
  books,
  isLoading,
  onReserve,
  onViewMore,
  reserveLoadingIds = new Set(),
  favoriteIds = [],
  onToggleFavorite,
  favoriteLoadingIds,
  userReservedBookIds = [],
  userActiveBookIds = [],
}: StudentBooksRecommendedTabProps) {
  const emptyMessage = (
    <div className="col-span-2 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
      <p className="font-medium text-foreground">
        Aún no hay recomendaciones personalizadas
      </p>
      <p className="mt-2">
        Explora la biblioteca y realiza préstamos para descubrir sugerencias
        alineadas con tus intereses.
      </p>
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
      userReservedBookIds={userReservedBookIds}
      userActiveBookIds={userActiveBookIds}
    />
  );
}
