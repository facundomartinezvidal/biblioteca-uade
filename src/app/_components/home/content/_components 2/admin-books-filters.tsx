"use client";

import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
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
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          placeholder="Buscar por título, autor, etc..."
          className="pl-10"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Filtrar por:</span>

        {/* Status filter */}
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
      </div>
    </div>
  );
}
