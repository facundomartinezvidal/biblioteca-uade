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
  locationCampus?: string | null;
  imageUrl?: string | null;
  status?: string | null;
}

interface StudentBooksGridProps {
  books: Book[];
  isLoading: boolean;
  emptyMessage?: React.ReactNode;
  skeletonCount?: number;
  onReserve: (book: Book) => void;
  reserveLoadingIds: Set<string>;
  onViewMore: (book: Book) => void;
  favoriteIds?: string[];
  onToggleFavorite?: (bookId: string) => void;
  favoriteLoadingIds?: Set<string>;
  userReservedBookIds?: string[];
  userActiveBookIds?: string[];
}

export function StudentBooksGrid({
  books,
  isLoading,
  emptyMessage,
  skeletonCount = 6,
  onReserve,
  reserveLoadingIds,
  onViewMore,
  favoriteIds = [],
  onToggleFavorite,
  favoriteLoadingIds,
  userReservedBookIds = [],
  userActiveBookIds = [],
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
                locationCampus={book.locationCampus ?? undefined}
                available={book.status === "AVAILABLE"}
                status={
                  book.status as
                    | "AVAILABLE"
                    | "NOT_AVAILABLE"
                    | "RESERVED"
                    | undefined
                }
                isReservedByCurrentUser={userReservedBookIds.includes(book.id)}
                isActiveByCurrentUser={userActiveBookIds.includes(book.id)}
                coverUrl={book.imageUrl}
                isFavorite={favoriteIds.includes(book.id)}
                isLoadingFavorite={favoriteLoadingIds?.has(book.id) ?? false}
                isLoadingReserve={reserveLoadingIds.has(book.id)}
                onReserve={() => onReserve(book)}
                onViewMore={() => onViewMore(book)}
                onToggleFavorite={
                  onToggleFavorite ? () => onToggleFavorite(book.id) : undefined
                }
              />
            ))
          : emptyMessage}
    </div>
  );
}
