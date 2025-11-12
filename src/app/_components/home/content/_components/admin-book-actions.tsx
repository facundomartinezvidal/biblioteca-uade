"use client";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  BookmarkPlus,
  Loader2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { useState } from "react";
import { api } from "~/trpc/react";

interface AdminBookActionsProps {
  bookId: string;
  bookTitle: string;
  bookAuthor?: string;
  bookImageUrl?: string | null;
  bookStatus: string;
  onEdit: () => void;
  onDeleteSuccess?: () => void;
  onReserveClick: () => void;
}

export function AdminBookActions({
  bookId,
  bookTitle,
  bookStatus,
  onEdit,
  onDeleteSuccess,
  onReserveClick,
}: AdminBookActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const utils = api.useUtils();
  const deleteBookMutation = api.books.deleteBook.useMutation({
    onSuccess: async () => {
      await utils.books.getAllAdmin.invalidate();
      onDeleteSuccess?.();
      setShowDeleteDialog(false);
    },
  });

  const handleDelete = () => {
    deleteBookMutation.mutate({ id: bookId });
  };

  const isAvailable = bookStatus === "AVAILABLE";

  return (
    <>
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
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onReserveClick} disabled={!isAvailable}>
            <BookmarkPlus className="mr-2 h-4 w-4" />
            Prestar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Alert Dialog para confirmar eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              libro <strong>&quot;{bookTitle}&quot;</strong> de la base de
              datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteBookMutation.isPending}
            >
              {deleteBookMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
