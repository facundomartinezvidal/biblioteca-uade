"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import ReservationSuccessModal from "~/app/_components/reservation-success-modal";
import PopUpBook from "~/app/_components/home/pop-up-book";
import {
  BookInformationCard,
  ReservationDetailsCard,
  RecommendedBooksSection,
  BookNotFound,
  ReservePageSkeleton,
} from "./_components";

type BookSummary = {
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
};

export default function ReservePage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [reserveLoadingIds, setReserveLoadingIds] = useState<Set<string>>(
    new Set(),
  );
  const [favoriteLoadingIds, setFavoriteLoadingIds] = useState<Set<string>>(
    new Set(),
  );
  const [selectedBook, setSelectedBook] = useState<BookSummary | null>(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const params = useParams();
  const router = useRouter();
  const bookId = params.idBook as string;

  // Get book data from the API
  const { data: bookData, isLoading: bookLoading } = api.books.getById.useQuery(
    { id: bookId },
    { enabled: !!bookId },
  );

  // Get recommended books (excluding the current book)
  const { data: recommendedBooksData, isLoading: recommendedLoading } =
    api.books.getAll.useQuery({
      page: 1,
      limit: 10,
    });

  // Get favorites
  const { data: favoriteIds } = api.favorites.getFavoriteIds.useQuery();

  // Mutations for favorites
  const addFavoriteMutation = api.favorites.addFavorite.useMutation();
  const removeFavoriteMutation = api.favorites.removeFavorite.useMutation();
  const utils = api.useUtils();

  const book = bookData?.response?.[0];

  // Filter recommended books (excluding the current book and taking only some)
  const recommendedBooks =
    recommendedBooksData?.response
      ?.filter((recBook) => recBook.id !== bookId)
      ?.slice(0, 2) ?? [];

  const handleReserve = () => {
    if (!termsAccepted) {
      alert("Debes aceptar los términos y condiciones para continuar");
      return;
    }

    if (!book) {
      alert("No se pudo cargar la información del libro");
      return;
    }

    if (book.status !== "AVAILABLE") {
      alert("Este libro no está disponible para reserva");
      return;
    }

    // TODO: Implement real reservation logic
    console.log("Reserva confirmada para:", book.title);

    // Show confirmation modal
    setShowSuccessModal(true);
  };

  const handleReserveRecommended = (recBook: { id: string }) => {
    setReserveLoadingIds((prev) => new Set(prev).add(recBook.id));
    router.push(`/reserve/${recBook.id}`);
  };

  const handleToggleFavorite = async (recBookId: string) => {
    const isFav = favoriteIds?.includes(recBookId);

    setFavoriteLoadingIds((prev) => new Set(prev).add(recBookId));

    try {
      if (isFav) {
        await removeFavoriteMutation.mutateAsync({ bookId: recBookId });
      } else {
        await addFavoriteMutation.mutateAsync({ bookId: recBookId });
      }
      await utils.favorites.getFavoriteIds.invalidate();
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    } finally {
      setFavoriteLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(recBookId);
        return next;
      });
    }
  };

  const handleViewMore = (book: BookSummary) => {
    setSelectedBook(book);
    setShowPopUp(true);
  };

  const handleClosePopUp = () => {
    setShowPopUp(false);
    setSelectedBook(null);
  };

  const handlePopUpReserve = (bookId: string) => {
    setReserveLoadingIds((prev) => new Set(prev).add(bookId));
    router.push(`/reserve/${bookId}`);
  };

  if (bookLoading) {
    return <ReservePageSkeleton />;
  }

  if (!book) {
    return <BookNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <BookInformationCard book={book} />
          <ReservationDetailsCard
            bookStatus={book.status ?? "NOT_AVAILABLE"}
            termsAccepted={termsAccepted}
            onTermsChange={setTermsAccepted}
            onConfirmReservation={handleReserve}
          />
        </div>

        <RecommendedBooksSection
          books={recommendedBooks}
          isLoading={recommendedLoading}
          favoriteIds={favoriteIds ?? []}
          favoriteLoadingIds={favoriteLoadingIds}
          reserveLoadingIds={reserveLoadingIds}
          onReserve={handleReserveRecommended}
          onToggleFavorite={handleToggleFavorite}
          onViewMore={handleViewMore}
        />
      </main>

      {/* Reservation success confirmation modal */}
      {book && (
        <ReservationSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          book={{
            title: book.title,
            author: book.author,
            editor: book.editorial ?? "",
            authorMiddleName: book.authorMiddleName ?? undefined,
            authorLastName: book.authorLastName ?? undefined,
            isbn: book.isbn,
            gender: book.gender,
            imageUrl: book.imageUrl ?? undefined,
          }}
        />
      )}

      {/* Pop-up modal for viewing book details */}
      <PopUpBook
        isOpen={showPopUp}
        onClose={handleClosePopUp}
        book={selectedBook}
        onReserve={handlePopUpReserve}
        onToggleFavorite={
          selectedBook ? () => handleToggleFavorite(selectedBook.id) : undefined
        }
        isFavorite={
          selectedBook
            ? (favoriteIds?.includes(selectedBook.id) ?? false)
            : false
        }
        isLoadingFavorite={
          selectedBook ? favoriteLoadingIds.has(selectedBook.id) : false
        }
        isLoadingReserve={
          selectedBook ? reserveLoadingIds.has(selectedBook.id) : false
        }
      />
    </div>
  );
}
