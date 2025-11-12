"use client";

import {
  X,
  DollarSign,
  AlertTriangle,
  User,
  Hash,
  Calendar,
  Bookmark,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { formatISBN } from "~/lib/utils";

interface PenaltyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  penalty: {
    id: string;
    bookId: string;
    paid: boolean;
    fromDate: string;
    toDate: string;
    amount: number;
  };
  book: {
    id: string;
    title: string;
    author: string;
    isbn: string;
    gender: string;
    imageUrl: string;
  };
}

// Función para obtener el estado del badge
const getStatusBadge = (paid: boolean) => {
  if (paid) {
    return {
      badge: (
        <Badge className="border-green-200 bg-green-100 text-green-800">
          Pagada
        </Badge>
      ),
      icon: "✅",
      color: "green",
    };
  }
  return {
    badge: (
      <Badge className="border-red-200 bg-red-100 text-red-800">
        Pendiente de pago
      </Badge>
    ),
    icon: "⚠️",
    color: "red",
  };
};

// Function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function PenaltyDetailsModal({
  isOpen,
  onClose,
  penalty,
  book,
}: PenaltyDetailsModalProps) {
  // Close modal with Escape key and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const statusInfo = getStatusBadge(penalty.paid);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del modal */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Información de Multa
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4 p-6">
          {/* Estado de la multa */}
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full p-2 ${statusInfo.color === "red" ? "bg-red-100" : statusInfo.color === "green" ? "bg-green-100" : "bg-purple-100"}`}
            >
              <AlertTriangle
                className={`h-5 w-5 ${statusInfo.color === "red" ? "text-red-600" : statusInfo.color === "green" ? "text-green-600" : "text-purple-600"}`}
              />
            </div>
            {statusInfo.badge}
          </div>

          {/* Valor de la multa */}
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <span className="text-sm text-gray-600">Valor: </span>
              <span className="text-lg font-bold text-gray-900">
                ${penalty.amount}
              </span>
            </div>
          </div>

          {/* Motivo y sanciones */}
          <div className="space-y-2 rounded-lg bg-gray-50 p-4">
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-700">•</span>
              <span className="text-sm text-gray-700">
                <span className="font-medium">Motivo:</span> Devolución tardía
                del libro.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-700">•</span>
              <span className="text-sm text-gray-700">
                <span className="font-medium">Tipo de sanción asociada</span> →
                bloqueo de cancelaciones, suspensión de préstamos, etc.
              </span>
            </div>
          </div>

          {/* Enlace a política de sanciones */}
          <div className="flex justify-end">
            <Button
              variant="link"
              asChild
              className="h-auto p-0 text-sm text-blue-600 hover:text-blue-800"
            >
              <Link href="/terms-and-conditions">
                Ver política de sanciones
              </Link>
            </Button>
          </div>

          {/* Préstamo asociado */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Préstamo asociado
            </h3>

            <div className="flex gap-4">
              {/* Portada del libro */}
              <div className="flex-shrink-0">
                <div className="relative h-28 w-20 overflow-hidden rounded bg-gray-200 shadow-md">
                  {book.imageUrl ? (
                    <Image
                      src={book.imageUrl}
                      alt={book.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const nextElement =
                          target.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = "flex";
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className={`${book.imageUrl ? "hidden" : "flex"} h-full w-full items-center justify-center bg-gray-200 text-xs text-gray-400`}
                  >
                    Sin imagen
                  </div>
                </div>
              </div>

              {/* Información del libro */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Bookmark className="h-4 w-4" />
                  <span>{book.gender}</span>
                </div>

                <h4 className="font-bold text-gray-900">{book.title}</h4>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{book.author}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Hash className="h-4 w-4" />
                  <span>ISBN: {formatISBN(book.isbn)}</span>
                </div>
              </div>
            </div>

            {/* Fechas del préstamo */}
            <div className="space-y-2 border-t pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Fecha de reserva</span>
                </div>
                <span className="font-bold text-gray-900">
                  {formatDate(penalty.fromDate)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Fecha de finalización</span>
                </div>
                <span className="font-bold text-gray-900">
                  {formatDate(penalty.toDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
