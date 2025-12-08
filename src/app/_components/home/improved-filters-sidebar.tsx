"use client";

import { Filter } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";

type ImprovedFiltersSidebarProps = {
  onCancel?: () => void;
  onSubmit?: () => void;
  className?: string;
  onGenreChange?: (value: string | undefined) => void;
  onAvailabilityChange?: (value: string | undefined) => void;
  onEditorialChange?: (value: string | undefined) => void;
  onLocationChange?: (value: string | undefined) => void;
  onYearFromChange?: (value: number | undefined) => void;
  onYearToChange?: (value: number | undefined) => void;
  selectedGenre?: string;
  selectedAvailability?: string;
  selectedEditorial?: string;
  selectedLocation?: string;
  selectedYearFrom?: number;
  selectedYearTo?: number;
};

export default function ImprovedFiltersSidebar(
  props: ImprovedFiltersSidebarProps,
) {
  const {
    onCancel,
    onSubmit,
    className,
    onGenreChange,
    onAvailabilityChange,
    onEditorialChange,
    onLocationChange,
    selectedGenre,
    selectedAvailability,
    selectedEditorial,
    selectedLocation,
  } = props;

  const { data: locations, isLoading: isLoadingLocations } =
    api.locations.getAll.useQuery(undefined, {
      retry: 0,
      staleTime: 600000, // 10 minutes
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  const { data: gendersData, isLoading: isLoadingGenders } =
    api.catalog.getAllGenders.useQuery(
      { limit: 100 },
      {
        retry: 0,
        staleTime: 600000, // 10 minutes
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
    );
  const genders = gendersData?.response ?? [];

  const { data: editorialsData, isLoading: isLoadingEditorials } =
    api.catalog.getAllEditorials.useQuery(
      { limit: 100 },
      {
        retry: 0,
        staleTime: 600000, // 10 minutes
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
    );
  const editorials = editorialsData?.response ?? [];

  const formatLocationLabel = (name: string, address: string) => {
    return `Sede ${name} - ${address}`;
  };

  return (
    <div
      className={["flex flex-wrap items-center gap-2", className]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Filter Label */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <Filter className="h-4 w-4" />
        <span>Filtrar por:</span>
      </div>

      {/* Género */}
      <Select value={selectedGenre} onValueChange={onGenreChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue
            placeholder={isLoadingGenders ? "Cargando..." : "Género"}
          />
        </SelectTrigger>
        <SelectContent>
          {isLoadingGenders ? (
            <SelectItem value="_loading" disabled>
              Cargando géneros...
            </SelectItem>
          ) : genders.length === 0 ? (
            <SelectItem value="_empty" disabled>
              No hay géneros disponibles
            </SelectItem>
          ) : (
            genders.map((gender) => (
              <SelectItem key={gender.id} value={gender.id}>
                {gender.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {/* Disponibilidad */}
      <Select value={selectedAvailability} onValueChange={onAvailabilityChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="disponible">Disponible</SelectItem>
          <SelectItem value="no-disponible">No disponible</SelectItem>
          <SelectItem value="reservado">Reservado</SelectItem>
        </SelectContent>
      </Select>

      {/* Editorial */}
      <Select value={selectedEditorial} onValueChange={onEditorialChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue
            placeholder={isLoadingEditorials ? "Cargando..." : "Editorial"}
          />
        </SelectTrigger>
        <SelectContent>
          {isLoadingEditorials ? (
            <SelectItem value="_loading" disabled>
              Cargando editoriales...
            </SelectItem>
          ) : editorials.length === 0 ? (
            <SelectItem value="_empty" disabled>
              No hay editoriales disponibles
            </SelectItem>
          ) : (
            editorials.map((editorial) => (
              <SelectItem key={editorial.id} value={editorial.id}>
                {editorial.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {/* Location */}
      <Select value={selectedLocation} onValueChange={onLocationChange}>
        <SelectTrigger className="w-[240px]">
          <SelectValue
            placeholder={isLoadingLocations ? "Cargando..." : "Ubicación"}
          />
        </SelectTrigger>
        <SelectContent>
          {isLoadingLocations ? (
            <SelectItem value="_loading" disabled>
              Cargando ubicaciones...
            </SelectItem>
          ) : !locations || locations.length === 0 ? (
            <SelectItem value="_empty" disabled>
              No hay ubicaciones disponibles
            </SelectItem>
          ) : (
            locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {formatLocationLabel(location.name, location.address)}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Limpiar
        </Button>
        <Button
          size="sm"
          className="bg-berkeley-blue hover:bg-berkeley-blue/90"
          onClick={onSubmit}
        >
          Aplicar
        </Button>
      </div>
    </div>
  );
}
