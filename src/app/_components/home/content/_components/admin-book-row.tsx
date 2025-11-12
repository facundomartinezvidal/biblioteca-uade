"use client";

import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { TableCell, TableRow } from "~/components/ui/table";
import {
  getStatusColor,
  getStatusText,
  formatAuthorName,
} from "~/lib/table-utils";
import { AdminBookActions } from "./admin-book-actions";
import { EditBookModal } from "./edit-book-modal";
import { AdminReserveModal } from "./admin-reserve-modal";
import { useState } from "react";
import { formatISBN } from "~/lib/utils";

interface AdminBookRowProps {
  id: string;
  title: string;
  description?: string | null;
  author?: string | null;
  authorMiddleName?: string | null;
  authorLastName?: string | null;
  authorId: string | null;
  isbn: string;
  year?: number | null;
  editorial?: string | null;
  editorialId: string | null;
  status: string;
  genderId: string | null;
  gender?: string | null;
  location?: string | null;
  locationId?: string | null;
  imageUrl?: string | null;
  onDeleteSuccess?: () => void;
}

export function AdminBookRow({
  id,
  title,
  description,
  author,
  authorMiddleName,
  authorLastName,
  authorId,
  isbn,
  year,
  editorial,
  editorialId,
  status,
  genderId,
  gender,
  location,
  locationId,
  imageUrl,
  onDeleteSuccess,
}: AdminBookRowProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);

  const fullAuthorName = formatAuthorName(
    author,
    authorMiddleName,
    authorLastName,
  );

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded bg-gray-200">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {title}
              </p>
              <p className="truncate text-sm text-gray-600">{fullAuthorName}</p>
            </div>
          </div>
        </TableCell>
        <TableCell className="text-sm">{formatISBN(isbn)}</TableCell>
        <TableCell className="text-sm">{year ?? "-"}</TableCell>
        <TableCell className="text-sm">
          {editorial ?? "Sin editorial"}
        </TableCell>
        <TableCell className="text-sm">
          {gender ?? "Sin género"}
        </TableCell>
        <TableCell>
          <Badge
            className={`${getStatusColor(status)} border-0 text-sm font-medium`}
          >
            {getStatusText(status)}
          </Badge>
        </TableCell>
        <TableCell className="text-center">
          <AdminBookActions
            bookId={id}
            bookTitle={title}
            bookAuthor={fullAuthorName}
            bookImageUrl={imageUrl}
            bookStatus={status}
            onEdit={() => setShowEditModal(true)}
            onDeleteSuccess={onDeleteSuccess}
            onReserveClick={() => setShowReserveModal(true)}
          />
        </TableCell>
      </TableRow>

      <EditBookModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        book={{
          id,
          title,
          description,
          isbn,
          status,
          year,
          editorial,
          editorialId: editorialId ?? "",
          authorId: authorId ?? "",
          genderId: genderId ?? "",
          location,
          locationId: locationId ?? "",
          imageUrl,
          author,
          gender,
        }}
      />

      <AdminReserveModal
        isOpen={showReserveModal}
        onClose={() => setShowReserveModal(false)}
        bookId={id}
        bookTitle={title}
        bookAuthor={fullAuthorName}
        bookImageUrl={imageUrl}
        onSuccess={() => {
          // Opcionalmente mostrar un toast de éxito
          onDeleteSuccess?.(); // Reutilizamos para refrescar la tabla
        }}
      />
    </>
  );
}
