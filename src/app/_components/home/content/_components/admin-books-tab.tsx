import { AdminBooksTable } from "./admin-books-table";
import { AddBookModal } from "./add-book-modal";
import { useState, useMemo, useEffect } from "react";
import PaginationControls from "~/app/_components/home/pagination-controls";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Plus, Search, X } from "lucide-react";
import ImprovedFiltersSidebar from "~/app/_components/home/improved-filters-sidebar";

export function AdminBooksTab() {
  const [search, setSearch] = useState("");

  // Form filter states (temporary, before applying)
  const [formGenre, setFormGenre] = useState<string | undefined>(undefined);
  const [formAvailability, setFormAvailability] = useState<string | undefined>(undefined);
  const [formEditorial, setFormEditorial] = useState<string | undefined>(undefined);
  const [formYearFrom, setFormYearFrom] = useState<number | undefined>(undefined);
  const [formYearTo, setFormYearTo] = useState<number | undefined>(undefined);
  const [formLocation, setFormLocation] = useState<string | undefined>(undefined);

  // Applied filter states (actually used in queries)
  const [appliedGenre, setAppliedGenre] = useState<string | undefined>(undefined);
  const [appliedAvailability, setAppliedAvailability] = useState<"AVAILABLE" | "NOT_AVAILABLE" | "RESERVED" | undefined>(undefined);
  const [appliedEditorial, setAppliedEditorial] = useState<string | undefined>(undefined);
  const [appliedYearFrom, setAppliedYearFrom] = useState<number | undefined>(undefined);
  const [appliedYearTo, setAppliedYearTo] = useState<number | undefined>(undefined);
  const [appliedLocation, setAppliedLocation] = useState<string | undefined>(undefined);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [filterKey, setFilterKey] = useState(0);
  const [showAddBookModal, setShowAddBookModal] = useState(false);

  const utils = api.useUtils();

  const queryParams = useMemo(() => {
    return {
      search: search.trim() || undefined,
      status: appliedAvailability,
      locationId: appliedLocation,
      genre: appliedGenre,
      editorial: appliedEditorial,
      yearFrom: appliedYearFrom,
      yearTo: appliedYearTo,
      page,
      limit: pageSize,
    };
  }, [search, appliedAvailability, appliedLocation, appliedGenre, appliedEditorial, appliedYearFrom, appliedYearTo, page, pageSize]);

  const { data: booksData, isLoading } = api.books.getAllAdmin.useQuery(queryParams);

  useEffect(() => {
    setPage(1);
  }, [search, appliedAvailability, appliedLocation, appliedGenre, appliedEditorial, appliedYearFrom, appliedYearTo]);

  const clearFilters = () => {
    setSearch("");
    setFormGenre(undefined);
    setFormAvailability(undefined);
    setFormEditorial(undefined);
    setFormYearFrom(undefined);
    setFormYearTo(undefined);
    setFormLocation(undefined);
    setAppliedGenre(undefined);
    setAppliedAvailability(undefined);
    setAppliedEditorial(undefined);
    setAppliedYearFrom(undefined);
    setAppliedYearTo(undefined);
    setAppliedLocation(undefined);
    setPage(1);
    setFilterKey((prev) => prev + 1);
  };

  const applyFilters = () => {
    setAppliedGenre(formGenre);
    setAppliedEditorial(formEditorial);
    setAppliedYearFrom(formYearFrom);
    setAppliedYearTo(formYearTo);
    setAppliedLocation(formLocation);

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

  const handleRefresh = () => { void utils.books.getAllAdmin.invalidate(); };

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-row items-center gap-3">
        {/* Search bar */}
        <div className="relative w-[280px]">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Buscar por título, autor, ISBN..."
            className="pr-10 pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 transform rounded-full hover:bg-gray-100"
              onClick={() => setSearch("")}
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>

        {/* Filter Sidebar */}
        <ImprovedFiltersSidebar
          key={filterKey}
          selectedGenre={formGenre}
          selectedAvailability={formAvailability}
          selectedEditorial={formEditorial}
          selectedYearFrom={formYearFrom}
          selectedYearTo={formYearTo}
          selectedLocation={formLocation}
          onGenreChange={setFormGenre}
          onAvailabilityChange={setFormAvailability}
          onEditorialChange={setFormEditorial}
          onYearFromChange={setFormYearFrom}
          onYearToChange={setFormYearTo}
          onLocationChange={setFormLocation}
          onCancel={clearFilters}
          onSubmit={applyFilters}
        />

        <Button onClick={() => setShowAddBookModal(true)} className="ml-auto bg-berkeley-blue hover:bg-berkeley-blue/90">
          <Plus className="mr-2 h-4 w-4" /> Agregar Libro
        </Button>
      </div>

      <AdminBooksTable books={books} isLoading={isLoading} onDeleteSuccess={handleRefresh} />

      {pagination && pagination.totalPages > 1 && (
        <PaginationControls
          className="mt-6"
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          onPageChange={(p) => { if (p >= 1 && p <= pagination.totalPages) setPage(p); }}
        />
      )}

      <AddBookModal isOpen={showAddBookModal} onClose={() => setShowAddBookModal(false)} onSuccess={handleRefresh} />
    </div>
  );
}
