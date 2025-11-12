"use client";

import { BookOpen, Plus, UserPlus, Tags, Building2, Settings } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import PaginationControls from "~/app/_components/home/pagination-controls";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import {
  AdminBooksFilters,
  AdminBooksTable,
  AddBookModal,
  AddAuthorModal,
  AddGenderModal,
  AddEditorialModal,
} from "./_components";
import { ManageCatalogModals } from "./_components/manage-catalog-modals";

export function HomeAdminContent() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "AVAILABLE" | "NOT_AVAILABLE" | "RESERVED"
  >("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showAddAuthorModal, setShowAddAuthorModal] = useState(false);
  const [showAddGenderModal, setShowAddGenderModal] = useState(false);
  const [showAddEditorialModal, setShowAddEditorialModal] = useState(false);
  const [manageType, setManageType] = useState<"author"|"gender"|"editorial"|null>(null);

  const utils = api.useUtils();

  // Build query parameters
  const queryParams = useMemo(() => {
    return {
      search: search.trim() || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      page,
      limit: pageSize,
    };
  }, [search, statusFilter, page, pageSize]);

  // Fetch books for admin
  const { data: booksData, isLoading } =
    api.books.getAllAdmin.useQuery(queryParams);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const books = booksData?.response ?? [];
  const pagination = booksData?.pagination;

  const handleRefresh = () => {
    void utils.books.getAllAdmin.invalidate();
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="text-berkeley-blue h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">Libros</h1>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowAddBookModal(true)}
              className="bg-berkeley-blue hover:bg-berkeley-blue/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Libro
            </Button>
            <Button
              onClick={() => setShowAddAuthorModal(true)}
              variant="outline"
              className="border-berkeley-blue text-berkeley-blue hover:bg-berkeley-blue/10"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Autor
            </Button>
            <Button
              onClick={() => setShowAddEditorialModal(true)}
              variant="outline"
              className="border-berkeley-blue text-berkeley-blue hover:bg-berkeley-blue/10"
            >
              <Building2 className="mr-2 h-4 w-4" />
              Editorial
            </Button>
            <Button
              onClick={() => setShowAddGenderModal(true)}
              variant="outline"
              className="border-berkeley-blue text-berkeley-blue hover:bg-berkeley-blue/10"
            >
              <Tags className="mr-2 h-4 w-4" />
              Género
            </Button>
            <Button
              onClick={() => setManageType("author")}
              variant="outline"
              className="border-berkeley-blue text-berkeley-blue hover:bg-berkeley-blue/10"
            >
              <Settings className="mr-2 h-4 w-4" /> Gest. Autores
            </Button>
            <Button
              onClick={() => setManageType("editorial")}
              variant="outline"
              className="border-berkeley-blue text-berkeley-blue hover:bg-berkeley-blue/10"
            >
              <Settings className="mr-2 h-4 w-4" /> Gest. Editoriales
            </Button>
            <Button
              onClick={() => setManageType("gender")}
              variant="outline"
              className="border-berkeley-blue text-berkeley-blue hover:bg-berkeley-blue/10"
            >
              <Settings className="mr-2 h-4 w-4" /> Gest. Géneros
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          Administra el catálogo de libros de la biblioteca
        </p>

        {/* Filters Component */}
        <AdminBooksFilters
          search={search}
          statusFilter={statusFilter}
          onSearchChange={setSearch}
          onStatusChange={setStatusFilter}
        />

        {/* Table Component */}
        <AdminBooksTable
          books={books}
          isLoading={isLoading}
          onDeleteSuccess={handleRefresh}
        />

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <PaginationControls
            className="mt-6"
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            hasPreviousPage={pagination.hasPreviousPage}
            onPageChange={(p) => {
              if (p >= 1 && p <= pagination.totalPages) setPage(p);
            }}
          />
        )}

        {/* Modales */}
        <AddBookModal
          isOpen={showAddBookModal}
          onClose={() => setShowAddBookModal(false)}
          onSuccess={handleRefresh}
        />
        <AddAuthorModal
          isOpen={showAddAuthorModal}
          onClose={() => setShowAddAuthorModal(false)}
        />
        <AddEditorialModal
          isOpen={showAddEditorialModal}
          onClose={() => setShowAddEditorialModal(false)}
        />
        <AddGenderModal
          isOpen={showAddGenderModal}
          onClose={() => setShowAddGenderModal(false)}
        />
        {manageType && (
          <ManageCatalogModals
            open={!!manageType}
            type={manageType}
            onClose={() => setManageType(null)}
          />
        )}
      </main>
    </div>
  );
}
