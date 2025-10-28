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
import { useState } from "react";

interface AdminBookRowProps {
  id: string;
  title: string;
  description?: string | null;
  author?: string | null;
  authorMiddleName?: string | null;
  authorLastName?: string | null;
  authorId: string;
  isbn: string;
  year?: number | null;
  editorial?: string | null;
  editorialId: string;
  status: string;
  genderId: string;
  gender?: string | null;
  location?: string | null;
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
  imageUrl,
  onDeleteSuccess,
}: AdminBookRowProps) {
  const [showEditModal, setShowEditModal] = useState(false);

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
              <p className="truncate text-sm text-gray-600">
                {formatAuthorName(author, authorMiddleName, authorLastName)}
              </p>
            </div>
          </div>
        </TableCell>
        <TableCell className="text-sm">{isbn}</TableCell>
        <TableCell className="text-sm">{year}</TableCell>
        <TableCell className="text-sm">{editorial}</TableCell>
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
            onEdit={() => setShowEditModal(true)}
            onDeleteSuccess={onDeleteSuccess}
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
          editorialId,
          authorId,
          genderId,
          location,
          imageUrl,
          author,
          gender,
        }}
      />
    </>
  );
}
