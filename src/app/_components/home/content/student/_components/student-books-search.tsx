"use client";

import { Search, X } from "lucide-react";
import { Input } from "~/components/ui/input";
import ImprovedFiltersSidebar from "~/app/_components/home/improved-filters-sidebar";

interface StudentBooksSearchProps {
  searchTerm: string;
  filterKey: number;
  formGenre?: string;
  formAvailability?: string;
  formEditorial?: string;
  formLocation?: string;
  formYearFrom?: number;
  formYearTo?: number;
  onSearchChange: (value: string) => void;
  onGenreChange: (value: string | undefined) => void;
  onAvailabilityChange: (value: string | undefined) => void;
  onEditorialChange: (value: string | undefined) => void;
  onLocationChange: (value: string | undefined) => void;
  onYearFromChange: (value: number | undefined) => void;
  onYearToChange: (value: number | undefined) => void;
  onFilterCancel: () => void;
  onFilterSubmit: () => void;
}

export function StudentBooksSearch({
  searchTerm,
  filterKey,
  formGenre,
  formAvailability,
  formEditorial,
  formLocation,
  formYearFrom,
  formYearTo,
  onSearchChange,
  onGenreChange,
  onAvailabilityChange,
  onEditorialChange,
  onLocationChange,
  onYearFromChange,
  onYearToChange,
  onFilterCancel,
  onFilterSubmit,
}: StudentBooksSearchProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start gap-3">
      {/* Search Bar */}
      <div className="relative w-[300px]">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar por título, autor, etc..."
          className="pr-10 pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <ImprovedFiltersSidebar
        key={filterKey}
        onGenreChange={onGenreChange}
        onAvailabilityChange={onAvailabilityChange}
        onEditorialChange={onEditorialChange}
        onLocationChange={onLocationChange}
        onYearFromChange={onYearFromChange}
        onYearToChange={onYearToChange}
        onCancel={onFilterCancel}
        onSubmit={onFilterSubmit}
        selectedGenre={formGenre}
        selectedAvailability={formAvailability}
        selectedEditorial={formEditorial}
        selectedLocation={formLocation}
        selectedYearFrom={formYearFrom}
        selectedYearTo={formYearTo}
      />
    </div>
  );
}
