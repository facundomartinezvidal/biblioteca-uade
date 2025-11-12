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
  DollarSign,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useEffect } from "react";
import Link from "next/link";

interface PenaltyDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  penalty: {
    id: string;
    userId: string | null;
    loanId: string | null;
    amount: string | null;
    paid: boolean | null;
    createdAt: Date | null;
    expiresIn: Date | null;
    loan: {
      id: string;
      endDate: string;
      status: string;
      createdAt: string;
    } | null;
    book: {
      id: string;
      title: string;
      description: string | null;
      isbn: string;
      status: string;
      year: number | null;
      imageUrl: string | null;
      createdAt: string;
      editorial: string;
    };
    author: {
      id: string;
      name: string;
      middleName: string | null;
      lastName: string;
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
  onPay?: (penaltyId: string) => void;
  isLoadingPay?: boolean;
}

const getStatusBadge = (paid?: boolean | null) => {
  if (paid) {
    return (
      <Badge className="bg-berkeley-blue/10 text-berkeley-blue border-0">
        Pagada
      </Badge>
    );
  }
  return <Badge className="border-0 bg-red-600 text-white">Pendiente</Badge>;
};

const formatDate = (dateString: string | Date | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function PenaltyDetailsPopup({
  isOpen,
  onClose,
  penalty,
  onPay,
  isLoadingPay = false,
}: PenaltyDetailsPopupProps) {
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

  if (!isOpen || !penalty) return null;

  const fullAuthor = penalty.author
    ? [penalty.author.name, penalty.author.middleName, penalty.author.lastName]
        .filter(Boolean)
        .join(" ")
    : "Autor desconocido";

  const canPay = !penalty.paid;

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
            Detalle de la Multa
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
                {penalty.book.imageUrl ? (
                  <Image
                    src={penalty.book.imageUrl}
                    alt={penalty.book.title ?? ""}
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
                  className={`${penalty.book.imageUrl ? "hidden" : "flex"} h-full w-full items-center justify-center bg-gray-200 text-xs text-gray-400`}
                >
                  Sin imagen
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {penalty.book.title ?? ""}
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
                {getStatusBadge(penalty.paid)}
              </div>

              <div>
                <div className="mb-0 grid grid-cols-3 gap-x-2 gap-y-2">
                  <div className="text-muted-foreground flex items-center gap-1 text-[13px] leading-tight">
                    <Tag className="h-3.5 w-3.5 text-gray-500" />
                    <span
                      className="truncate"
                      title={penalty.gender?.name ?? undefined}
                    >
                      {penalty.gender?.name ?? "-"}
                    </span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1 text-[13px] leading-tight">
                    <Building2 className="h-3.5 w-3.5 text-gray-500" />
                    <span
                      className="truncate"
                      title={penalty.book.editorial ?? undefined}
                    >
                      {penalty.book.editorial?.trim() ?? "No especificada"}
                    </span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1 text-[13px] leading-tight">
                    <Calendar className="h-3.5 w-3.5 text-gray-500" />
                    <span>{penalty.book.year ?? "-"}</span>
                  </div>

                  <div className="text-muted-foreground flex items-center gap-1 text-[13px] leading-tight">
                    <Hash className="h-3.5 w-3.5 text-gray-500" />
                    <span
                      className="truncate"
                      title={penalty.book.isbn ?? undefined}
                    >
                      {penalty.book.isbn ?? "-"}
                    </span>
                  </div>
                  <div className="text-muted-foreground col-span-2 flex items-center gap-1 text-[13px] leading-tight">
                    <MapPin className="h-3.5 w-3.5 text-gray-500" />
                    <span
                      className="truncate"
                      title={penalty.location?.address ?? "No especificada"}
                    >
                      {penalty.location?.address ?? "No especificada"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-3 border-t pt-4">
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <span className="text-sm font-medium text-gray-600">
                      ID del Préstamo
                    </span>
                    <code className="text-xs font-mono text-gray-900 bg-white px-2 py-1 rounded border">
                      {penalty.loanId ?? "N/A"}
                    </code>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-600">
                        Monto de la multa
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      ${penalty.amount ?? "0"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Fecha de creación
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDate(penalty.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Fecha de vencimiento
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDate(penalty.expiresIn)}
                    </span>
                  </div>
                  {penalty.location && (
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="text-xs font-medium text-gray-600">
                        Campus
                      </div>
                      <div className="text-sm text-gray-900">
                        {penalty.location.campus}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-lg bg-red-50 p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600" />
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-red-900">
                        Información sobre la multa
                      </div>
                      <div className="text-sm text-red-800">
                        <div className="mb-1 flex items-start gap-2">
                          <span>•</span>
                          <span>
                            <span className="font-medium">Motivo:</span>{" "}
                            Devolución tardía del libro.
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span>•</span>
                          <span>
                            Esta multa puede estar asociada a sanciones como
                            suspensión de préstamos.
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Button
                          variant="link"
                          asChild
                          className="h-auto p-0 text-sm text-red-700 hover:text-red-900"
                        >
                          <Link href="/terms-and-conditions">
                            Ver política de sanciones →
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 font-semibold text-gray-900">Sinopsis</div>
                <p className="mt-2 text-sm leading-snug text-gray-600">
                  {penalty.book.description ?? "No hay descripción disponible"}
                </p>
              </div>
            </div>
          </div>

          {canPay && onPay && (
            <div className="mt-6 flex gap-3">
              <Button
                className="bg-berkeley-blue hover:bg-berkeley-blue/90 flex-1 text-white"
                onClick={() => onPay(penalty.id)}
                disabled={isLoadingPay}
              >
                {isLoadingPay ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando pago...
                  </>
                ) : (
                  <>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Pagar ${penalty.amount ?? "0"}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
