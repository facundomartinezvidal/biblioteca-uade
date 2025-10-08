"use client";

import { X, RotateCcw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import Image from "next/image";
import { useEffect } from "react";

interface LoanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: {
    id: string;
    userId: string;
    endDate: string;
    status: string;
    createdAt: string;
    book: {
      id: string;
      title: string;
      description: string;
      isbn: string;
      status: string;
      year: number;
      editorial: string;
      imageUrl: string | null;
      createdAt: string;
    };
    author: {
      id: string;
      name: string;
      middleName: string;
      lastName: string;
      createdAt: string;
    };
    gender: {
      id: string;
      name: string;
      createdAt: string;
    };
    location: {
      id: string;
      address: string;
      campus: string;
      createdAt: string;
    };
  };
}

// Function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-600 text-white";
    case "RESERVED":
      return "bg-blue-500 text-white";
    case "FINISHED":
      return "bg-gray-600 text-white";
    case "EXPIRED":
      return "bg-red-600 text-white";
    case "CANCELLED":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

// Function to get status text
const getStatusText = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "Activo";
    case "RESERVED":
      return "Reservado";
    case "FINISHED":
      return "Finalizado";
    case "EXPIRED":
      return "Vencido";
    case "CANCELLED":
      return "Cancelado";
    default:
      return status;
  }
};

// Function to get action button text and variant
const getActionButton = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return {
        text: "Cancelar Préstamo",
        variant: "destructive" as const,
        icon: null
      };
    case "RESERVED":
      return {
        text: "Cancelar Préstamo",
        variant: "destructive" as const,
        icon: null
      };
    case "FINISHED":
      return {
        text: "Renovar",
        variant: "default" as const,
        icon: <RotateCcw className="h-4 w-4" />
      };
    case "EXPIRED":
    case "CANCELLED":
      return {
        text: "Reservar",
        variant: "default" as const,
        icon: null
      };
    default:
      return {
        text: "Acción",
        variant: "default" as const,
        icon: null
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

export default function LoanDetailsModal({ isOpen, onClose, loan }: LoanDetailsModalProps) {
  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actionButton = getActionButton(loan.status);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
      onClick={(e) => {
        // Cerrar modal si se hace clic en el overlay (fondo)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()} // Evitar que se cierre al hacer clic dentro del modal
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Información de Préstamo
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Estado */}
          <div className="flex justify-center">
            <Badge className={`${getStatusColor(loan.status)} border-0 px-4 py-2 text-sm font-medium`}>
              {getStatusText(loan.status)}
            </Badge>
          </div>

          {/* Información del Libro */}
          <div className="flex gap-4">
            {/* Portada */}
            <div className="flex-shrink-0">
              <div className="relative w-20 h-28 bg-gray-200 rounded overflow-hidden">
                {loan.book.imageUrl ? (
                  <Image
                    src={loan.book.imageUrl}
                    alt={loan.book.title}
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
                <div className={`${loan.book.imageUrl ? 'hidden' : 'flex'} w-full h-full bg-gray-200 items-center justify-center text-gray-400 text-xs`}>
                  Sin imagen
                </div>
              </div>
            </div>

            {/* Detalles del libro */}
            <div className="flex-1 space-y-2">
              <div className="text-sm text-gray-600">
                {loan.gender.name}
              </div>
              <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                {loan.book.title}
              </h3>
              <div className="text-gray-600 text-sm">
                {loan.author.name} {loan.author.middleName} {loan.author.lastName}
              </div>
              <div className="text-gray-500 text-xs">
                #ISBN: {loan.book.isbn}
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">
                Fecha de reserva
              </span>
              <span className="text-sm text-gray-900">
                {formatDate(loan.createdAt)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-gray-600">
                Fecha de finalización
              </span>
              <span className="text-sm text-gray-900">
                {formatDate(loan.endDate)}
              </span>
            </div>
          </div>

          {/* Ubicación */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Ubicación
            </div>
            <div className="text-sm text-gray-900">
              {loan.location.address}
            </div>
            <div className="text-xs text-gray-500">
              Campus: {loan.location.campus}
            </div>
          </div>

          {/* Botón de acción */}
          <div className="flex gap-3 pt-4">
            <Button
              variant={actionButton.variant}
              className="flex-1 h-12"
              onClick={() => {
                // TODO: Implement corresponding action
                console.log(`Acción: ${actionButton.text} para préstamo ${loan.id}`);
              }}
            >
              {actionButton.icon && (
                <span className="mr-2">
                  {actionButton.icon}
                </span>
              )}
              {actionButton.text}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
