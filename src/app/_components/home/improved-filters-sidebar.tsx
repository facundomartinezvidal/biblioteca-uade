"use client";

import { Filter } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
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
    onYearFromChange,
    onYearToChange,
    selectedGenre,
    selectedAvailability,
    selectedEditorial,
    selectedYearFrom,
    selectedYearTo,
  } = props;

  const currentYear = new Date().getFullYear();

  return (
    <Card
      className={[
        "border-muted-foreground/15 bg-card p-4",
        "w-full max-w-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h3 className="font-semibold">Filtros</h3>
        </div>

        <p className="text-muted-foreground text-sm">
          Refina tu búsqueda con criterios específicos
        </p>

        <div className="space-y-4">
          {/* Género */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Género</Label>
            <Select value={selectedGenre} onValueChange={onGenreChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos los géneros" />
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
          </div>

          {/* Disponibilidad */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Disponibilidad</Label>
            <Select
              value={selectedAvailability}
              onValueChange={onAvailabilityChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Cualquier estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="no-disponible">No disponible</SelectItem>
                <SelectItem value="reservado">Reservado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Editorial */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Editorial</Label>
            </div>
            <Select value={selectedEditorial} onValueChange={onEditorialChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todas las editoriales" />
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
          </div>

          {/* Rango de años */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Año de publicación</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-muted-foreground text-xs">Desde</Label>
                <Input
                  type="number"
                  placeholder="1900"
                  min="1800"
                  max={currentYear}
                  value={selectedYearFrom ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    onYearFromChange?.(value ? parseInt(value) : undefined);
                  }}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Hasta</Label>
                <Input
                  type="number"
                  placeholder={currentYear.toString()}
                  min="1800"
                  max={currentYear}
                  value={selectedYearTo ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    onYearToChange?.(value ? parseInt(value) : undefined);
                  }}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            size="sm"
            onClick={onCancel}
          >
            Limpiar
          </Button>
          <Button
            size="sm"
            className="bg-berkeley-blue hover:bg-berkeley-blue/90 flex-1"
            onClick={onSubmit}
          >
            Aplicar
          </Button>
        </div>
      </div>
    </Card>
  );
}
