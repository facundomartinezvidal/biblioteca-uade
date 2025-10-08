"use client";

import { X, DollarSign, AlertTriangle, BookOpen, User, Hash, Calendar, Bookmark } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface PenaltyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  penalty: {
    id: string;
    bookId: string;
    status: string;
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

// Function to get badge status
const getStatusBadge = (status: string) => {
  switch (status) {
    case "PAID":
      return {
        badge: <Badge className="bg-green-100 text-green-800 border-green-200">Pagada</Badge>,
        icon: "✅",
        color: "green"
      };
    case "PENDING":
      return {
        badge: <Badge className="bg-red-100 text-red-800 border-red-200">Pendiente de pago</Badge>,
        icon: "⚠️",
        color: "red"
      };
    case "RESERVED":
      return {
        badge: <Badge className="bg-purple-100 text-purple-800 border-purple-200">Reservado</Badge>,
        icon: "📋",
        color: "purple"
      };
    default:
      return {
        badge: <Badge variant="secondary">Desconocido</Badge>,
        icon: "❓",
        color: "gray"
      };
  }
};

// Function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function PenaltyDetailsModal({ isOpen, onClose, penalty, book }: PenaltyDetailsModalProps) {
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

  const statusInfo = getStatusBadge(penalty.status);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Información de Multa
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          {/* Estado de la multa */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${statusInfo.color === 'red' ? 'bg-red-100' : statusInfo.color === 'green' ? 'bg-green-100' : 'bg-purple-100'}`}>
              <AlertTriangle className={`h-5 w-5 ${statusInfo.color === 'red' ? 'text-red-600' : statusInfo.color === 'green' ? 'text-green-600' : 'text-purple-600'}`} />
            </div>
            {statusInfo.badge}
          </div>

          {/* Valor de la multa */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <span className="text-sm text-gray-600">Valor: </span>
              <span className="text-lg font-bold text-gray-900">${penalty.amount}</span>
            </div>
          </div>

          {/* Motivo y sanciones */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-700">•</span>
              <span className="text-sm text-gray-700">
                <span className="font-medium">Motivo:</span> Devolución tardía del libro.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-700">•</span>
              <span className="text-sm text-gray-700">
                <span className="font-medium">Tipo de sanción asociada</span> → bloqueo de cancelaciones, suspensión de préstamos, etc.
              </span>
            </div>
          </div>

          {/* Enlace a política de sanciones */}
          <div className="flex justify-end">
            <Button variant="link" asChild className="text-blue-600 hover:text-blue-800 p-0 h-auto text-sm">
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
                <div className="relative w-20 h-28 bg-gray-200 rounded overflow-hidden shadow-md">
                  {book.imageUrl ? (
                    <Image
                      src={book.imageUrl}
                      alt={book.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const nextElement = target.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div className={`${book.imageUrl ? 'hidden' : 'flex'} w-full h-full bg-gray-200 items-center justify-center text-gray-400 text-xs`}>
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
                
                <h4 className="font-bold text-gray-900">
                  {book.title}
                </h4>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{book.author}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Hash className="h-4 w-4" />
                  <span>ISBN: {book.isbn}</span>
                </div>
              </div>
            </div>

            {/* Fechas del préstamo */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Fecha de reserva</span>
                </div>
                <span className="font-bold text-gray-900">
                  {formatDate(penalty.fromDate)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
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
