"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, CheckCircle, Info } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import Image from "next/image";

interface ReservationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    title: string;
    author: string;
    authorMiddleName?: string;
    authorLastName?: string;
    isbn: string;
    gender: string;
    imageUrl?: string;
  };
}

export default function ReservationSuccessModal({ 
  isOpen, 
  onClose, 
  book 
}: ReservationSuccessModalProps) {
  const router = useRouter();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleGoHome = () => {
    onClose();
    router.push('/');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
      {/* Overlay con fondo semi-transparente */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header del modal */}
        <div className="relative p-6 pb-4">
          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

          {/* Título de éxito */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Reserva exitosa!
            </h2>
          </div>
          
          <p className="text-center text-gray-600 text-sm">
            Realizaste una reserva por el siguiente libro
          </p>
        </div>

        {/* Contenido del modal */}
        <div className="px-6 pb-6">
          {/* Imagen de celebración */}
          <div className="flex justify-center mb-6">
            <div className="text-6xl">
              🎉
            </div>
          </div>

          {/* Información del libro */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex gap-4">
              {/* Portada del libro */}
              <div className="flex-shrink-0">
                <div className="relative w-16 h-24 bg-gray-200 rounded overflow-hidden shadow-sm">
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

              {/* Detalles del libro */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {book.gender}
                  </Badge>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 leading-tight">
                  {book.title}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-xs">👤</span>
                  <span>{book.author} {book.authorMiddleName} {book.authorLastName}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-xs">#</span>
                  <span>ISBN: {book.isbn}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Información importante */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800 leading-relaxed">
                Tenes hasta 24 horas para retirar el libro, de lo contrario la reserva será dada de baja.
              </p>
            </div>
          </div>

          {/* Botón de acción */}
          <Button
            onClick={handleGoHome}
            className="w-full bg-berkeley-blue hover:bg-berkeley-blue/90 text-white font-semibold py-3 rounded-lg"
          >
            Volver a Inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
