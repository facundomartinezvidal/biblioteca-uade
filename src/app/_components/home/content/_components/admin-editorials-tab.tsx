import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import PaginationControls from "~/app/_components/home/pagination-controls";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog";
import { Input } from "~/components/ui/input";

interface Editorial {
  id: string;
  name: string;
}

export function AdminEditorialsTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editEditorial, setEditEditorial] = useState<Editorial | null>(null);
  const [deleteEditorial, setDeleteEditorial] = useState<Editorial | null>(null);
  const utils = api.useUtils();

  const { data, isLoading } = api.catalog.getAllEditorials.useQuery({
    search: search.trim() || undefined,
    page,
    limit: pageSize,
  });

  const editorials = data?.response ?? [];
  const pagination = data?.pagination;

  useEffect(() => {
    setPage(1);
  }, [search]);

  // Mutations
  const createEditorial = api.catalog.createEditorial.useMutation({
    onSuccess: async () => { await utils.catalog.getAllEditorials.invalidate(); setShowAddModal(false); },
  });
  const updateEditorial = api.catalog.updateEditorial.useMutation({
    onSuccess: async () => { await utils.catalog.getAllEditorials.invalidate(); setEditEditorial(null); },
  });
  const deleteEditorialMutation = api.catalog.deleteEditorial.useMutation({
    onSuccess: async () => { await utils.catalog.getAllEditorials.invalidate(); setDeleteEditorial(null); },
  });

  // Form state
  const [form, setForm] = useState({ name: "" });
  useEffect(() => {
    if (editEditorial) setForm({ name: editEditorial.name });
    else setForm({ name: "" });
  }, [editEditorial, showAddModal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editEditorial) {
      updateEditorial.mutate({ id: editEditorial.id, name: form.name.trim() });
    } else {
      createEditorial.mutate({ name: form.name.trim() });
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex w-full max-w-xl flex-row items-center gap-4">
          <Input
            placeholder="Buscar editorial"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md"
          />
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-berkeley-blue hover:bg-berkeley-blue/90">
          <Plus className="mr-2 h-4 w-4" /> Agregar Editorial
        </Button>
      </div>
      <Card className="shadow-sm">
        <CardContent className="px-6 py-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : editorials.length > 0 ? (
                  editorials.map(editorial => (
                    <TableRow key={editorial.id}>
                      <TableCell>{editorial.name}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setEditEditorial(editorial)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteEditorial(editorial)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="py-8 text-center text-gray-500">
                      {search.trim() ? "No hay editoriales que coincidan con la búsqueda" : "No hay editoriales disponibles"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {pagination && pagination.totalPages > 1 && (
        <PaginationControls
          className="mt-6"
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          onPageChange={p => {
            if (p >= 1 && p <= pagination.totalPages) setPage(p);
          }}
        />
      )}
      {/* Modal de agregar/editar */}
      {(showAddModal || editEditorial) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md space-y-4 relative">
            <h2 className="text-lg font-semibold mb-2">{editEditorial ? "Editar Editorial" : "Agregar Editorial"}</h2>
            <Input placeholder="Nombre *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => { setShowAddModal(false); setEditEditorial(null); }}>Cancelar</Button>
              <Button type="submit" className="bg-berkeley-blue hover:bg-berkeley-blue/90" disabled={createEditorial.isPending || updateEditorial.isPending}>
                {createEditorial.isPending || updateEditorial.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </div>
      )}
      {/* Modal de confirmación de borrado */}
      {deleteEditorial && (
        <AlertDialog open={!!deleteEditorial} onOpenChange={open => { if (!open) setDeleteEditorial(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar editorial?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará la editorial <strong>{deleteEditorial.name}</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteEditorialMutation.mutate({ id: deleteEditorial.id })} disabled={deleteEditorialMutation.isPending} className="bg-red-600 hover:bg-red-700">
                {deleteEditorialMutation.isPending ? "Eliminando..." : "Eliminar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}