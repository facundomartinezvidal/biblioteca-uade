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

type ImprovedFiltersSidebarProps = {
  onCancel?: () => void;
  onSubmit?: () => void;
  className?: string;
  onGenreChange?: (value: string | undefined) => void;
  onAvailabilityChange?: (value: string | undefined) => void;
  onEditorialChange?: (value: string | undefined) => void;
  onYearFromChange?: (value: number | undefined) => void;
  onYearToChange?: (value: number | undefined) => void;
  selectedGenre?: string;
  selectedAvailability?: string;
  selectedEditorial?: string;
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
    selectedGenre,
    selectedAvailability,
    selectedEditorial,
  } = props;

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
          <SelectItem value="ficcion">Ficción</SelectItem>
          <SelectItem value="no-ficcion">No ficción</SelectItem>
          <SelectItem value="novela">Novela</SelectItem>
          <SelectItem value="ensayo">Ensayo</SelectItem>
          <SelectItem value="poesia">Poesía</SelectItem>
          <SelectItem value="biografia">Biografía</SelectItem>
          <SelectItem value="historia">Historia</SelectItem>
          <SelectItem value="ciencias">Ciencias</SelectItem>
          <SelectItem value="filosofia">Filosofía</SelectItem>
          <SelectItem value="arte">Arte</SelectItem>
          <SelectItem value="tecnologia">Tecnología</SelectItem>
          <SelectItem value="educacion">Educación</SelectItem>
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
          <SelectItem value="penguin">Penguin Random House</SelectItem>
          <SelectItem value="planeta">Planeta</SelectItem>
          <SelectItem value="alfaguara">Alfaguara</SelectItem>
          <SelectItem value="anagrama">Anagrama</SelectItem>
          <SelectItem value="tusquets">Tusquets</SelectItem>
          <SelectItem value="sudamericana">Sudamericana</SelectItem>
          <SelectItem value="critica">Crítica</SelectItem>
          <SelectItem value="paidos">Paidós</SelectItem>
          <SelectItem value="fce">Fondo de Cultura Económica</SelectItem>
          <SelectItem value="siglo-xxi">Siglo XXI</SelectItem>
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
