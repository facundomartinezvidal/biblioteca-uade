"use client";

import { useState, useEffect } from "react";
import { AlertCircle, AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Alert, AlertDescription } from "~/components/ui/alert";

interface CancelReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookTitle: string;
  isLoading?: boolean;
  willBePenalized?: boolean;
  isCheckingPenalty?: boolean;
}

export default function CancelReservationModal({
  isOpen,
  onClose,
  onConfirm,
  bookTitle,
  isLoading = false,
  willBePenalized = false,
  isCheckingPenalty = false,
}: CancelReservationModalProps) {
  const [acceptedPenalty, setAcceptedPenalty] = useState(false);

  // Reset checkbox when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setAcceptedPenalty(false);
    }
  }, [isOpen]);

  // Can't proceed while checking, or if penalized and hasn't accepted
  const canProceed =
    !isCheckingPenalty && (!willBePenalized || acceptedPenalty);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            ¿Estás seguro que deseas cancelar la reserva del libro{" "}
            <span className="font-semibold text-gray-900">{bookTitle}</span>?
            <br />
            <br />
            Esta acción no se puede deshacer y perderás tu lugar en la fila de
            espera.
          </AlertDialogDescription>
          {isCheckingPenalty && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verificando historial de cancelaciones...
            </div>
          )}
          {!isCheckingPenalty && willBePenalized && (
            <div className="mt-4 space-y-3">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>¡Atención!</strong> Ya cancelaste este libro
                  anteriormente. Si continúas, se te aplicará una multa de $100
                  por cancelación reiterada.
                </AlertDescription>
              </Alert>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
                <input
                  type="checkbox"
                  checked={acceptedPenalty}
                  onChange={(e) => setAcceptedPenalty(e.target.checked)}
                  className="h-4 w-4 rounded border-red-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-red-800">
                  Entiendo que se me aplicará una multa de $100 y acepto
                  continuar
                </span>
              </label>
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Volver</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading || !canProceed}
            className="bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelando...
              </>
            ) : willBePenalized ? (
              "Cancelar y pagar multa"
            ) : (
              "Cancelar Reserva"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
