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
  isbn: string;
  location?: string | null;
  imageUrl?: string | null;
  status?: string | null;
}

interface RecommendedBooksSectionProps {
  books: Book[];
  isLoading: boolean;
  favoriteIds?: string[];
  favoriteLoadingIds: Set<string>;
  reserveLoadingIds: Set<string>;
  onReserve: (book: Book) => void;
  onToggleFavorite: (bookId: string) => void;
  onViewMore: (book: Book) => void;
}

export function RecommendedBooksSection({
  books,
  isLoading,
  favoriteIds = [],
  favoriteLoadingIds,
  reserveLoadingIds,
  onReserve,
  onToggleFavorite,
  onViewMore,
}: RecommendedBooksSectionProps) {
  return (
    <div className="mt-12">
      <h2 className="text-berkeley-blue mb-6 text-xl font-semibold">
        Podría interesarte...
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {books.map((book) => (
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
              isbn={book.isbn}
              location={book.location ?? ""}
              available={book.status === "AVAILABLE"}
              coverUrl={book.imageUrl}
              isFavorite={favoriteIds.includes(book.id)}
              isLoadingFavorite={favoriteLoadingIds.has(book.id)}
              isLoadingReserve={reserveLoadingIds.has(book.id)}
              onReserve={() => onReserve(book)}
              onToggleFavorite={() => onToggleFavorite(book.id)}
              onViewMore={() => onViewMore(book)}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500">
            No hay libros recomendados disponibles en este momento.
          </p>
        </div>
      )}
    </div>
  );
}
