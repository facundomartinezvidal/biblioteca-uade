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
}

export function StudentBooksFavoritesTab({
  books,
  isLoading,
  onReserve,
  onViewMore,
}: StudentBooksFavoritesTabProps) {
  const emptyMessage = (
    <div className="col-span-2 flex items-center justify-center py-12">
      <ComingSoon
        icon={<Clock className="h-6 w-6" />}
        title="Favoritos"
        subtitle="Próximamente"
        description="Podrás marcar libros como favoritos y acceder rápidamente a tus lecturas preferidas desde aquí."
      />
    </div>
  );

  return (
    <StudentBooksGrid
      books={books}
      isLoading={isLoading}
      emptyMessage={emptyMessage}
      skeletonCount={4}
      isFavorite
      onReserve={onReserve}
      onViewMore={onViewMore}
    />
  );
}
