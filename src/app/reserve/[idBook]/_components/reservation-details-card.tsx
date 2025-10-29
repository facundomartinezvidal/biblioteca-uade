"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

interface ReservationDetailsCardProps {
  bookStatus: string;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
  onConfirmReservation: () => void;
}

export function ReservationDetailsCard({
  bookStatus,
  termsAccepted,
  onTermsChange,
  onConfirmReservation,
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

  return (
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
              disabled={!termsAccepted || bookStatus !== "AVAILABLE"}
              className="bg-berkeley-blue hover:bg-berkeley-blue/90 h-9 w-full text-sm font-semibold text-white shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {bookStatus !== "AVAILABLE"
                ? "Libro No Disponible"
                : "Confirmar Reserva"}
            </Button>
            {bookStatus !== "AVAILABLE" && (
              <p className="mt-1.5 text-center text-[10px] text-red-600">
                Este libro no está disponible para reserva
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
