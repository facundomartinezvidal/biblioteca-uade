"use client";

import { useForm } from "@tanstack/react-form";
import { X, Upload, Loader2, Trash2, ImageIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Combobox } from "~/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { api } from "~/trpc/react";
import Image from "next/image";
import { supabase } from "~/lib/supabase/client";
import { Alert, AlertDescription } from "~/components/ui/alert";

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    id: string;
    title: string;
    description?: string | null;
    isbn: string;
    status: string;
    year?: number | null;
    editorial?: string | null;
    editorialId: string;
    authorId: string;
    genderId: string;
    location?: string | null;
    imageUrl?: string | null;
    author?: string | null;
    gender?: string | null;
  };
  onSuccess?: () => void;
}

export function EditBookModal({
  isOpen,
  onClose,
  book,
  onSuccess,
}: EditBookModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    book.imageUrl ?? null,
  );
  const [mounted, setMounted] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const utils = api.useUtils();

  const { data: authorsData } = api.catalog.getAllAuthors.useQuery();
  const { data: gendersData } = api.catalog.getAllGenders.useQuery();
  const { data: editorialsData } = api.catalog.getAllEditorials.useQuery();

  const authors = authorsData?.response ?? [];
  const genders = gendersData?.response ?? [];
  const editorials = editorialsData?.response ?? [];

  const form = useForm({
    defaultValues: {
      title: book.title,
      description: book.description ?? "",
      isbn: book.isbn,
      status: book.status as "AVAILABLE" | "NOT_AVAILABLE" | "RESERVED",
      year: book.year ?? new Date().getFullYear(),
      editorialId: book.editorialId ?? "",
      authorId: book.authorId ?? "",
      genderId: book.genderId ?? "",
      locationId: book.location ?? "",
      imageUrl: book.imageUrl ?? "",
    },
    onSubmit: async ({ value }) => {
      updateBookMutation.mutate({
        id: book.id,
        title: value.title,
        description: value.description || undefined,
        isbn: value.isbn,
        status: value.status,
        year: value.year || undefined,
        editorialId: value.editorialId || undefined,
        authorId: value.authorId || undefined,
        genderId: value.genderId || undefined,
        locationId: value.locationId || undefined,
        imageUrl: value.imageUrl || undefined,
      });
    },
  });

  const handleClose = useCallback(() => {
    form.reset();
    setImagePreview(book.imageUrl ?? null);
    setUploadError(null);
    setUploadProgress(0);
    onClose();
  }, [form, book.imageUrl, onClose]);

  const updateBookMutation = api.books.updateBook.useMutation({
    onSuccess: () => {
      void utils.books.getAllAdmin.invalidate();
      onSuccess?.();
      onClose();
    },
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleClose]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error state
    setUploadError(null);

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setUploadError(
        "Formato de imagen no válido. Por favor, usa JPG, PNG o WebP.",
      );
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError("La imagen es muy grande. El tamaño máximo es 5MB.");
      return;
    }

    try {
      setUploadingImage(true);
      setUploadProgress(10);

      // Create preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setUploadProgress(30);
      };
      reader.readAsDataURL(file);

      const fileExtension = file.name.split(".").pop();
      const fileName = `${file.name}`;
      const storagePath = `${book.id}/${fileName}`;

      setUploadProgress(50);

      const { error: uploadError } = await supabase.storage
        .from("book_image")
        .upload(storagePath, file, {
          contentType: `image/${fileExtension}`,
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress(80);

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/book_image/${storagePath}`;

      form.setFieldValue("imageUrl", publicUrl);
      setUploadProgress(100);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Error al subir la imagen. Por favor, intenta de nuevo.");
      setImagePreview(book.imageUrl ?? null);
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setFieldValue("imageUrl", "");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />

      <div
        className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex flex-shrink-0 items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900">Editar Libro</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="flex max-h-[90vh] flex-col"
        >
          {/* Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex gap-6">
              {/* Image - Left Column */}
              <div className="flex-shrink-0">
                <Label>Imagen del Libro</Label>
                <div className="relative mt-2 h-80 w-56 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 shadow-md">
                  {uploadingImage && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                      <p className="mt-2 text-sm text-white">
                        Subiendo imagen...
                      </p>
                      {uploadProgress > 0 && (
                        <div className="mt-2 h-1 w-32 overflow-hidden rounded-full bg-gray-700">
                          <div
                            className="h-full bg-white transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {imagePreview ? (
                    <>
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      {!uploadingImage && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8"
                          onClick={handleRemoveImage}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                      <p className="text-xs text-gray-400">
                        JPG, PNG o WebP
                        <br />
                        Máx. 5MB
                      </p>
                    </div>
                  )}
                </div>

                {uploadError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription className="text-xs">
                      {uploadError}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="mt-3">
                  <Label
                    htmlFor="image-upload"
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors ${
                      uploadingImage
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    {uploadingImage
                      ? "Subiendo..."
                      : imagePreview
                        ? "Cambiar Imagen"
                        : "Subir Imagen"}
                  </Label>
                  <input
                    ref={fileInputRef}
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={uploadingImage}
                  />
                </div>
              </div>

              {/* Form - Right Column */}
              <div className="flex-1 space-y-5">
                {/* Title */}
                <form.Field name="title">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="title">Título *</Label>
                      <Input
                        id="title"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Título del libro"
                      />
                    </div>
                  )}
                </form.Field>

                {/* ISBN */}
                <form.Field name="isbn">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="isbn">ISBN *</Label>
                      <Input
                        id="isbn"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="ISBN"
                      />
                    </div>
                  )}
                </form.Field>

                {/* Author and Genre in the same row */}
                <div className="grid grid-cols-2 gap-4">
                  <form.Field name="authorId">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="authorId">Autor *</Label>
                        <Combobox
                          options={authors.map((author) => ({
                            value: author.id,
                            label:
                              `${author.name} ${author.middleName ?? ""} ${author.lastName}`.trim(),
                          }))}
                          value={field.state.value}
                          onValueChange={(value) => field.handleChange(value)}
                          placeholder="Seleccionar autor"
                          searchPlaceholder="Buscar autor..."
                          emptyText="No se encontraron autores."
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="genderId">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="genderId">Género *</Label>
                        <Combobox
                          options={genders.map((gender) => ({
                            value: gender.id,
                            label: gender.name,
                          }))}
                          value={field.state.value}
                          onValueChange={(value) => field.handleChange(value)}
                          placeholder="Seleccionar género"
                          searchPlaceholder="Buscar género..."
                          emptyText="No se encontraron géneros."
                        />
                      </div>
                    )}
                  </form.Field>
                </div>

                {/* Editorial, Year and Status in the same row */}
                <div className="grid grid-cols-3 gap-4">
                  <form.Field name="editorialId">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="editorialId">Editorial *</Label>
                        <Combobox
                          options={editorials.map((editorial) => ({
                            value: editorial.id,
                            label: editorial.name,
                          }))}
                          value={field.state.value}
                          onValueChange={(value) => field.handleChange(value)}
                          placeholder="Seleccionar editorial"
                          searchPlaceholder="Buscar editorial..."
                          emptyText="No se encontraron editoriales."
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="year">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="year">Año *</Label>
                        <Input
                          id="year"
                          type="number"
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(Number(e.target.value))
                          }
                          placeholder="Año"
                          min={1800}
                          max={2030}
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="status">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="status">Estado *</Label>
                        <Select
                          value={field.state.value}
                          onValueChange={(value) =>
                            field.handleChange(
                              value as
                                | "AVAILABLE"
                                | "NOT_AVAILABLE"
                                | "RESERVED",
                            )
                          }
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                          <SelectContent className="z-[110]">
                            <SelectItem value="AVAILABLE">
                              Disponible
                            </SelectItem>
                            <SelectItem value="NOT_AVAILABLE">
                              No disponible
                            </SelectItem>
                            <SelectItem value="RESERVED">Reservado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </form.Field>
                </div>

                {/* Location */}
                <form.Field name="locationId">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="locationId">Ubicación</Label>
                      <Input
                        id="locationId"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Ubicación del libro"
                      />
                    </div>
                  )}
                </form.Field>

                {/* Description */}
                <form.Field name="description">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Descripción del libro"
                        rows={4}
                      />
                    </div>
                  )}
                </form.Field>
              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="flex flex-shrink-0 justify-end gap-3 border-t p-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-berkeley-blue hover:bg-berkeley-blue/90"
              disabled={updateBookMutation.isPending}
            >
              {updateBookMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {updateBookMutation.isPending
                ? "Guardando..."
                : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
