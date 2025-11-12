"use client";

import { Search, X } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";

interface AdminBooksFiltersProps {
  search: string;
  statusFilter: "all" | "AVAILABLE" | "NOT_AVAILABLE" | "RESERVED";
  locationFilter: string | undefined;
  genreFilter: string | undefined;
  editorialFilter: string | undefined;
  yearFromFilter: number | undefined;
  yearToFilter: number | undefined;
  onSearchChange: (value: string) => void;
  onStatusChange: (
    value: "all" | "AVAILABLE" | "NOT_AVAILABLE" | "RESERVED",
  ) => void;
  onLocationChange: (value: string | undefined) => void;
  onGenreChange: (value: string | undefined) => void;
  onEditorialChange: (value: string | undefined) => void;
  onYearFromChange: (value: number | undefined) => void;
  onYearToChange: (value: number | undefined) => void;
  onClearFilters: () => void;
}

export function AdminBooksFilters({
  search,
  statusFilter,
  locationFilter,
  genreFilter,
  editorialFilter,
  yearFromFilter,
  yearToFilter,
  onSearchChange,
  onStatusChange,
  onLocationChange,
  onGenreChange,
  onEditorialChange,
  onYearFromChange,
  onYearToChange,
  onClearFilters,
}: AdminBooksFiltersProps) {
  const { data: locationsData } = api.catalog.getAllLocations.useQuery();
  const locations = locationsData?.response ?? [];

  const { data: genresData } = api.catalog.getAllGenders.useQuery();
  const genres = genresData?.response ?? [];

  const { data: editorialsData } = api.catalog.getAllEditorials.useQuery();
  const editorials = editorialsData?.response ?? [];

  const formatLocationLabel = (campus: string, address: string) => {
    let campusName = campus;
    if (campus === "MONSERRAT") campusName = "Monserrat";
    else if (campus === "COSTA") campusName = "Costa";
    else if (campus === "RECOLETA") campusName = "Recoleta";
    return `Sede ${campusName} - ${address}`;
  };

  const hasActiveFilters =
    statusFilter !== "all" ||
    locationFilter !== undefined ||
    genreFilter !== undefined ||
    editorialFilter !== undefined ||
    yearFromFilter !== undefined ||
    yearToFilter !== undefined;

  return (
    <div className="mt-6 mb-6 space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Buscar por título, autor, etc..."
            className="pr-10 pl-10"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 transform rounded-full hover:bg-gray-100"
              onClick={() => onSearchChange("")}
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>

        {/* Clear all filters */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Filtrar por:</span>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="AVAILABLE">Disponible</SelectItem>
              <SelectItem value="NOT_AVAILABLE">No disponible</SelectItem>
              <SelectItem value="RESERVED">Reservado</SelectItem>
            </SelectContent>
          </Select>
          {statusFilter !== "all" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={() => onStatusChange("all")}
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>

        {/* Location filter */}
        <div className="flex items-center gap-2">
          <Select
            value={locationFilter ?? "all"}
            onValueChange={(value) =>
              onLocationChange(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Ubicación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las sedes</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {formatLocationLabel(location.campus, location.address)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {locationFilter && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={() => onLocationChange(undefined)}
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>

        {/* Genre filter */}
        <div className="flex items-center gap-2">
          <Select
            value={genreFilter ?? "all"}
            onValueChange={(value) =>
              onGenreChange(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Género" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre.id} value={genre.name}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {genreFilter && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={() => onGenreChange(undefined)}
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>

        {/* Editorial filter */}
        <div className="flex items-center gap-2">
          <Select
            value={editorialFilter ?? "all"}
            onValueChange={(value) =>
              onEditorialChange(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Editorial" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {editorials.map((editorial) => (
                <SelectItem key={editorial.id} value={editorial.name}>
                  {editorial.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {editorialFilter && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={() => onEditorialChange(undefined)}
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>

        {/* Year range filters */}
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Año desde"
            className="w-[120px]"
            value={yearFromFilter ?? ""}
            onChange={(e) =>
              onYearFromChange(
                e.target.value ? parseInt(e.target.value) : undefined,
              )
            }
          />
          <span className="text-sm text-gray-500">-</span>
          <Input
            type="number"
            placeholder="Año hasta"
            className="w-[120px]"
            value={yearToFilter ?? ""}
            onChange={(e) =>
              onYearToChange(
                e.target.value ? parseInt(e.target.value) : undefined,
              )
            }
          />
          {(yearFromFilter !== undefined || yearToFilter !== undefined) && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={() => {
                onYearFromChange(undefined);
                onYearToChange(undefined);
              }}
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
