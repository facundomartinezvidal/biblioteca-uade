"use client";

import BookCard from "~/app/_components/home/book-card";
import BookCardSkeleton from "~/app/_components/home/book-card-skeleton";

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

interface StudentBooksGridProps {
  books: Book[];
  isLoading: boolean;
  emptyMessage?: React.ReactNode;
  skeletonCount?: number;
  onReserve: (book: Book) => void;
  onViewMore: (book: Book) => void;
  isFavorite?: boolean;
}

export function StudentBooksGrid({
  books,
  isLoading,
  emptyMessage,
  skeletonCount = 6,
  onReserve,
  onViewMore,
  isFavorite = false,
}: StudentBooksGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {isLoading
        ? Array.from({ length: skeletonCount }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))
        : books.length > 0
          ? books.map((book) => (
              <BookCard
                key={book.id}
                title={book.title}
                authorFirstName={book.author ?? ""}
                authorMiddleName={book.authorMiddleName ?? ""}
                authorLastName={book.authorLastName ?? ""}
                editorial={book.editorial ?? ""}
                year={book.year ?? 0}
                category={book.gender ?? ""}
                description={book.description ?? ""}
                isbn={book.isbn ?? ""}
                location={book.location ?? ""}
                available={book.status === "AVAILABLE"}
                coverUrl={book.imageUrl}
                isFavorite={isFavorite}
                onReserve={() => onReserve(book)}
                onViewMore={() => onViewMore(book)}
              />
            ))
          : emptyMessage}
    </div>
  );
}
