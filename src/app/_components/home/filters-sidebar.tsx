"use client";

import { Filter } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type FiltersSidebarProps = {
  onCancel?: () => void;
  onSubmit?: () => void;
  className?: string;
  onGenreChange?: (value: string | undefined) => void;
  onAvailabilityChange?: (value: string | undefined) => void;
  onLocationChange?: (value: string | undefined) => void;
  selectedGenre?: string;
  selectedAvailability?: string;
  selectedLocation?: string;
};

export default function FiltersSidebar(props: FiltersSidebarProps) {
  const { 
    onCancel, 
    onSubmit, 
    className,
    onGenreChange,
    onAvailabilityChange,
    onLocationChange,
    selectedGenre,
    selectedAvailability,
    selectedLocation
  } = props;

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
          <h3 className="font-semibold">Filtros adicionales-</h3>
        </div>

        <p className="text-muted-foreground text-sm">
          Filtra tu búsqueda por múltiples criterios
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Género</Label>
            <Select value={selectedGenre} onValueChange={onGenreChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione el género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="programacion">Programación</SelectItem>
                <SelectItem value="novela">Novela</SelectItem>
                <SelectItem value="ciencias">Ciencias</SelectItem>
                <SelectItem value="historia">Historia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Disponibilidad</Label>
            <Select value={selectedAvailability} onValueChange={onAvailabilityChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione la disponibilidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="no-disponible">No disponible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Sede</Label>
            <Select value={selectedLocation} onValueChange={onLocationChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione la sede" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sede-montserrat">Sede Montserrat</SelectItem>
                <SelectItem value="sede-recoleta">Sede Recoleta</SelectItem>
                <SelectItem value="sede-belgrano">Sede Belgrano</SelectItem>
                <SelectItem value="sede-pinamar">Sede Pinamar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="bg-ber bg-berkeley-blue" onClick={onSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </Card>
  );
}
