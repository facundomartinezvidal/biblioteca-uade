"use client";

import Image from "next/image";
import {
  X,
  User,
  Tag,
  Calendar,
  Building2,
  Hash,
  MapPin,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface LoanDetailsPopupProps {
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
      description: string | null;
      isbn: string | null;
      status: string | null;
      year: number | null;
      editorial: string;
      imageUrl: string | null;
      createdAt: string;
    };
    author: {
      id: string;
      name: string;
      middleName: string | null;
      lastName: string | null;
      createdAt: string;
    } | null;
    gender: {
      id: string;
      name: string;
      createdAt: string;
    } | null;
    location: {
      id: string;
      address: string;
      campus: string;
    } | null;
  } | null;
  onCancel?: (loanId: string, bookTitle: string) => void;
  onReserve?: (bookId: string) => void;
  isLoadingCancel?: boolean;
  isLoadingReserve?: boolean;
}

const getStatusBadge = (status?: string) => {
  if (status === "ACTIVE")
    return (
      <Badge className="bg-berkeley-blue border-0 text-white">Activo</Badge>
    );
  if (status === "RESERVED")
    return (
      <Badge className="bg-berkeley-blue/10 text-berkeley-blue border-0">
        Reservado
      </Badge>
    );
  if (status === "FINISHED")
    return (
      <Badge className="border-0 bg-gray-600 text-white">Finalizado</Badge>
    );
  if (status === "EXPIRED")
    return <Badge className="border-0 bg-red-600 text-white">Vencido</Badge>;
  if (status === "CANCELLED")
    return <Badge className="border-0 bg-red-600 text-white">Cancelado</Badge>;
  return <Badge className="border-0 bg-gray-500 text-white">{status}</Badge>;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function LoanDetailsPopup({
  isOpen,
  onClose,
  loan,
  onCancel,
  onReserve,
  isLoadingCancel = false,
  isLoadingReserve = false,
}: LoanDetailsPopupProps) {
  const router = useRouter();

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

  if (!isOpen || !loan) return null;

  const fullAuthor = loan.author
    ? [loan.author.name, loan.author.middleName, loan.author.lastName]
        .filter(Boolean)
        .join(" ")
    : "Autor desconocido";

  const canCancel = loan.status === "RESERVED";
  const canReserve = loan.status === "FINISHED" || loan.status === "CANCELLED";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Detalle del Préstamo
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
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="relative h-80 w-56 overflow-hidden rounded-lg bg-gray-100 shadow-md">
                {loan.book.imageUrl ? (
                  <Image
                    src={loan.book.imageUrl}
                    alt={loan.book.title ?? ""}
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
                  className={`${loan.book.imageUrl ? "hidden" : "flex"} h-full w-full items-center justify-center bg-gray-200 text-xs text-gray-400`}
                >
                  Sin imagen
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {loan.book.title ?? ""}
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
                {getStatusBadge(loan.status)}
              </div>

              <div>
                <div className="mb-0 grid grid-cols-3 gap-x-2 gap-y-2">
                  <div className="text-muted-foreground flex items-center gap-1 text-[13px] leading-tight">
                    <Tag className="h-3.5 w-3.5 text-gray-500" />
                    <span
                      className="truncate"
                      title={loan.gender?.name ?? undefined}
                    >
                      {loan.gender?.name ?? "-"}
                    </span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1 text-[13px] leading-tight">
                    <Building2 className="h-3.5 w-3.5 text-gray-500" />
                    <span
                      className="truncate"
                      title={loan.book.editorial ?? undefined}
                    >
                      {loan.book.editorial?.trim() ?? "No especificada"}
                    </span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1 text-[13px] leading-tight">
                    <Calendar className="h-3.5 w-3.5 text-gray-500" />
                    <span>{loan.book.year ?? "-"}</span>
                  </div>

                  <div className="text-muted-foreground flex items-center gap-1 text-[13px] leading-tight">
                    <Hash className="h-3.5 w-3.5 text-gray-500" />
                    <span
                      className="truncate"
                      title={loan.book.isbn ?? undefined}
                    >
                      {loan.book.isbn ?? "-"}
                    </span>
                  </div>
                  <div className="text-muted-foreground col-span-2 flex items-center gap-1 text-[13px] leading-tight">
                    <MapPin className="h-3.5 w-3.5 text-gray-500" />
                    <span
                      className="truncate"
                      title={loan.location?.address ?? "No especificada"}
                    >
                      {loan.location?.address ?? "No especificada"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-3 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Fecha de reserva
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDate(loan.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Fecha de finalización
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDate(loan.endDate)}
                    </span>
                  </div>
                  {loan.location && (
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="text-xs font-medium text-gray-600">
                        Campus
                      </div>
                      <div className="text-sm text-gray-900">
                        {loan.location.campus}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 font-semibold text-gray-900">Sinopsis</div>
                <p className="mt-2 text-sm leading-snug text-gray-600">
                  {loan.book.description ?? ""}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            {canCancel && onCancel && (
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => onCancel(loan.id, loan.book.title)}
                disabled={isLoadingCancel}
              >
                {isLoadingCancel ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelando...
                  </>
                ) : (
                  "Cancelar Reserva"
                )}
              </Button>
            )}
            {canReserve && (
              <Button
                className="bg-berkeley-blue hover:bg-berkeley-blue/90 flex-1 text-white"
                onClick={() => {
                  if (onReserve) {
                    onReserve(loan.book.id);
                  } else {
                    router.push(`/reserve/${loan.book.id}`);
                  }
                }}
                disabled={isLoadingReserve}
              >
                {isLoadingReserve ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirigiendo...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reservar Nuevamente
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
