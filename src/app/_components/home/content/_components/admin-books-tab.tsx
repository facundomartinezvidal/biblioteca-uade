import { AdminBooksFilters } from "./admin-books-filters";
import { AdminBooksTable } from "./admin-books-table";
import { AddBookModal } from "./add-book-modal";
import { useState, useMemo, useEffect } from "react";
import PaginationControls from "~/app/_components/home/pagination-controls";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";

export function AdminBooksTab() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "AVAILABLE" | "NOT_AVAILABLE" | "RESERVED">("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const utils = api.useUtils();

  const queryParams = useMemo(() => {
    return {
      search: search.trim() || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      page,
      limit: pageSize,
    };
  }, [search, statusFilter, page, pageSize]);

  const { data: booksData, isLoading } = api.books.getAllAdmin.useQuery(queryParams);

  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const books = booksData?.response ?? [];
  const pagination = booksData?.pagination;

  const handleRefresh = () => { void utils.books.getAllAdmin.invalidate(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <AdminBooksFilters
          search={search}
          statusFilter={statusFilter}
          onSearchChange={setSearch}
          onStatusChange={setStatusFilter}
        />
        <Button onClick={() => setShowAddBookModal(true)} className="bg-berkeley-blue hover:bg-berkeley-blue/90">
          <Plus className="mr-2 h-4 w-4" /> Agregar Libro
        </Button>
      </div>
      <AdminBooksTable books={books} isLoading={isLoading} onDeleteSuccess={handleRefresh} />
      {pagination && pagination.totalPages > 1 && (
        <PaginationControls
          className="mt-6"
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          onPageChange={(p) => { if (p >= 1 && p <= pagination.totalPages) setPage(p); }}
        />
      )}
      <AddBookModal isOpen={showAddBookModal} onClose={() => setShowAddBookModal(false)} onSuccess={handleRefresh} />
    </div>
  );
}
