import { useState, useMemo, useEffect } from "react";
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

interface Gender {
  id: string;
  name: string;
}

export function AdminGendersTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editGender, setEditGender] = useState<Gender | null>(null);
  const [deleteGender, setDeleteGender] = useState<Gender | null>(null);
  const utils = api.useUtils();

  const { data, isLoading } = api.catalog.getAllGenders.useQuery();
  const allGenders = data?.response ?? [];
  // Filtrado frontend
  const filtered = search.trim()
    ? allGenders.filter(g => g.name && g.name.toLowerCase().includes(search.trim().toLowerCase()))
    : allGenders;
  // Paginación frontend
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const genders = filtered.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => { setPage(1); }, [search]);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // Mutations
  const createGender = api.catalog.createGender.useMutation({
    onSuccess: async () => { await utils.catalog.getAllGenders.invalidate(); setShowAddModal(false); },
  });
  const updateGender = api.catalog.updateGender.useMutation({
    onSuccess: async () => { await utils.catalog.getAllGenders.invalidate(); setEditGender(null); },
  });
  const deleteGenderMutation = api.catalog.deleteGender.useMutation({
    onSuccess: async () => { await utils.catalog.getAllGenders.invalidate(); setDeleteGender(null); },
  });

  // Form state
  const [form, setForm] = useState({ name: "" });
  useEffect(() => {
    if (editGender) setForm({ name: editGender.name });
    else setForm({ name: "" });
  }, [editGender, showAddModal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editGender) {
      updateGender.mutate({ id: editGender.id, name: form.name.trim() });
    } else {
      createGender.mutate({ name: form.name.trim() });
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex w-full max-w-xl flex-row items-center gap-4">
          <Input
            placeholder="Buscar género"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md"
          />
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-berkeley-blue hover:bg-berkeley-blue/90">
          <Plus className="mr-2 h-4 w-4" /> Agregar Género
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
                      <TableCell className="text-right"><Skeleton className="h-8 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : genders.length > 0 ? (
                  genders.map(gender => (
                    <TableRow key={gender.id}>
                      <TableCell>{gender.name}</TableCell>
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
                            <DropdownMenuItem onClick={() => setEditGender(gender)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteGender(gender)}
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
                      {search.trim() ? "No hay géneros que coincidan con la búsqueda" : "No hay géneros disponibles"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {totalPages > 1 && (
        <PaginationControls
          className="mt-6"
          currentPage={page}
          totalPages={totalPages}
          hasNextPage={page < totalPages}
          hasPreviousPage={page > 1}
          onPageChange={p => { if (p >= 1 && p <= totalPages) setPage(p); }}
        />
      )}
      {/* Modal de agregar/editar */}
      {(showAddModal || editGender) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md space-y-4 relative">
            <h2 className="text-lg font-semibold mb-2">{editGender ? "Editar Género" : "Agregar Género"}</h2>
            <Input placeholder="Nombre *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => { setShowAddModal(false); setEditGender(null); }}>Cancelar</Button>
              <Button type="submit" className="bg-berkeley-blue hover:bg-berkeley-blue/90" disabled={createGender.isPending || updateGender.isPending}>
                {createGender.isPending || updateGender.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </div>
      )}
      {/* Modal de confirmación de borrado */}
      {deleteGender && (
        <AlertDialog open={!!deleteGender} onOpenChange={open => { if (!open) setDeleteGender(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar género?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará el género <strong>{deleteGender.name}</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteGenderMutation.mutate({ id: deleteGender.id })} disabled={deleteGenderMutation.isPending} className="bg-red-100 text-red-600 hover:bg-red-200 border-0">
                {deleteGenderMutation.isPending ? "Eliminando..." : "Eliminar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}