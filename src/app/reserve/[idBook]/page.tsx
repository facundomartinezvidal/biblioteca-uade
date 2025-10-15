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
        <main className="container mx-auto py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left section - Book information skeleton */}
            <div className="flex flex-col">
              <h2 className="text-berkeley-blue mb-6 text-xl font-semibold">
                Información del libro
              </h2>

              <Card className="flex-1 shadow-sm">
                <CardContent className="flex h-full flex-col">
                  <div className="flex gap-6">
                    {/* Portada skeleton */}
                    <div className="flex-shrink-0">
                      <Skeleton className="h-64 w-44 rounded" />
                    </div>

                    {/* Book information skeleton */}
                    <div className="flex flex-1 flex-col space-y-6">
                      <div>
                        <Skeleton className="mb-1 h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-10" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sinopsis skeleton */}
                  <div className="pt-3">
                    <Skeleton className="mb-2 h-5 w-20" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right section - Reservation details skeleton */}
            <div className="flex flex-col">
              <h2 className="text-berkeley-blue mb-6 text-xl font-semibold">
                Detalles de la Reserva
              </h2>

              <Card className="flex-1 shadow-sm">
                <CardContent className="flex h-full flex-col space-y-3">
                  {/* Loan period skeleton */}
                  <Skeleton className="h-14 w-full rounded-lg" />

                  {/* Fechas skeleton */}
                  <div className="space-y-1.5">
                    <div>
                      <Skeleton className="mb-0.5 h-4 w-16" />
                      <Skeleton className="h-16 w-full rounded-lg" />
                    </div>
                    <div>
                      <Skeleton className="mb-0.5 h-4 w-16" />
                      <Skeleton className="h-16 w-full rounded-lg" />
                    </div>
                  </div>

                  {/* Information box skeleton */}
                  <Skeleton className="h-20 w-full rounded-lg" />

                  {/* Checkbox skeleton */}
                  <Skeleton className="h-6 w-full" />

                  {/* Pickup information skeleton */}
                  <Skeleton className="h-20 w-full rounded-lg" />

                  {/* Confirm button skeleton */}
                  <div className="mt-auto pt-1">
                    <Skeleton className="h-9 w-full rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recommended books skeleton */}
          <div className="mt-12">
            <h2 className="text-berkeley-blue mb-6 text-xl font-semibold">
              Podría interesarte...
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <BookCardSkeleton />
              <BookCardSkeleton />
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
      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left section - Book information */}
          <div className="flex flex-col">
            <h2 className="text-berkeley-blue mb-6 text-xl font-semibold">
              Infromación del libro
            </h2>

            <Card className="flex-1 shadow-sm">
              <CardContent className="flex h-full flex-col">
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
                  <div className="flex flex-1 flex-col space-y-6">
                    <div>
                      <h3 className="mb-1 text-2xl font-bold text-gray-900">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {book.author} {book.authorMiddleName}{" "}
                        {book.authorLastName}
                      </p>
                    </div>

                    <div className="flex flex-1 flex-col justify-between text-sm">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
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
                        <div>
                          <span className="font-semibold text-gray-700">
                            Sede
                          </span>
                          <p className="text-gray-600">
                            {book.location ?? "No especificada"}
                          </p>
                        </div>
                        <div>
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
                    </div>
                  </div>
                </div>

                {/* Sinopsis fuera del flex de la imagen */}
                <div className="pt-3">
                  <h4 className="mb-2 font-semibold text-gray-900">Sinopsis</h4>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {book.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right section - Reservation details */}
          <div className="flex flex-col">
            <h2 className="text-berkeley-blue mb-6 text-xl font-semibold">
              Detalles de la Reserva
            </h2>

            <Card className="flex-1 shadow-sm">
              <CardContent className="flex h-full flex-col space-y-3">
                {/* Loan period */}
                <div className="rounded-lg bg-blue-50 p-2.5">
                  <div className="flex items-start gap-2">
                    <Clock className="text-berkeley-blue mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                    <p className="text-sm leading-tight font-semibold text-gray-900">
                      Período de préstamo: 7 días (no modificable)
                    </p>
                  </div>
                </div>

                {/* Fechas */}
                <div className="space-y-1.5">
                  <div>
                    <p className="mb-0.5 text-sm font-medium text-gray-500">
                      Desde
                    </p>
                    <div className="rounded-lg border border-gray-200 bg-white p-1.5">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(reservationDate)}
                      </p>
                      <p className="text-sm leading-tight text-gray-500 capitalize">
                        {formatDateFull(reservationDate)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-0.5 text-sm font-medium text-gray-500">
                      Hasta
                    </p>
                    <div className="rounded-lg border border-gray-200 bg-white p-1.5">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(returnDate)}
                      </p>
                      <p className="text-sm leading-tight text-gray-500 capitalize">
                        {formatDateFull(returnDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Information box */}
                <div className="rounded-lg bg-orange-50 p-2.5">
                  <p className="text-[11px] leading-tight text-gray-700">
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
                <div>
                  <label className="flex cursor-pointer items-start gap-2">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="text-berkeley-blue focus:ring-berkeley-blue mt-0.5 h-3.5 w-3.5 cursor-pointer rounded border-gray-300"
                    />
                    <span className="text-[11px] leading-tight text-gray-700">
                      Acepto los términos y condiciones
                    </span>
                  </label>
                </div>

                {/* Pickup information */}
                <div className="rounded-lg bg-gray-50 p-2.5">
                  <p className="text-[11px] leading-tight text-gray-700">
                    Una vez confirmada la reserva, tu libro estará disponible
                    por 24 horas para su retiro en la sede correspondiente. En
                    caso de no ser retirado, el préstamo será cancelado (Podrían
                    aplicarse multas y/o sanciones).
                  </p>
                </div>

                {/* Confirm button */}
                <div className="mt-auto pt-1">
                  <Button
                    onClick={handleReserve}
                    disabled={!termsAccepted || book.status !== "AVAILABLE"}
                    className="bg-berkeley-blue hover:bg-berkeley-blue/90 h-9 w-full text-sm font-semibold text-white shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {book.status !== "AVAILABLE"
                      ? "Libro No Disponible"
                      : "Confirmar Reserva"}
                  </Button>
                  {book.status !== "AVAILABLE" && (
                    <p className="mt-1.5 text-center text-[10px] text-red-600">
                      Este libro no está disponible para reserva
                    </p>
                  )}
                  {!termsAccepted && book.status === "AVAILABLE" && (
                    <p className="mt-1.5 text-center text-[10px] text-gray-500">
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
            editor: book.editorial ?? "",
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
