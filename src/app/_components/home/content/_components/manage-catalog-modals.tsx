"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2, Pencil, Trash2, X } from "lucide-react";
import { createPortal } from "react-dom";

interface BaseItem { id: string; name: string; middleName?: string | null; lastName?: string | null; }

interface ManageCatalogModalsProps {
  open: boolean;
  onClose: () => void;
  type: "author" | "gender" | "editorial";
}

// Reusable list + edit/delete modal for catalog entities
export function ManageCatalogModals({ open, onClose, type }: ManageCatalogModalsProps) {
  const [mounted, setMounted] = useState(false);
  const [editingItem, setEditingItem] = useState<BaseItem | null>(null);
  const [name, setName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const utils = api.useUtils();

  // Queries
  const authorsQuery = api.catalog.getAllAuthors.useQuery(undefined, { enabled: type === "author" });
  const gendersQuery = api.catalog.getAllGenders.useQuery(undefined, { enabled: type === "gender" });
  const editorialsQuery = api.catalog.getAllEditorials.useQuery(undefined, { enabled: type === "editorial" });

  const rawList: BaseItem[] = (type === "author"
    ? authorsQuery.data?.response?.map(a => ({ id: a.id, name: a.name, middleName: a.middleName, lastName: a.lastName }))
    : type === "gender"
    ? gendersQuery.data?.response?.map(g => ({ id: g.id, name: g.name }))
    : editorialsQuery.data?.response?.map(e => ({ id: e.id, name: e.name }))
  ) || [];

  const [search, setSearch] = useState("");
  const list = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rawList;
    return rawList.filter(item => {
      const composite = `${item.name} ${item.middleName ?? ""} ${item.lastName ?? ""}`.toLowerCase();
      return composite.includes(term);
    });
  }, [rawList, search]);

  // Mutations
  const updateAuthor = api.catalog.updateAuthor.useMutation({
    onSuccess: async () => { await utils.catalog.getAllAuthors.invalidate(); resetState(); },
    onError: err => setErrorMsg(err.message),
  });
  const deleteAuthor = api.catalog.deleteAuthor.useMutation({
    onSuccess: async () => { await utils.catalog.getAllAuthors.invalidate(); resetState(); },
    onError: err => setErrorMsg(err.message),
  });
  const updateGender = api.catalog.updateGender.useMutation({
    onSuccess: async () => { await utils.catalog.getAllGenders.invalidate(); resetState(); },
    onError: err => setErrorMsg(err.message),
  });
  const deleteGender = api.catalog.deleteGender.useMutation({
    onSuccess: async () => { await utils.catalog.getAllGenders.invalidate(); resetState(); },
    onError: err => setErrorMsg(err.message),
  });
  const updateEditorial = api.catalog.updateEditorial.useMutation({
    onSuccess: async () => { await utils.catalog.getAllEditorials.invalidate(); resetState(); },
    onError: err => setErrorMsg(err.message),
  });
  const deleteEditorial = api.catalog.deleteEditorial.useMutation({
    onSuccess: async () => { await utils.catalog.getAllEditorials.invalidate(); resetState(); },
    onError: err => setErrorMsg(err.message),
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
    setMiddleName(item.middleName || "");
    setLastName(item.lastName || "");
  };

  const handleUpdate = () => {
    if (!editingItem) return;
    if (!name.trim()) { setErrorMsg("El nombre es obligatorio"); return; }

    if (type === "author") {
      if (!lastName.trim()) { setErrorMsg("El apellido es obligatorio"); return; }
      updateAuthor.mutate({ id: editingItem.id, name: name.trim(), middleName: middleName.trim() || undefined, lastName: lastName.trim() });
    } else if (type === "gender") {
      updateGender.mutate({ id: editingItem.id, name: name.trim() });
    } else if (type === "editorial") {
      updateEditorial.mutate({ id: editingItem.id, name: name.trim() });
    }
  };

  const handleDelete = (item: BaseItem) => {
    if (type === "author") deleteAuthor.mutate({ id: item.id });
    else if (type === "gender") deleteGender.mutate({ id: item.id });
    else deleteEditorial.mutate({ id: item.id });
  };

  const anyPending = updateAuthor.isPending || updateGender.isPending || updateEditorial.isPending || deleteAuthor.isPending || deleteGender.isPending || deleteEditorial.isPending;

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", esc); else resetState();
    return () => document.removeEventListener("keydown", esc);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold capitalize">Gestionar {type === "gender" ? "géneros" : type === "author" ? "autores" : "editoriales"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
        </div>
        <div className="flex flex-1 flex-col md:flex-row min-h-0">
          <div className="w-full md:w-1/2 border-r p-4 flex flex-col min-h-0">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex-1">
                <Input
                  placeholder={`Buscar ${type === "author" ? "autor" : type === "gender" ? "género" : "editorial"}`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="h-9"
                />
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">{list.length}/{rawList.length}</span>
            </div>
            <div className="overflow-y-auto flex-1 pr-1">
              {list.length === 0 ? (
                <p className="text-sm text-gray-500">No hay elementos.</p>
              ) : (
                <ul className="space-y-2">
                  {list.map(item => (
                    <li key={item.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm bg-white hover:bg-gray-50 transition-colors">
                      <span className="truncate max-w-[60%]">
                        {type === "author" ? `${item.name} ${item.middleName ?? ""} ${item.lastName ?? ""}`.trim() : item.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => startEdit(item)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(item)} disabled={anyPending}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2 p-4 flex flex-col gap-4 min-h-0 overflow-y-auto">
            <h3 className="text-sm font-medium">{editingItem ? "Editar" : "Selecciona un elemento"}</h3>
            {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}
            {editingItem && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                {type === "author" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="middleName">Segundo Nombre</Label>
                      <Input id="middleName" value={middleName} onChange={e => setMiddleName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido *</Label>
                      <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div>
                  </>
                )}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetState}>Cancelar</Button>
                  <Button onClick={handleUpdate} disabled={anyPending || !name.trim() || (type === "author" && !lastName.trim())}>
                    {anyPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
