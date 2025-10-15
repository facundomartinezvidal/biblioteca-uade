"use client";

import Image from "next/image";
import { X, User, Tag, Calendar, Building2, Hash, MapPin } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface PopUpBookProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    id: string;
    title?: string | null;
    description?: string | null;
    isbn?: string | null;
    status?: string | null;
    year?: number | null;
    editorial?: string | null;
    imageUrl?: string | null;
    author?: string | null;
    authorMiddleName?: string | null;
    authorLastName?: string | null;
    gender?: string | null;
    location?: string | null;
  } | null;
  onReserve?: (bookId: string) => void;
  onToggleFavorite?: (bookId: string) => void;
}

const getAvailabilityBadge = (status?: string) => {
  if (status === "AVAILABLE")
    return (
      <Badge className="border-0 bg-emerald-100 text-emerald-800">
        Disponible
      </Badge>
    );
  if (status === "RESERVED")
    return (
      <Badge className="border-0 bg-blue-100 text-blue-800">Reservado</Badge>
    );
  return (
    <Badge className="border-0 bg-rose-100 text-rose-800">No disponible</Badge>
  );
};

export default function PopUpBook({
  isOpen,
  onClose,
  book,
  onReserve,
  onToggleFavorite,
}: PopUpBookProps) {
  const router = useRouter();
  // Close modal with Escape key and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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

  if (!isOpen || !book) return null;

  const fullAuthor = [book.author, book.authorMiddleName, book.authorLastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay: blurred + darkened backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Detalle del Libro
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          {/* Top section: Image left, metadata right */}
          <div className="flex gap-4">
            {/* Book cover - left side */}
            <div className="flex-shrink-0">
              <div className="relative h-80 w-56 overflow-hidden rounded-lg bg-gray-100 shadow-md">
                {book.imageUrl ? (
                  <Image
                    src={book.imageUrl}
                    alt={book.title ?? ""}
                    fill
                    className="object-cover"
                    sizes="200px"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const nextEl = target.nextElementSibling as HTMLElement;
                      if (nextEl) nextEl.style.display = "flex";
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

            {/* Right side content */}
            <div className="flex flex-1 flex-col space-y-4">
              {/* Title left-aligned, author below with icon; badge on the right */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {book.title ?? ""}
                  </h3>
                  {fullAuthor && (
                    <div className="mt-2 flex items-center gap-1.5 text-gray-600">
                      <User className="h-4 w-4" />
                      <span className="text-base leading-tight">
                        {fullAuthor}
                      </span>
                    </div>
                  )}
                </div>
                {getAvailabilityBadge(book.status ?? undefined)}
              </div>

              {/* Metadata above synopsis in the right panel */}
              <div>
                <div className="mb-0 grid grid-cols-3 gap-x-2 gap-y-2">
                  <div className="text-muted-foreground flex items-center gap-1 text-[13px] leading-tight">
                    <Tag className="h-3.5 w-3.5 text-gray-500" />
                    <span className="truncate" title={book.gender ?? undefined}>
                      {book.gender ?? "-"}
                    </span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1 text-[13px] leading-tight">
                    <Building2 className="h-3.5 w-3.5 text-gray-500" />
                    <span
                      className="truncate"
                      title={book.editorial ?? undefined}
                    >
                      {book.editorial?.trim() ?? "No especificada"}
                    </span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1 text-[13px] leading-tight">
                    <Calendar className="h-3.5 w-3.5 text-gray-500" />
                    <span>{book.year ?? "-"}</span>
                  </div>

                  <div className="text-muted-foreground flex items-center gap-1 text-[13px] leading-tight">
                    <Hash className="h-3.5 w-3.5 text-gray-500" />
                    <span className="truncate" title={book.isbn ?? undefined}>
                      {book.isbn ?? "-"}
                    </span>
                  </div>
                  <div className="text-muted-foreground col-span-2 flex items-center gap-1 text-[13px] leading-tight">
                    <MapPin className="h-3.5 w-3.5 text-gray-500" />
                    <span
                      className="truncate"
                      title={book.location ?? "No especificada"}
                    >
                      {book.location?.split(",").slice(1).join(",").trim() ??
                        book.location ??
                        "No especificada"}
                    </span>
                  </div>
                </div>
                <div className="mt-4 font-semibold text-gray-900">Sinopsis</div>
                <p className="mt-2 text-sm leading-snug text-gray-600">
                  {book.description ?? ""}
                </p>
              </div>
            </div>
          </div>

          {/* (metadata now shown above synopsis in right panel) */}

          {/* Action buttons */}
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                if (onToggleFavorite) {
                  onToggleFavorite(book.id);
                } else {
                  console.log(`Toggle favorite for ${book.id} (no handler)`);
                }
              }}
            >
              Añadir a Favoritos
            </Button>
            <Button
              className="bg-berkeley-blue hover:bg-berkeley-blue/90 flex-1 text-white"
              onClick={() => {
                if (onReserve) {
                  onReserve(book.id);
                } else {
                  router.push(`/reserve?bookId=${book.id}`);
                }
              }}
            >
              Reservar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
