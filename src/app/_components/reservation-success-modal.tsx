"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, CheckCircle, Info, User, BookOpen, Tag } from "lucide-react";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { formatISBN } from "~/lib/utils";

interface ReservationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    title: string;
    author: string;
    editor: string;
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
  book,
}: ReservationSuccessModalProps) {
  const router = useRouter();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleGoHome = () => {
    onClose();
    router.push("/");
  };

  const handleGoToLoans = () => {
    onClose();
    router.push("/loans");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay con efecto blur */}
      <div
        className="fixed inset-0 bg-white/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header del modal */}
        <div className="relative p-6 pb-4">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

          {/* Success title */}
          <div className="mb-2 flex items-center justify-center gap-3">
            <CheckCircle className="text-berkeley-blue h-8 w-8" />
            <h2 className="text-2xl font-bold text-gray-900">
              Reserva exitosa!
            </h2>
          </div>

          <p className="text-center text-sm text-gray-600">
            Realizaste una reserva por el siguiente libro
          </p>
        </div>

        {/* Contenido del modal */}
        <div className="px-6 pb-6">
          {/* Celebration image */}
          <div className="mb-6 flex justify-center">
            <Image
              src="/booky-success.png"
              alt="Celebration"
              width={130}
              height={130}
            />
          </div>

          {/* Book information */}
          <div className="mb-6 rounded-xl bg-gray-50 p-4">
            <div className="flex gap-4">
              {/* Portada del libro */}
              <div className="flex-shrink-0">
                <div className="relative h-28 w-18 overflow-hidden rounded bg-gray-200 shadow-sm">
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

              {/* Detalles del libro */}
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="flex-1 text-lg leading-tight font-bold text-gray-900">
                    {book.title}
                  </h3>
                  <span className="text-berkeley-blue ml-2 flex-shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap">
                    <Tag className="mr-1 inline h-4 w-4" />
                    {book.gender}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  <User className="mr-1 mb-0.5 inline h-4 w-4" />
                  {book.author} {book.authorMiddleName} {book.authorLastName}
                </p>

                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <BookOpen className="inline h-4 w-4" />
                  <span>{book.editor}</span>
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span className="text-xs">#</span>
                  <span>ISBN: {formatISBN(book.isbn)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Important information */}
          <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <Info className="text-berkeley-blue mt-0.5 h-5 w-5 flex-shrink-0" />
              <p className="text-berkeley-blue text-sm leading-relaxed">
                Tenes hasta 24 horas para retirar el libro, de lo contrario la
                reserva será dada de baja.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleGoToLoans}
              className="bg-berkeley-blue hover:bg-berkeley-blue/90 flex-1 rounded-lg py-3 font-semibold text-white"
            >
              Ver Mis Préstamos
            </Button>
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="flex-1 rounded-lg py-3 font-semibold"
            >
              Volver a Inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
