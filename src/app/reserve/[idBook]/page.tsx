"use client";

import Link from "next/link";
import { Clock, ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import ReservationSuccessModal from "~/app/_components/reservation-success-modal";
import BookCard from "~/app/_components/home/book-card";
import BookCardSkeleton from "~/app/_components/home/book-card-skeleton";

// Obtener libros recomendados desde la API

export default function ReservePage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const params = useParams();
  const router = useRouter();
  const bookId = params.idBook as string;

  // Obtener datos del libro desde la API
  const { data: bookData, isLoading: bookLoading } = api.books.getById.useQuery(
    { id: bookId },
    { enabled: !!bookId },
  );

  // Obtener libros recomendados (excluyendo el libro actual)
  const { data: recommendedBooksData, isLoading: recommendedLoading } =
    api.books.getAll.useQuery({
      page: 1,
      limit: 10,
    });

  const book = bookData?.response?.[0];

  // Filtrar libros recomendados (excluir el libro actual y tomar solo algunos)
  const recommendedBooks =
    recommendedBooksData?.response
      ?.filter((recBook) => recBook.id !== bookId)
      ?.slice(0, 2) ?? [];

  // Calcular fechas
  const reservationDate = new Date();
  const returnDate = new Date();
  returnDate.setDate(reservationDate.getDate() + 7); // 7 días de préstamo

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateFull = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleReserve = () => {
    if (!termsAccepted) {
      alert("Debes aceptar los términos y condiciones para continuar");
      return;
    }

    if (!book) {
      alert("No se pudo cargar la información del libro");
      return;
    }

    if (book.status !== "AVAILABLE") {
      alert("Este libro no está disponible para reserva");
      return;
    }

    // TODO: Implementar lógica de reserva real
    console.log("Reserva confirmada para:", book.title);

    // Mostrar modal de confirmación
    setShowSuccessModal(true);
  };

  // Mostrar loading si no hay datos
  if (bookLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white">
          <div className="container mx-auto px-8 py-4">
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <main className="container mx-auto px-8 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <Skeleton className="mb-6 h-8 w-48" />
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <Skeleton className="h-48 w-32 rounded" />
                    <div className="flex-1 space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Skeleton className="mb-6 h-8 w-48" />
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <Skeleton className="h-16 w-full rounded-lg" />
                    <div className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error if book not found
  if (!book) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Libro no encontrado
          </h1>
          <p className="mb-6 text-gray-600">
            El libro que buscas no está disponible.
          </p>
          <Button asChild>
            <Link href="/">Volver al Inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con botón Volver */}
      <div className="bg-white py-4">
        <div className="container mx-auto px-8">
          <Button
            variant="ghost"
            asChild
            className="text-berkeley-blue hover:text-berkeley-blue/80 -ml-2"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al Inicio
            </Link>
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          {/* Left section - Book information */}
          <div>
            <h2 className="text-berkeley-blue mb-6 text-xl font-semibold">
              Infromación del libro
            </h2>

            <Card className="h-full shadow-sm">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Portada del libro */}
                  <div className="flex-shrink-0">
                    <div className="relative h-64 w-44 overflow-hidden rounded bg-gray-200 shadow-md">
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

                  {/* Book information */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="mb-1 text-2xl font-bold text-gray-900">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {book.author} {book.authorMiddleName}{" "}
                        {book.authorLastName}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <span className="font-semibold text-gray-700">
                            ISBN
                          </span>
                          <p className="text-gray-600">{book.isbn}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">
                            Género
                          </span>
                          <p className="text-gray-600">{book.gender}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">
                            Año
                          </span>
                          <p className="text-gray-600">{book.year}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">
                            Editorial
                          </span>
                          <p className="text-gray-600">{book.editorial}</p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <span className="font-semibold text-gray-700">
                          Sede
                        </span>
                        <p className="text-gray-600">
                          {book.location ?? "No especificada"}
                        </p>
                      </div>

                      <div className="pt-2">
                        <span className="font-semibold text-gray-700">
                          Ubicación
                        </span>
                        <p className="text-gray-600">
                          {book.location
                            ? book.location
                                .split(",")
                                .slice(1)
                                .join(",")
                                .trim() || book.location
                            : "No especificada"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <h4 className="mb-2 font-semibold text-gray-900">
                        Sinopsis
                      </h4>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {book.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right section - Reservation details */}
          <div>
            <h2 className="text-berkeley-blue mb-6 text-xl font-semibold">
              Detalles de la Reserva
            </h2>

            <Card className="h-full shadow-sm">
              <CardContent className="space-y-6 p-6">
                {/* Loan period */}
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Período de préstamo: 7 días (no modificable)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fechas */}
                <div className="space-y-3">
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-500">
                      Desde
                    </p>
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(reservationDate)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {formatDateFull(reservationDate)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-500">
                      Hasta
                    </p>
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(returnDate)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {formatDateFull(returnDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Information box */}
                <div className="rounded-lg bg-orange-50 p-4">
                  <p className="text-xs leading-relaxed text-gray-700">
                    Al realizar esta reserva, acepto cumplir con las normas de
                    la biblioteca, devolver el libro en la fecha establecida y
                    hacerme responsable por cualquier daño o pérdida del
                    material.{" "}
                    <Link
                      href="/terms-and-conditions"
                      className="text-berkeley-blue font-medium underline"
                    >
                      Ver términos y condiciones
                    </Link>
                  </p>
                </div>

                {/* Checkbox para aceptar términos */}
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="text-berkeley-blue focus:ring-berkeley-blue mt-1 h-4 w-4 cursor-pointer rounded border-gray-300"
                    />
                    <span className="text-sm leading-relaxed text-gray-700">
                      Acepto los términos y condiciones
                    </span>
                  </label>
                </div>

                {/* Pickup information */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs leading-relaxed text-gray-700">
                    Una vez confirmada la reserva, tu libro estará disponible
                    por 24 horas para su retiro en la sede correspondiente. En
                    caso de no ser retirado, el préstamo será cancelado (Podrían
                    aplicarse multas y/o sanciones).
                  </p>
                </div>

                {/* Confirm button */}
                <div className="pt-2">
                  <Button
                    onClick={handleReserve}
                    disabled={!termsAccepted || book.status !== "AVAILABLE"}
                    className="bg-berkeley-blue hover:bg-berkeley-blue/90 h-12 w-full text-base font-semibold text-white shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {book.status !== "AVAILABLE"
                      ? "Libro No Disponible"
                      : "Confirmar Reserva"}
                  </Button>
                  {book.status !== "AVAILABLE" && (
                    <p className="mt-2 text-center text-xs text-red-600">
                      Este libro no está disponible para reserva
                    </p>
                  )}
                  {!termsAccepted && book.status === "AVAILABLE" && (
                    <p className="mt-2 text-center text-xs text-gray-500">
                      Debes aceptar los términos y condiciones para continuar
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommended books section */}
        <div className="mt-12">
          <h2 className="text-berkeley-blue mb-6 text-xl font-semibold">
            Podría interesarte...
          </h2>

          {recommendedLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <BookCardSkeleton key={index} />
              ))}
            </div>
          ) : recommendedBooks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {recommendedBooks.map((recBook) => (
                <BookCard
                  key={recBook.id}
                  title={recBook.title}
                  authorFirstName={recBook.author ?? ""}
                  authorMiddleName={recBook.authorMiddleName ?? ""}
                  authorLastName={recBook.authorLastName ?? ""}
                  editorial={recBook.editorial ?? ""}
                  year={recBook.year ?? 0}
                  category={recBook.gender ?? ""}
                  description={recBook.description ?? ""}
                  isbn={recBook.isbn}
                  location={recBook.location ?? ""}
                  available={recBook.status === "AVAILABLE"}
                  coverUrl={recBook.imageUrl}
                  onReserve={() => router.push(`/reserve/${recBook.id}`)}
                  onViewMore={() => {
                    // TODO: Implementar modal de vista detallada o navegar a una página de detalles
                    console.log("Ver más:", recBook.id);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">
                No hay libros recomendados disponibles en este momento.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Reservation success confirmation modal */}
      {book && (
        <ReservationSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          book={{
            title: book.title,
            author: book.author,
            authorMiddleName: book.authorMiddleName ?? undefined,
            authorLastName: book.authorLastName ?? undefined,
            isbn: book.isbn,
            gender: book.gender,
            imageUrl: book.imageUrl ?? undefined,
          }}
        />
      )}
    </div>
  );
}
