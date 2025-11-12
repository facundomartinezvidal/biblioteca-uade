"use client";

import { DollarSign, Loader2 } from "lucide-react";
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

interface PayPenaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookTitle: string;
  amount: string;
  isLoading?: boolean;
}

export default function PayPenaltyModal({
  isOpen,
  onClose,
  onConfirm,
  bookTitle,
  amount,
  isLoading = false,
}: PayPenaltyModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <AlertDialogTitle>Confirmar Pago</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            ¿Estás seguro que deseas pagar la multa del libro{" "}
            <span className="font-semibold text-gray-900">{bookTitle}</span>?
            <br />
            <br />
            <div className="rounded-lg bg-blue-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Monto a pagar:
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ${amount}
                </span>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className="bg-berkeley-blue hover:bg-berkeley-blue/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Confirmar Pago"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
