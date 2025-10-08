"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Heart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import ReservationSuccessModal from "~/app/_components/reservation-success-modal";

// Obtener libros recomendados desde la API

export default function ReservePage() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const searchParams = useSearchParams();
  const bookId = searchParams.get('bookId');

  // Obtener datos del libro desde la API
  const { data: bookData, isLoading: bookLoading } = api.books.getById.useQuery(
    { id: bookId || "" },
    { enabled: !!bookId }
  );

  // Obtener libros recomendados (excluyendo el libro actual)
  const { data: recommendedBooksData, isLoading: recommendedLoading } = api.books.getAll.useQuery();
  
  const book = bookData?.response?.[0];
  
  // Filtrar libros recomendados (excluir el libro actual y tomar solo algunos)
  const recommendedBooks = recommendedBooksData?.response
    ?.filter(recBook => recBook.id !== bookId)
    ?.slice(0, 2) || [];

  // Calcular fechas
  const reservationDate = new Date();
  const returnDate = new Date();
  returnDate.setDate(reservationDate.getDate() + 7); // 7 días de préstamo

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateFull = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
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
    
    // TODO: Implementar lógica de reserva real
    console.log("Reserva confirmada para:", book.title);
    
    // Mostrar modal de confirmación
    setShowSuccessModal(true);
  };

  // Mostrar loading si no hay datos
  if (bookLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-8 py-4">
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <main className="container mx-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Skeleton className="h-8 w-48 mb-6" />
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <Skeleton className="w-32 h-48 rounded" />
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
              <Skeleton className="h-8 w-48 mb-6" />
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Libro no encontrado</h1>
          <p className="text-gray-600 mb-6">El libro que buscas no está disponible.</p>
          <Button asChild>
            <Link href="/">Volver al Inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-8 py-4">
          <Button variant="ghost" asChild className="text-berkeley-blue hover:text-berkeley-blue/80">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al Inicio
            </Link>
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left section - Book information */}
          <div>
            <h2 className="text-2xl font-bold text-berkeley-blue mb-6">
              Información del libro
            </h2>
            
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Portada del libro */}
                  <div className="flex-shrink-0">
                    <div className="relative w-32 h-48 bg-gray-200 rounded overflow-hidden shadow-md">
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

                  {/* Book information */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 text-lg">
                        {book.author} {book.authorMiddleName} {book.authorLastName}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ISBN:</span>
                        <span className="font-medium">{book.isbn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Editorial:</span>
                        <span className="font-medium">{book.editorial}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Género:</span>
                        <span className="font-medium">{book.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Año:</span>
                        <span className="font-medium">{book.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estado:</span>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${book.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {book.status === 'AVAILABLE' ? 'Disponible' : 'No Disponible'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ubicación:</span>
                        <span className="font-medium">{book.location ?? 'No especificada'}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Descripción:</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
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
            <h2 className="text-2xl font-bold text-berkeley-blue mb-6">
              Detalles de la Reserva
            </h2>
            
            <Card className="shadow-sm">
              <CardContent className="p-6 space-y-6">
                {/* Loan period */}
                <div className="bg-gradient-to-r from-berkeley-blue/5 to-berkeley-blue/10 rounded-lg p-4 border border-berkeley-blue/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-berkeley-blue/10 rounded-full">
                      <Clock className="h-5 w-5 text-berkeley-blue" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">
                        Período de préstamo: 7 días
                      </span>
                      <p className="text-xs text-gray-600 mt-1">
                        (no modificable)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fechas */}
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-gray-800">
                          Fecha de reserva:
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-blue-600">
                          {formatDate(reservationDate)}
                        </div>
                        <div className="text-xs text-blue-500">
                          {formatDateFull(reservationDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-gray-800">
                          Fecha de devolución:
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">
                          {formatDate(returnDate)}
                        </div>
                        <div className="text-xs text-green-500">
                          {formatDateFull(returnDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and conditions */}
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 h-4 w-4 text-berkeley-blue border-gray-300 rounded focus:ring-berkeley-blue"
                    />
                    <span className="text-sm text-gray-600 leading-relaxed">
                      Al realizar esta reserva, acepto cumplir con las normas de la biblioteca, 
                      devolver el libro en la fecha establecida y hacerme responsable por cualquier 
                      daño o pérdida del material.{" "}
                      <Link 
                        href="/terms-and-conditions" 
                        className="text-berkeley-blue hover:underline"
                      >
                        Ver términos y condiciones
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Pickup information */}
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p>
                        Una vez confirmada la reserva, tu libro estará disponible por 24 horas 
                        para su retiro en la sede correspondiente. En caso de no ser retirado, 
                        el préstamo será cancelado (Podrían aplicarse multas y/o sanciones).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Confirm button */}
                <div className="pt-4">
                  <Button
                    onClick={handleReserve}
                    disabled={!termsAccepted || book.status !== 'AVAILABLE'}
                    className="w-full h-14 bg-berkeley-blue hover:bg-berkeley-blue/90 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {book.status !== 'AVAILABLE' ? 'Libro No Disponible' : 'Confirmar Reserva'}
                  </Button>
                  {book.status !== 'AVAILABLE' && (
                    <p className="text-xs text-red-600 mt-2 text-center">
                      Este libro no está disponible para reserva
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommended books section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-berkeley-blue mb-6">
            Podría interesarte...
          </h2>
          
          {recommendedLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, index) => (
                <Card key={index} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Skeleton className="w-20 h-28 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                        <div className="flex justify-between pt-2">
                          <Skeleton className="h-6 w-20 rounded-full" />
                          <div className="flex gap-2">
                            <Skeleton className="h-7 w-16" />
                            <Skeleton className="h-7 w-20" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recommendedBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedBooks.map((recBook) => (
                <Card key={recBook.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Portada */}
                      <div className="flex-shrink-0">
                        <div className="relative w-20 h-28 bg-gray-200 rounded overflow-hidden">
                          {recBook.imageUrl ? (
                            <Image
                              src={recBook.imageUrl}
                              alt={recBook.title}
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
                          <div className={`${recBook.imageUrl ? 'hidden' : 'flex'} w-full h-full bg-gray-200 items-center justify-center text-gray-400 text-xs`}>
                            Sin imagen
                          </div>
                        </div>
                      </div>

                      {/* Information */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                              {recBook.title}
                            </h3>
                            <p className="text-gray-600 text-xs">
                              {recBook.author}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-400 hover:text-red-500"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Género:</span> {recBook.gender}
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-2">
                          {recBook.description}
                        </p>

                        <div className="text-xs text-gray-500">
                          <span className="font-medium">ISBN:</span> {recBook.isbn}
                        </div>

                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Ubicación:</span> {recBook.location || 'No especificada'}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${recBook.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {recBook.status === 'AVAILABLE' ? 'Disponible' : 'No Disponible'}
                          </Badge>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="text-xs h-7">
                              Ver más
                            </Button>
                            <Button 
                              variant={recBook.status === 'AVAILABLE' ? "default" : "secondary"} 
                              size="sm" 
                              className="text-xs h-7"
                              disabled={recBook.status !== 'AVAILABLE'}
                              onClick={() => window.location.href = `/reserve?bookId=${recBook.id}`}
                            >
                              Reservar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay libros recomendados disponibles en este momento.</p>
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