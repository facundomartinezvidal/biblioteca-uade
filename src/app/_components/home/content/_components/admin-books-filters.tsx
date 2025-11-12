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

interface AdminBooksFiltersProps {
  search: string;
  statusFilter: "all" | "AVAILABLE" | "NOT_AVAILABLE" | "RESERVED";
  onSearchChange: (value: string) => void;
  onStatusChange: (
    value: "all" | "AVAILABLE" | "NOT_AVAILABLE" | "RESERVED",
  ) => void;
}

export function AdminBooksFilters({
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: AdminBooksFiltersProps) {
  return (
    <div className="mt-6 mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex w-full max-w-2xl flex-row items-center gap-6">
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
        <div className="flex flex-row items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
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
      </div>
    </div>
  );
}
