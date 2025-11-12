"use client";

import { useForm } from "@tanstack/react-form";
import { X, Loader2, BookmarkPlus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Combobox } from "~/components/ui/combobox";
import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { api } from "~/trpc/react";
import { Alert, AlertDescription } from "~/components/ui/alert";
import Image from "next/image";
import { toast } from "sonner";

interface AdminReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookTitle: string;
  bookAuthor?: string;
  bookImageUrl?: string | null;
  onSuccess?: () => void;
}

export function AdminReserveModal({
  isOpen,
  onClose,
  bookId,
  bookTitle,
  bookAuthor,
  bookImageUrl,
  onSuccess,
}: AdminReserveModalProps) {
  const [mounted, setMounted] = useState(false);
  const [reserveError, setReserveError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const utils = api.useUtils();

  // Obtener estudiantes - obtener todos para que el filtro del Combobox funcione
  const { data: studentsData, isLoading: isLoadingStudents } =
    api.user.getAllStudents.useQuery(
      {
        page: 1,
        limit: 100,
      },
      {
        enabled: isOpen,
      },
    );

  const students = studentsData?.results ?? [];

  const form = useForm({
    defaultValues: {
      studentId: "",
    },
    onSubmit: async ({ value }) => {
      setReserveError(null);

      if (!value.studentId.trim()) {
        setReserveError("Debes seleccionar un estudiante");
        return;
      }

      createReservationMutation.mutate({
        bookId: bookId,
        studentId: value.studentId,
      });
    },
  });

  const handleClose = useCallback(() => {
    form.reset();
    setReserveError(null);
    onClose();
  }, [form, onClose]);

  const createReservationMutation =
    api.loans.createReservationForStudent.useMutation({
      onSuccess: async () => {
        await Promise.all([
          utils.loans.invalidate(), // Invalida todas las queries de loans
          utils.books.invalidate(), // Invalida todas las queries de books
          utils.dashboard.invalidate(), // Invalida dashboard
          utils.notifications.invalidate(), // Invalida notificaciones
        ]);
        onSuccess?.();
        toast.success("Préstamo creado exitosamente");
        handleClose();
      },
      onError: (error) => {
        setReserveError(
          error.message ||
            "Error al crear el préstamo. Por favor, intenta de nuevo.",
        );
      },
    });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !createReservationMutation.isPending) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleClose, createReservationMutation.isPending]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => {
          if (!createReservationMutation.isPending) {
            handleClose();
          }
        }}
        aria-hidden
      />

      <div
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="flex max-h-[90vh] flex-col"
        >
          {/* Header - Fixed */}
          <div className="flex flex-shrink-0 items-center justify-between border-b p-6">
            <div className="flex items-center gap-2">
              <BookmarkPlus className="text-berkeley-blue h-5 w-5" />
              <h2 className="text-lg font-semibold text-gray-900">
                Crear Préstamo para Estudiante
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => {
                if (!createReservationMutation.isPending) {
                  handleClose();
                }
              }}
              disabled={createReservationMutation.isPending}
              className="rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {reserveError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{reserveError}</AlertDescription>
              </Alert>
            )}

            {/* Información del libro */}
            <div className="bg-berkeley-blue/5 mb-6 rounded-lg border border-gray-200 p-4">
              <div className="flex items-start gap-4">
                {bookImageUrl && (
                  <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-200">
                    <Image
                      src={bookImageUrl}
                      alt={bookTitle}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{bookTitle}</h3>
                  {bookAuthor && (
                    <p className="mt-1 text-sm text-gray-600">{bookAuthor}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Selector de estudiante */}
            <form.Field name="studentId">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-base font-medium">
                    Seleccionar Estudiante *
                  </Label>
                  <p className="text-sm text-gray-500">
                    Busca y selecciona el estudiante para crear el préstamo
                  </p>
                  <Combobox
                    options={students.map((student) => ({
                      value: student.id,
                      label: `${student.nombre} ${student.apellido} - ${student.legajo ?? "Sin legajo"}`,
                    }))}
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                    placeholder="Seleccionar estudiante"
                    searchPlaceholder="Buscar por nombre, legajo o email..."
                    emptyText={
                      isLoadingStudents
                        ? "Cargando estudiantes..."
                        : "No se encontraron estudiantes."
                    }
                  />
                </div>
              )}
            </form.Field>

            {/* Información adicional */}
            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h4 className="mb-2 text-sm font-medium text-blue-900">
                📋 Información del préstamo
              </h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>
                  • El préstamo se creará en estado ACTIVO (libro entregado)
                </li>
                <li>• Tendrá una duración de 7 días desde la fecha actual</li>
                <li>
                  • El estudiante podrá ver el préstamo activo en su historial
                </li>
              </ul>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="flex flex-shrink-0 justify-end gap-3 border-t p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!createReservationMutation.isPending) {
                  handleClose();
                }
              }}
              disabled={createReservationMutation.isPending}
            >
              Cancelar
            </Button>
            <form.Subscribe
              selector={(state) => ({
                studentId: state.values.studentId,
              })}
            >
              {({ studentId }) => (
                <Button
                  type="submit"
                  className="bg-berkeley-blue hover:bg-berkeley-blue/90"
                  disabled={
                    createReservationMutation.isPending || !studentId.trim()
                  }
                >
                  {createReservationMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando préstamo
                    </>
                  ) : (
                    "Confirmar Préstamo"
                  )}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
