"use client";

import { Search, X } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
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
    <div className="mb-6 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-3">
      {/* Search Bar */}
      <div className="relative w-[280px] shrink-0">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          placeholder="Buscar por título, autor, etc..."
          className="h-9 pr-10 pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 transform rounded-full hover:bg-gray-100"
            onClick={() => onSearchChange("")}
          >
            <X className="h-3 w-3 text-gray-500" />
          </Button>
        )}
      </div>

      {/* Separator */}
      <div className="h-6 w-px shrink-0 bg-gray-300" />

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
        inline
      />
    </div>
  );
}
