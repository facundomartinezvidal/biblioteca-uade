"use client";

import { useForm } from "@tanstack/react-form";
import { X, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { api } from "~/trpc/react";

interface AddEditorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddEditorialModal({
  isOpen,
  onClose,
  onSuccess,
}: AddEditorialModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const utils = api.useUtils();
  const createEditorialMutation = api.catalog.createEditorial.useMutation({
    onSuccess: () => {
      void utils.catalog.getAllEditorials.invalidate();
      onSuccess?.();
      onClose();
      form.reset();
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) => {
      createEditorialMutation.mutate(value);
    },
  });

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

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-xl"
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
            <h2 className="text-lg font-semibold text-gray-900">
              Agregar Nueva Editorial
            </h2>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={onClose}
              className="rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Nombre */}
            <form.Field name="name">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Editorial *</Label>
                  <Input
                    id="name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Ej: Penguin Random House, Planeta, etc."
                  />
                </div>
              )}
            </form.Field>
          </div>

          {/* Footer - Fixed */}
          <div className="flex flex-shrink-0 justify-end gap-3 border-t p-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <form.Subscribe
              selector={(state) => ({
                name: state.values.name,
                isPending: createEditorialMutation.isPending,
              })}
            >
              {({ name, isPending }) => (
                <Button
                  type="submit"
                  className="bg-berkeley-blue hover:bg-berkeley-blue/90"
                  disabled={isPending || !name.trim()}
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isPending ? "Agregando..." : "Agregar Editorial"}
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
