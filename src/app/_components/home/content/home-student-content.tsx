"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import PopUpBook from "~/app/_components/home/pop-up-book";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import {
  StudentBooksHeader,
  StudentBooksSearch,
  StudentBooksAllTab,
  StudentBooksFavoritesTab,
  StudentBooksRecommendedTab,
} from "./student/_components";

export function HomeStudentContent() {
  const router = useRouter();
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

  const [selectedBook, setSelectedBook] = useState<BookSummary | null>(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form filter states
  const [formGenre, setFormGenre] = useState<string | undefined>(undefined);
  const [formAvailability, setFormAvailability] = useState<string | undefined>(
    undefined,
  );
  const [formEditorial, setFormEditorial] = useState<string | undefined>(
    undefined,
  );
  const [formYearFrom, setFormYearFrom] = useState<number | undefined>(
    undefined,
  );
  const [formYearTo, setFormYearTo] = useState<number | undefined>(undefined);

  // Applied filter states
  const [appliedGenre, setAppliedGenre] = useState<string | undefined>(
    undefined,
  );
  const [appliedAvailability, setAppliedAvailability] = useState<
    "AVAILABLE" | "NOT_AVAILABLE" | "RESERVED" | undefined
  >(undefined);
  const [appliedEditorial, setAppliedEditorial] = useState<string | undefined>(
    undefined,
  );
  const [appliedYearFrom, setAppliedYearFrom] = useState<number | undefined>(
    undefined,
  );
  const [appliedYearTo, setAppliedYearTo] = useState<number | undefined>(
    undefined,
  );

  const [reserveLoadingIds, setReserveLoadingIds] = useState<Set<string>>(
    new Set(),
  );

  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [filterKey, setFilterKey] = useState(0);
  const [favoriteLoadingIds, setFavoriteLoadingIds] = useState<Set<string>>(
    new Set(),
  );

  // Build query parameters
  const queryParams = useMemo(() => {
    const params: {
      search?: string;
      genre?: string;
      status?: "AVAILABLE" | "NOT_AVAILABLE" | "RESERVED";
      editorial?: string;
      yearFrom?: number;
      yearTo?: number;
      page: number;
      limit: number;
    } = {
      page: currentPage,
      limit: pageSize,
    };

    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    if (appliedGenre) {
      params.genre = appliedGenre;
    }

    if (appliedAvailability) {
      params.status = appliedAvailability;
    }

    if (appliedEditorial) {
      params.editorial = appliedEditorial;
    }

    if (appliedYearFrom) {
      params.yearFrom = appliedYearFrom;
    }

    if (appliedYearTo) {
      params.yearTo = appliedYearTo;
    }

    return params;
  }, [
    searchTerm,
    appliedGenre,
    appliedAvailability,
    appliedEditorial,
    appliedYearFrom,
    appliedYearTo,
    currentPage,
    pageSize,
  ]);

  // Fetch books
  const { data: booksData, isLoading } = api.books.getAll.useQuery(queryParams);

  // Fetch favorites
  const { data: favoritesData, isLoading: isLoadingFavorites } =
    api.favorites.getFavorites.useQuery();
  const { data: favoriteIds } = api.favorites.getFavoriteIds.useQuery();

  // Fetch user reservations to check which books are reserved/active by current user
  const { data: userActiveLoansData } = api.loans.getActive.useQuery();
  const { data: userReservedLoansData } = api.loans.getByUserId.useQuery({
    page: 1,
    limit: 100,
    status: "RESERVED",
  });

  const userReservedBookIds = useMemo(() => {
    const reservedBookIds =
      userReservedLoansData?.results.map((loan) => loan.book.id) ?? [];
    return reservedBookIds;
  }, [userReservedLoansData]);

  const userActiveBookIds = useMemo(() => {
    const activeBookIds =
      userActiveLoansData?.results.map((loan) => loan.book.id) ?? [];
    return activeBookIds;
  }, [userActiveLoansData]);

  // Mutations para favoritos
  const addFavoriteMutation = api.favorites.addFavorite.useMutation();
  const removeFavoriteMutation = api.favorites.removeFavorite.useMutation();
  const utils = api.useUtils();

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    appliedGenre,
    appliedAvailability,
    appliedEditorial,
    appliedYearFrom,
    appliedYearTo,
  ]);

  const handleReserve = (book: { id: string }) => {
    setReserveLoadingIds((prev) => new Set(prev).add(book.id));
    router.push(`/reserve/${book.id}`);
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

  const handleToggleFavorite = async (bookId: string) => {
    const isFav = favoriteIds?.includes(bookId);

    setFavoriteLoadingIds((prev) => new Set(prev).add(bookId));

    try {
      if (isFav) {
        await removeFavoriteMutation.mutateAsync({ bookId });
      } else {
        await addFavoriteMutation.mutateAsync({ bookId });
      }
      // Refrescar los datos de favoritos
      await utils.favorites.getFavorites.invalidate();
      await utils.favorites.getFavoriteIds.invalidate();
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    } finally {
      setFavoriteLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(bookId);
        return next;
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFormGenre(undefined);
    setFormAvailability(undefined);
    setFormEditorial(undefined);
    setFormYearFrom(undefined);
    setFormYearTo(undefined);
    setAppliedGenre(undefined);
    setAppliedAvailability(undefined);
    setAppliedEditorial(undefined);
    setAppliedYearFrom(undefined);
    setAppliedYearTo(undefined);
    setCurrentPage(1);
    setFilterKey((prev) => prev + 1);
  };

  const applyFilters = () => {
    setAppliedGenre(formGenre);
    setAppliedEditorial(formEditorial);
    setAppliedYearFrom(formYearFrom);
    setAppliedYearTo(formYearTo);

    if (formAvailability === "disponible") {
      setAppliedAvailability("AVAILABLE");
    } else if (formAvailability === "no-disponible") {
      setAppliedAvailability("NOT_AVAILABLE");
    } else if (formAvailability === "reservado") {
      setAppliedAvailability("RESERVED");
    } else {
      setAppliedAvailability(undefined);
    }
  };

  const books = booksData?.response ?? [];
  const pagination = booksData?.pagination;

  const favoriteBooks = favoritesData ?? [];

  const recommendedEnabled = false;
  const recommendedBooks = recommendedEnabled
    ? books.filter((book) => book.status === "AVAILABLE").slice(-2)
    : [];

  return (
    <div>
      {/* Header */}
      <StudentBooksHeader />

      <div className="mt-6">
        {/* Search and Filters */}
        <StudentBooksSearch
          searchTerm={searchTerm}
          filterKey={filterKey}
          formGenre={formGenre}
          formAvailability={formAvailability}
          formEditorial={formEditorial}
          formYearFrom={formYearFrom}
          formYearTo={formYearTo}
          onSearchChange={setSearchTerm}
          onGenreChange={setFormGenre}
          onAvailabilityChange={setFormAvailability}
          onEditorialChange={setFormEditorial}
          onYearFromChange={setFormYearFrom}
          onYearToChange={setFormYearTo}
          onFilterCancel={clearFilters}
          onFilterSubmit={applyFilters}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-0">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              Todos ({pagination?.totalCount ?? 0})
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex-1">
              Favoritos ({favoriteBooks.length})
            </TabsTrigger>
            <TabsTrigger value="recomended" className="flex-1">
              Recomendados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <StudentBooksAllTab
              books={books}
              isLoading={isLoading}
              pagination={pagination}
              onReserve={handleReserve}
              reserveLoadingIds={reserveLoadingIds}
              onViewMore={handleViewMore}
              onPageChange={setCurrentPage}
              onClearFilters={clearFilters}
              favoriteIds={favoriteIds ?? []}
              onToggleFavorite={handleToggleFavorite}
              favoriteLoadingIds={favoriteLoadingIds}
              userReservedBookIds={userReservedBookIds}
              userActiveBookIds={userActiveBookIds}
            />
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <StudentBooksFavoritesTab
              books={favoriteBooks as BookSummary[]}
              isLoading={(isLoadingFavorites as boolean | undefined) ?? false}
              onReserve={handleReserve}
              onViewMore={handleViewMore}
              favoriteIds={favoriteIds ?? []}
              onToggleFavorite={handleToggleFavorite}
              favoriteLoadingIds={favoriteLoadingIds}
              reserveLoadingIds={reserveLoadingIds}
              userReservedBookIds={userReservedBookIds}
              userActiveBookIds={userActiveBookIds}
            />
          </TabsContent>

          <TabsContent value="recomended" className="mt-6">
            <StudentBooksRecommendedTab
              books={recommendedBooks}
              isLoading={isLoading}
              onReserve={handleReserve}
              onViewMore={handleViewMore}
              reserveLoadingIds={reserveLoadingIds}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Pop-up modal */}
      <PopUpBook
        isOpen={showPopUp}
        onClose={handleClosePopUp}
        book={selectedBook}
        onReserve={handlePopUpReserve}
        onToggleFavorite={handleToggleFavorite}
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
        isReservedByCurrentUser={
          selectedBook ? userReservedBookIds.includes(selectedBook.id) : false
        }
        isActiveByCurrentUser={
          selectedBook ? userActiveBookIds.includes(selectedBook.id) : false
        }
      />
    </div>
  );
}
