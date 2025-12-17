"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2, Pencil, Trash2, X } from "lucide-react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

interface BaseItem {
  id: string;
  name: string;
  middleName?: string | null;
  lastName?: string | null;
}

interface ManageCatalogModalsProps {
  open: boolean;
  onClose: () => void;
  // If provided, start on this tab; otherwise render all in a tabbed UI starting in "author"
  type?: "author" | "gender" | "editorial";
}

// Reusable list + edit/delete modal for catalog entities
export function ManageCatalogModals({
  open,
  onClose,
  type,
}: ManageCatalogModalsProps) {
  const [mounted, setMounted] = useState(false);
  const [activeType, setActiveType] = useState<
    "author" | "gender" | "editorial"
  >(type ?? "author");
  const [editingItem, setEditingItem] = useState<BaseItem | null>(null);
  const [name, setName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const utils = api.useUtils();

  // Sync initial tab when prop changes
  useEffect(() => {
    if (type) setActiveType(type);
  }, [type]);

  // Queries gated by active tab
  const authorsQuery = api.catalog.getAllAuthors.useQuery(
    { limit: 100 },
    { enabled: activeType === "author" && open },
  );
  const gendersQuery = api.catalog.getAllGenders.useQuery(
    { limit: 100 },
    { enabled: activeType === "gender" && open },
  );
  const editorialsQuery = api.catalog.getAllEditorials.useQuery(
    { limit: 100 },
    { enabled: activeType === "editorial" && open },
  );

  const rawList: BaseItem[] = useMemo(
    () =>
      (activeType === "author"
        ? authorsQuery.data?.response?.map((a) => ({
            id: a.id,
            name: a.name,
            middleName: a.middleName,
            lastName: a.lastName,
          }))
        : activeType === "gender"
          ? gendersQuery.data?.response?.map((g) => ({
              id: g.id,
              name: g.name,
            }))
          : editorialsQuery.data?.response?.map((e) => ({
              id: e.id,
              name: e.name,
            }))) ?? [],
    [
      activeType,
      authorsQuery.data?.response,
      gendersQuery.data?.response,
      editorialsQuery.data?.response,
    ],
  );

  const [search, setSearch] = useState("");
  const list = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rawList;
    return rawList.filter((item) => {
      const composite =
        `${item.name} ${item.middleName ?? ""} ${item.lastName ?? ""}`.toLowerCase();
      return composite.includes(term);
    });
  }, [rawList, search]);

  // Mutations
  const updateAuthor = api.catalog.updateAuthor.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.catalog.invalidate(), // Invalida todas las queries de catalog
        utils.books.invalidate(), // Invalida todas las queries de books (pueden mostrar autores)
      ]);
      toast.success("Autor actualizado exitosamente");
      resetState();
    },
    onError: (err) => {
      setErrorMsg(err.message);
      toast.error(err.message || "Error al actualizar el autor");
    },
  });
  const deleteAuthor = api.catalog.deleteAuthor.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.catalog.invalidate(), // Invalida todas las queries de catalog
        utils.books.invalidate(), // Invalida todas las queries de books
      ]);
      toast.success("Autor eliminado exitosamente");
      resetState();
    },
    onError: (err) => {
      setErrorMsg(err.message);
      toast.error(err.message || "Error al eliminar el autor");
    },
  });
  const updateGender = api.catalog.updateGender.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.catalog.invalidate(), // Invalida todas las queries de catalog
        utils.books.invalidate(), // Invalida todas las queries de books
      ]);
      toast.success("Género actualizado exitosamente");
      resetState();
    },
    onError: (err) => {
      setErrorMsg(err.message);
      toast.error(err.message || "Error al actualizar el género");
    },
  });
  const deleteGender = api.catalog.deleteGender.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.catalog.invalidate(), // Invalida todas las queries de catalog
        utils.books.invalidate(), // Invalida todas las queries de books
      ]);
      toast.success("Género eliminado exitosamente");
      resetState();
    },
    onError: (err) => {
      setErrorMsg(err.message);
      toast.error(err.message || "Error al eliminar el género");
    },
  });
  const updateEditorial = api.catalog.updateEditorial.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.catalog.invalidate(), // Invalida todas las queries de catalog
        utils.books.invalidate(), // Invalida todas las queries de books
      ]);
      toast.success("Editorial actualizada exitosamente");
      resetState();
    },
    onError: (err) => {
      setErrorMsg(err.message);
      toast.error(err.message || "Error al actualizar la editorial");
    },
  });
  const deleteEditorial = api.catalog.deleteEditorial.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.catalog.invalidate(), // Invalida todas las queries de catalog
        utils.books.invalidate(), // Invalida todas las queries de books
      ]);
      toast.success("Editorial eliminada exitosamente");
      resetState();
    },
    onError: (err) => {
      setErrorMsg(err.message);
      toast.error(err.message || "Error al eliminar la editorial");
    },
  });

  const resetState = () => {
    setEditingItem(null);
    setName("");
    setMiddleName("");
    setLastName("");
    setErrorMsg(null);
  };

  const startEdit = (item: BaseItem) => {
    setEditingItem(item);
    setName(item.name || "");
    setMiddleName(item.middleName ?? "");
    setLastName(item.lastName ?? "");
  };

  const handleUpdate = () => {
    if (!editingItem) return;
    if (!name.trim()) {
      setErrorMsg("El nombre es obligatorio");
      return;
    }

    if (activeType === "author") {
      if (!lastName.trim()) {
        setErrorMsg("El apellido es obligatorio");
        return;
      }
      updateAuthor.mutate({
        id: editingItem.id,
        name: name.trim(),
        middleName: middleName.trim() || undefined,
        lastName: lastName.trim(),
      });
    } else if (activeType === "gender") {
      updateGender.mutate({ id: editingItem.id, name: name.trim() });
    } else if (activeType === "editorial") {
      updateEditorial.mutate({ id: editingItem.id, name: name.trim() });
    }
  };

  const handleDelete = (item: BaseItem) => {
    if (activeType === "author") deleteAuthor.mutate({ id: item.id });
    else if (activeType === "gender") deleteGender.mutate({ id: item.id });
    else deleteEditorial.mutate({ id: item.id });
  };

  const anyPending =
    updateAuthor.isPending ||
    updateGender.isPending ||
    updateEditorial.isPending ||
    deleteAuthor.isPending ||
    deleteGender.isPending ||
    deleteEditorial.isPending;

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", esc);
    else resetState();
    return () => document.removeEventListener("keydown", esc);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Gestionar Catálogo</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <Tabs
          value={activeType}
          onValueChange={(v) =>
            setActiveType(v as "author" | "gender" | "editorial")
          }
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="border-b px-4 pt-3">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="author">Autores</TabsTrigger>
              <TabsTrigger value="editorial">Editoriales</TabsTrigger>
              <TabsTrigger value="gender">Géneros</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={activeType} className="min-h-0 flex-1">
            <div className="flex min-h-0 flex-1 flex-col md:flex-row">
              <div className="flex min-h-0 w-full flex-col border-r p-4 md:w-1/2">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder={`Buscar ${activeType === "author" ? "autor" : activeType === "gender" ? "género" : "editorial"}`}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <span className="text-xs whitespace-nowrap text-gray-500">
                    {list.length}/{rawList.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto pr-1">
                  {list.length === 0 ? (
                    <p className="text-sm text-gray-500">No hay elementos.</p>
                  ) : (
                    <ul className="space-y-2">
                      {list.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between rounded border bg-white px-3 py-2 text-sm transition-colors hover:bg-gray-50"
                        >
                          <span className="max-w-[60%] truncate">
                            {activeType === "author"
                              ? `${item.name} ${item.middleName ?? ""} ${item.lastName ?? ""}`.trim()
                              : item.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => startEdit(item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(item)}
                              disabled={anyPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="flex min-h-0 w-full flex-col gap-4 overflow-y-auto p-4 md:w-1/2">
                <h3 className="text-sm font-medium">
                  {editingItem ? "Editar" : "Selecciona un elemento"}
                </h3>
                {errorMsg && (
                  <Alert variant="destructive">
                    <AlertDescription>{errorMsg}</AlertDescription>
                  </Alert>
                )}
                {editingItem && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    {activeType === "author" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="middleName">Segundo Nombre</Label>
                          <Input
                            id="middleName"
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Apellido *</Label>
                          <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </>
                    )}
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetState}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleUpdate}
                        disabled={
                          anyPending ||
                          !name.trim() ||
                          (type === "author" && !lastName.trim())
                        }
                      >
                        {anyPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Guardar Cambios
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>,
    document.body,
  );
}
