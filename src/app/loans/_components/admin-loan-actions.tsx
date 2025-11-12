"use client";

import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
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
import { Label } from "~/components/ui/label";
import { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";

interface AdminLoanActionsProps {
  loanId: string;
  loanStatus: string;
  bookTitle: string;
  bookId?: string;
  userId?: string;
  onViewMore: () => void;
  onSuccess?: () => void;
}

export function AdminLoanActions({
  loanId,
  loanStatus,
  bookTitle,
  bookId,
  userId,
  onViewMore,
  onSuccess,
}: AdminLoanActionsProps) {
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [shouldCreatePenalty, setShouldCreatePenalty] = useState(false);

  const utils = api.useUtils();

  const activateLoanMutation = api.loans.activateLoan.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.loans.getByUserIdAdmin.invalidate(),
        utils.books.getAllAdmin.invalidate(),
        utils.books.getAll.invalidate(),
      ]);
      onSuccess?.();
      toast.success("Préstamo activado exitosamente");
      setShowActivateDialog(false);
    },
    onError: (error) => {
      toast.error(error.message || "Error al activar el préstamo");
      setShowActivateDialog(false);
    },
  });

  const finishLoanMutation = api.loans.finishLoan.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.loans.getByUserIdAdmin.invalidate(),
        utils.books.getAllAdmin.invalidate(),
        utils.books.getAll.invalidate(), // Invalidar también el endpoint público de libros
      ]);
      onSuccess?.();
      toast.success("Préstamo finalizado exitosamente");
      setShowFinishDialog(false);
      setShouldCreatePenalty(false);
    },
    onError: (error) => {
      toast.error(error.message || "Error al finalizar el préstamo");
      setShowFinishDialog(false);
      setShouldCreatePenalty(false);
    },
  });

  const createPenaltyMutation =
    api.loans.createPenaltyForDamagedBook.useMutation({
      onSuccess: async () => {
        await Promise.all([
          utils.loans.getByUserIdAdmin.invalidate(),
          utils.books.getAllAdmin.invalidate(),
          utils.books.getAll.invalidate(),
          utils.penalties.getByUserId.invalidate(),
        ]);
        onSuccess?.();
        toast.success("Multa creada y préstamo finalizado exitosamente");
        setShowFinishDialog(false);
        setShouldCreatePenalty(false);
      },
      onError: (error) => {
        toast.error(error.message || "Error al crear la multa");
        setShowFinishDialog(false);
        setShouldCreatePenalty(false);
      },
    });

  const reserveAgainMutation =
    api.loans.createReservationForStudent.useMutation({
      onSuccess: async () => {
        await Promise.all([
          utils.loans.getByUserIdAdmin.invalidate(),
          utils.books.getAllAdmin.invalidate(),
          utils.books.getAll.invalidate(),
        ]);
        onSuccess?.();
        toast.success("Nuevo préstamo creado exitosamente");
      },
      onError: (error) => {
        toast.error(error.message || "Error al crear el préstamo");
      },
    });

  const handleActivate = async () => {
    activateLoanMutation.mutate({ loanId });
  };

  const handleFinish = async () => {
    if (shouldCreatePenalty) {
      // Si está marcada la opción de multar, crear la multa (que también finaliza el préstamo)
      createPenaltyMutation.mutate({ loanId });
    } else {
      // Si no, solo finalizar el préstamo normalmente
      finishLoanMutation.mutate({ loanId });
    }
  };

  const handleReserveAgain = async () => {
    if (!bookId || !userId) {
      toast.error("Faltan datos para crear el préstamo");
      return;
    }
    reserveAgainMutation.mutate({ bookId, studentId: userId });
  };

  const canActivate = loanStatus === "RESERVED";
  const canFinish = loanStatus === "ACTIVE";
  const canReserveAgain = loanStatus === "FINISHED";

  const isLoading =
    finishLoanMutation.isPending || createPenaltyMutation.isPending;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onViewMore}>
            <Eye className="mr-2 h-4 w-4" />
            Ver Más
          </DropdownMenuItem>
          {canActivate && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowActivateDialog(true)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Entregar Libro
              </DropdownMenuItem>
            </>
          )}
          {canFinish && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowFinishDialog(true)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Finalizar Préstamo
              </DropdownMenuItem>
            </>
          )}
          {canReserveAgain && bookId && userId && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleReserveAgain}
                disabled={reserveAgainMutation.isPending}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {reserveAgainMutation.isPending
                  ? "Creando préstamo..."
                  : "Reservar de Nuevo"}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog para activar préstamo */}
      <AlertDialog open={showActivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Entregar libro?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas marcar este préstamo como ACTIVO?
              <br />
              <br />
              <strong>&quot;{bookTitle}&quot;</strong>
              <br />
              <br />
              El préstamo pasará de RESERVADO a ACTIVO y el plazo de devolución
              será de 14 días desde ahora.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={activateLoanMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (!activateLoanMutation.isPending) {
                  setShowActivateDialog(false);
                }
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleActivate();
              }}
              className="bg-berkeley-blue hover:bg-berkeley-blue/90"
              disabled={activateLoanMutation.isPending}
            >
              {activateLoanMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Activando
                </>
              ) : (
                "Confirmar Entrega"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog para finalizar préstamo con opción de multar */}
      <AlertDialog open={showFinishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Finalizar préstamo?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas finalizar este préstamo?
              <br />
              <br />
              <strong>&quot;{bookTitle}&quot;</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Opción de multar por libro dañado */}
          <div className="flex items-start space-x-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <input
              type="checkbox"
              id="create-penalty"
              checked={shouldCreatePenalty}
              onChange={(e) => setShouldCreatePenalty(e.target.checked)}
              className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-300 text-red-600 focus:ring-2 focus:ring-red-500"
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="create-penalty"
                className="flex cursor-pointer items-center gap-2 text-sm leading-none font-medium"
              >
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-red-900">Multar por libro dañado</span>
              </Label>
              <p className="text-xs text-red-700">
                Se creará una multa por el daño al libro
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault();
                if (!isLoading) {
                  setShowFinishDialog(false);
                  setShouldCreatePenalty(false);
                }
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleFinish();
              }}
              className={
                shouldCreatePenalty
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-berkeley-blue hover:bg-berkeley-blue/90"
              }
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {shouldCreatePenalty ? "Creando multa" : "Finalizando"}
                </>
              ) : shouldCreatePenalty ? (
                "Multar y Finalizar"
              ) : (
                "Finalizar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
