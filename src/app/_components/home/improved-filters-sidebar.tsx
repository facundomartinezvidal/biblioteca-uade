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

  const { data: locationsData } = api.catalog.getAllLocations.useQuery();
  const locations = locationsData?.response ?? [];

  const { data: gendersData } = api.catalog.getAllGenders.useQuery();
  const genders = gendersData?.response ?? [];

  const { data: editorialsData } = api.catalog.getAllEditorials.useQuery();
  const editorials = editorialsData?.response ?? [];

  const formatLocationLabel = (campus: string, address: string) => {
    const campusNames: Record<string, string> = {
      MONSERRAT: "Sede Monserrat",
      RECOLETA: "Sede Recoleta",
      COSTA: "Sede Costa",
    };
    const campusName = campusNames[campus] ?? campus;
    return `${campusName} - ${address}`;
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
          <SelectValue placeholder="Género" />
        </SelectTrigger>
        <SelectContent>
          {genders.map((gender) => (
            <SelectItem key={gender.id} value={gender.id}>
              {gender.name}
            </SelectItem>
          ))}
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
          <SelectValue placeholder="Editorial" />
        </SelectTrigger>
        <SelectContent>
          {editorials.map((editorial) => (
            <SelectItem key={editorial.id} value={editorial.id}>
              {editorial.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Location */}
      <Select value={selectedLocation} onValueChange={onLocationChange}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Ubicación" />
        </SelectTrigger>
        <SelectContent>
          {locations.map((location) => (
            <SelectItem key={location.id} value={location.id}>
              {formatLocationLabel(location.campus, location.address)}
            </SelectItem>
          ))}
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
