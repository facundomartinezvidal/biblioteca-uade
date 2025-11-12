"use client";

import Image from "next/image";
import { Card, CardContent } from "~/components/ui/card";

interface BookInformationCardProps {
  book: {
    title: string;
    author?: string | null;
    authorMiddleName?: string | null;
    authorLastName?: string | null;
    isbn: string;
    gender?: string | null;
    year?: number | null;
    editorial?: string | null;
    location?: string | null;
    locationCampus?: string | null;
    description?: string | null;
    imageUrl?: string | null;
  };
}

export function BookInformationCard({ book }: BookInformationCardProps) {
  const fullAuthor = [book.author, book.authorMiddleName, book.authorLastName]
    .filter(Boolean)
    .join(" ");

  // Format location to show campus and address
  const formatLocation = () => {
    if (!book.location) return "No especificada";
    if (!book.locationCampus) return book.location;

    // Map campus enum to readable names
    const campusNames: Record<string, string> = {
      MONSERRAT: "Sede Monserrat",
      RECOLETA: "Sede Recoleta",
      COSTA: "Sede Costa",
    };

    const campusName = campusNames[book.locationCampus] ?? book.locationCampus;
    return campusName;
  };

  const formatAddress = () => {
    return book.location ?? "No especificada";
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-berkeley-blue mb-6 text-xl font-semibold">
        Información del libro
      </h2>

      <Card className="flex-1 shadow-sm">
        <CardContent className="flex h-full flex-col">
          <div className="flex gap-6">
            {/* Book cover */}
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
                <p className="text-sm text-gray-500">{fullAuthor}</p>
              </div>

              <div className="flex flex-1 flex-col justify-between text-sm">
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                  <div>
                    <span className="font-semibold text-gray-700">ISBN</span>
                    <p className="text-gray-600">{book.isbn}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Género</span>
                    <p className="text-gray-600">{book.gender}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Año</span>
                    <p className="text-gray-600">{book.year}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Editorial
                    </span>
                    <p className="text-gray-600">{book.editorial}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Sede</span>
                    <p className="text-gray-600">{formatLocation()}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Ubicación
                    </span>
                    <p className="text-gray-600">{formatAddress()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="pt-3">
            <h4 className="mb-2 font-semibold text-gray-900">Sinopsis</h4>
            <p className="text-sm leading-relaxed text-gray-600">
              {book.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
