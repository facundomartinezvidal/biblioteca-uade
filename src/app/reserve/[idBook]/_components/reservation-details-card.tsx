"use client";

import Link from "next/link";
import { Clock, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

interface ReservationDetailsCardProps {
  bookStatus: string;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
  onConfirmReservation: () => void;
  isLoading?: boolean;
}

export function ReservationDetailsCard({
  bookStatus,
  termsAccepted,
  onTermsChange,
  onConfirmReservation,
  isLoading = false,
}: ReservationDetailsCardProps) {
  const reservationDate = new Date();
  const returnDate = new Date();
  returnDate.setDate(reservationDate.getDate() + 7);

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

  const getStatusMessage = () => {
    switch (bookStatus) {
      case "AVAILABLE":
        return {
          type: "success",
          message: "Este libro está disponible para reserva",
          bgColor: "bg-emerald-50",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-100",
        };
      case "RESERVED":
        return {
          type: "warning",
          message:
            "Este libro ya está reservado por otro usuario. Podrás reservarlo cuando esté disponible nuevamente.",
          bgColor: "bg-amber-50",
          textColor: "text-amber-700",
          borderColor: "border-amber-100",
        };
      case "NOT_AVAILABLE":
        return {
          type: "error",
          message:
            "Este libro no está disponible en este momento. Podría estar prestado o en mantenimiento.",
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-100",
        };
      default:
        return {
          type: "error",
          message: "Estado del libro no disponible para reserva",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-100",
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="flex flex-col">
      <h2 className="text-berkeley-blue mb-6 text-xl font-semibold">
        Detalles de la Reserva
      </h2>

      <Card className="flex-1 shadow-sm">
        <CardContent className="flex h-full flex-col space-y-3">
          {/* Book availability status */}
          <div
            className={`rounded-lg border p-3 ${statusInfo.bgColor} ${statusInfo.borderColor}`}
          >
            <div className="flex items-start gap-2">
              {statusInfo.type === "success" ? (
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              ) : statusInfo.type === "warning" ? (
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              ) : (
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              )}
              <p
                className={`text-sm leading-tight font-medium ${statusInfo.textColor}`}
              >
                {statusInfo.message}
              </p>
            </div>
          </div>

          {/* Loan period */}
          <div className="rounded-lg bg-blue-50 p-2.5">
            <div className="flex items-start gap-2">
              <Clock className="text-berkeley-blue mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              <p className="text-sm leading-tight font-semibold text-gray-900">
                Período de préstamo: 7 días (no modificable)
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-1.5">
            <div>
              <p className="mb-0.5 text-sm font-medium text-gray-500">Desde</p>
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
              <p className="mb-0.5 text-sm font-medium text-gray-500">Hasta</p>
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
              Al realizar esta reserva, acepto cumplir con las normas de la
              biblioteca, devolver el libro en la fecha establecida y hacerme
              responsable por cualquier daño o pérdida del material.{" "}
              <Link
                href="/terms-and-conditions"
                className="text-berkeley-blue font-medium underline"
              >
                Ver términos y condiciones
              </Link>
            </p>
          </div>

          {/* Checkbox to accept terms */}
          <div>
            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => onTermsChange(e.target.checked)}
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
              Una vez confirmada la reserva, tu libro estará disponible por 24
              horas para su retiro en la sede correspondiente. En caso de no ser
              retirado, el préstamo será cancelado (Podrían aplicarse multas y/o
              sanciones).
            </p>
          </div>

          {/* Confirm button */}
          <div className="mt-auto pt-1">
            <Button
              onClick={onConfirmReservation}
              disabled={
                !termsAccepted || bookStatus !== "AVAILABLE" || isLoading
              }
              className="bg-berkeley-blue hover:bg-berkeley-blue/90 h-9 w-full text-sm font-semibold text-white shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reservando...
                </>
              ) : bookStatus === "RESERVED" ? (
                "Ya Reservado"
              ) : bookStatus !== "AVAILABLE" ? (
                "No Disponible"
              ) : (
                "Confirmar Reserva"
              )}
            </Button>
            {bookStatus === "RESERVED" && (
              <p className="mt-1.5 text-center text-[10px] text-amber-600">
                Este libro ya está reservado por otro usuario
              </p>
            )}
            {bookStatus !== "AVAILABLE" && bookStatus !== "RESERVED" && (
              <p className="mt-1.5 text-center text-[10px] text-red-600">
                Este libro no está disponible para reserva en este momento
              </p>
            )}
            {!termsAccepted && bookStatus === "AVAILABLE" && (
              <p className="mt-1.5 text-center text-[10px] text-gray-500">
                Debes aceptar los términos y condiciones para continuar
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
