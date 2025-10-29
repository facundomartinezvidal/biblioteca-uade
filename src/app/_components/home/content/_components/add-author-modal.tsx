"use client";

import { useForm } from "@tanstack/react-form";
import { X, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { api } from "~/trpc/react";

interface AddAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddAuthorModal({
  isOpen,
  onClose,
  onSuccess,
}: AddAuthorModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const utils = api.useUtils();
  const createAuthorMutation = api.catalog.createAuthor.useMutation({
    onSuccess: () => {
      void utils.catalog.getAllAuthors.invalidate();
      onSuccess?.();
      onClose();
      form.reset();
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      middleName: "",
      lastName: "",
    },
    onSubmit: async ({ value }) => {
      createAuthorMutation.mutate({
        name: value.name,
        middleName: value.middleName || undefined,
        lastName: value.lastName,
      });
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
        className="relative z-10 w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Agregar Nuevo Autor
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

          {/* Body */}
          <div className="space-y-4 p-6">
            {/* Nombre */}
            <form.Field name="name">
              {(field) => (
                <div>
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Nombre del autor"
                  />
                </div>
              )}
            </form.Field>

            {/* Segundo Nombre */}
            <form.Field name="middleName">
              {(field) => (
                <div>
                  <Label htmlFor="middleName">Segundo Nombre</Label>
                  <Input
                    id="middleName"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Segundo nombre (opcional)"
                  />
                </div>
              )}
            </form.Field>

            {/* Apellido */}
            <form.Field name="lastName">
              {(field) => (
                <div>
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    id="lastName"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Apellido del autor"
                  />
                </div>
              )}
            </form.Field>
          </div>

          {/* Footer con botones */}
          <div className="flex justify-end gap-3 border-t p-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <form.Subscribe
              selector={(state) => ({
                name: state.values.name,
                lastName: state.values.lastName,
                isPending: createAuthorMutation.isPending,
              })}
            >
              {({ name, lastName, isPending }) => (
                <Button
                  type="submit"
                  className="bg-berkeley-blue hover:bg-berkeley-blue/90"
                  disabled={
                    isPending || !name.trim() || !lastName.trim()
                  }
                >
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? "Agregando..." : "Agregar Autor"}
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
