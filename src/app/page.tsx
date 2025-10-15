"use client";
import { LibraryBig, Search, X, Clock } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import BookCard from "./_components/home/book-card";
import PopUpBook from "./_components/home/pop-up-book";
import ImprovedFiltersSidebar from "./_components/home/improved-filters-sidebar";
import PaginationControls from "./_components/home/pagination-controls";
import { api } from "~/trpc/react";
import BookCardSkeleton from "./_components/home/book-card-skeleton";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { ComingSoon } from "./_components/coming-soon";

export default function HomePage() {
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

  // States for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");

  // Form filter states (not applied yet)
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

  // Applied filter states (sent to backend)
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
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [filterKey, setFilterKey] = useState(0); // To force form re-render

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

  // Fetch books with search and pagination
  const { data: booksData, isLoading } = api.books.getAll.useQuery(queryParams);

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
    router.push(`/reserve?bookId=${book.id}`);
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
    // close modal then navigate
    handleClosePopUp();
    router.push(`/reserve?bookId=${bookId}`);
  };

  const handlePopUpToggleFavorite = (bookId: string) => {
    // TODO: implement favorite toggle (API call). For now, just console and close.
    console.log(`Toggle favorite ${bookId}`);
  };

  // Function to clear filters (both form and applied)
  const clearFilters = () => {
    setSearchTerm("");
    // Clear form
    setFormGenre(undefined);
    setFormAvailability(undefined);
    setFormEditorial(undefined);
    setFormYearFrom(undefined);
    setFormYearTo(undefined);
    // Clear applied filters
    setAppliedGenre(undefined);
    setAppliedAvailability(undefined);
    setAppliedEditorial(undefined);
    setAppliedYearFrom(undefined);
    setAppliedYearTo(undefined);
    setCurrentPage(1);
    // Force form re-render
    setFilterKey((prev) => prev + 1);
  };

  // Function to apply filters
  const applyFilters = () => {
    setAppliedGenre(formGenre);
    setAppliedEditorial(formEditorial);
    setAppliedYearFrom(formYearFrom);
    setAppliedYearTo(formYearTo);

    // Convert availability from form format to backend format
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

  // Functions to handle form changes (not applied yet)
  const handleGenreChange = (value: string | undefined) => {
    setFormGenre(value);
  };

  const handleAvailabilityChange = (value: string | undefined) => {
    setFormAvailability(value);
  };

  const handleEditorialChange = (value: string | undefined) => {
    setFormEditorial(value);
  };

  const handleYearFromChange = (value: number | undefined) => {
    setFormYearFrom(value);
  };

  const handleYearToChange = (value: number | undefined) => {
    setFormYearTo(value);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const books = booksData?.response ?? [];
  const pagination = booksData?.pagination;

  // Filter books for favorites and recommended tabs (client-side for these specific tabs)
  // NOTE: favorites feature is not implemented yet; keep a flag so we can show the "Coming soon" card.
  const favoritesEnabled = false; // flip to `true` when favorites backend/UI is available
  const favoriteBooks = favoritesEnabled
    ? books.filter((book) => book.status === "AVAILABLE").slice(0, 2)
    : [];
  // NOTE: recommended feature not implemented yet; show ComingSoon until available
  const recommendedEnabled = false; // flip to true when recommendations are implemented
  const recommendedBooks = recommendedEnabled
    ? books.filter((book) => book.status === "AVAILABLE").slice(-2)
    : [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <LibraryBig className="h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Catálogo de Libros
          </h1>
        </div>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        Encontrá el libro que estás buscando de la forma más rápida
      </p>

      <div className="mt-6">
        {/* Search Bar and Filters Row */}
        <div className="mb-6 flex flex-wrap items-start gap-3">
          {/* Search Bar */}
          <div className="relative min-w-[250px] flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Buscar por título, autor, etc..."
              className="pr-10 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filters */}
          <ImprovedFiltersSidebar
            key={filterKey}
            onGenreChange={handleGenreChange}
            onAvailabilityChange={handleAvailabilityChange}
            onEditorialChange={handleEditorialChange}
            onYearFromChange={handleYearFromChange}
            onYearToChange={handleYearToChange}
            onCancel={clearFilters}
            onSubmit={applyFilters}
            selectedGenre={formGenre}
            selectedAvailability={formAvailability}
            selectedEditorial={formEditorial}
            selectedYearFrom={formYearFrom}
            selectedYearTo={formYearTo}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-0">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              Todos ({pagination?.totalCount ?? 0})
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex-1">
              Favoritos
            </TabsTrigger>
            <TabsTrigger value="recomended" className="flex-1">
              Recomendados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, index) => (
                  <BookCardSkeleton key={index} />
                ))
              ) : books.length > 0 ? (
                books.map((book) => (
                  <BookCard
                    key={book.id}
                    title={book.title}
                    authorFirstName={book.author}
                    authorMiddleName={book.authorMiddleName ?? ""}
                    authorLastName={book.authorLastName ?? ""}
                    editorial={book.editorial}
                    year={book.year}
                    category={book.gender}
                    description={book.description}
                    isbn={book.isbn}
                    location={book.location ?? ""}
                    available={book.status === "AVAILABLE"}
                    coverUrl={book.imageUrl}
                    onReserve={() => handleReserve(book)}
                    onViewMore={() => handleViewMore(book)}
                  />
                ))
              ) : (
                <div className="col-span-2 py-12 text-center">
                  <p className="text-lg text-gray-500">
                    No se encontraron libros que coincidan con los filtros.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-berkeley-blue mt-4 hover:underline"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <PaginationControls
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                hasNextPage={pagination.hasNextPage}
                hasPreviousPage={pagination.hasPreviousPage}
              />
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <BookCardSkeleton key={index} />
                ))
              ) : favoriteBooks.length > 0 ? (
                favoriteBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    title={book.title}
                    authorFirstName={book.author}
                    authorMiddleName={book.authorMiddleName ?? ""}
                    authorLastName={book.authorLastName ?? ""}
                    editorial={book.editorial}
                    year={book.year}
                    category={book.gender}
                    description={book.description}
                    isbn={book.isbn}
                    location={book.location ?? ""}
                    available={book.status === "AVAILABLE"}
                    coverUrl={book.imageUrl}
                    isFavorite
                    onReserve={() => handleReserve(book)}
                    onViewMore={() => handleViewMore(book)}
                  />
                ))
              ) : (
                <div className="col-span-2 flex items-center justify-center py-12">
                  <ComingSoon
                    icon={<Clock className="h-6 w-6" />}
                    title="Favoritos"
                    subtitle="Próximamente"
                    description="Podrás marcar libros como favoritos y acceder rápidamente a tus lecturas preferidas desde aquí."
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="recomended" className="mt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <BookCardSkeleton key={index} />
                ))
              ) : recommendedBooks.length > 0 ? (
                recommendedBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    title={book.title}
                    authorFirstName={book.author}
                    authorMiddleName={book.authorMiddleName ?? ""}
                    authorLastName={book.authorLastName ?? ""}
                    editorial={book.editorial}
                    year={book.year}
                    category={book.gender}
                    description={book.description}
                    isbn={book.isbn}
                    location={book.location ?? ""}
                    available={book.status === "AVAILABLE"}
                    coverUrl={book.imageUrl}
                    onReserve={() => handleReserve(book)}
                    onViewMore={() => handleViewMore(book)}
                  />
                ))
              ) : (
                <div className="col-span-2 flex items-center justify-center py-12">
                  <ComingSoon
                    icon={<Clock className="h-6 w-6" />}
                    title="Recomendados"
                    subtitle="Próximamente"
                    description="Estamos trabajando en recomendaciones personalizadas para sugerirte lecturas basadas en tus intereses."
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Pop-up modal for book details */}
      <PopUpBook
        isOpen={showPopUp}
        onClose={handleClosePopUp}
        book={selectedBook}
        onReserve={handlePopUpReserve}
        onToggleFavorite={handlePopUpToggleFavorite}
      />
    </div>
  );
}
