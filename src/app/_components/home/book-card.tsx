"use client";

import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  BookOpen,
  Calendar,
  Hash,
  MapPin,
  Tag,
  UserRound,
  Heart,
  Loader2,
} from "lucide-react";

type BookCardProps = {
  coverUrl?: string | null;
  title: string;
  authorFirstName: string;
  authorMiddleName: string;
  authorLastName: string;
  editorial: string;
  year: number;
  category: string;
  description: string;
  isbn: string;
  location: string;
  available?: boolean;
  status?: "AVAILABLE" | "NOT_AVAILABLE" | "RESERVED";
  isReservedByCurrentUser?: boolean;
  isActiveByCurrentUser?: boolean;
  isFavorite?: boolean;
  isLoadingFavorite?: boolean;
  isLoadingReserve?: boolean;
  onViewMore?: () => void;
  onReserve?: () => void;
  onToggleFavorite?: () => void;
  className?: string;
};

export default function BookCard(props: BookCardProps) {
  const {
    coverUrl,
    title,
    authorFirstName,
    authorMiddleName,
    authorLastName,
    editorial,
    year,
    category,
    description,
    isbn,
    location,
    available = true,
    status,
    isReservedByCurrentUser = false,
    isActiveByCurrentUser = false,
    isFavorite = false,
    isLoadingFavorite = false,
    isLoadingReserve = false,
    onViewMore,
    onReserve,
    onToggleFavorite,
    className,
  } = props;

  const fullAuthorName =
    `${authorFirstName} ${authorMiddleName} ${authorLastName}`.trim();

  const getStatusBadge = () => {
    if (isActiveByCurrentUser) {
      return (
        <Badge
          className="border-0"
          style={{
            backgroundColor: "#F5FBEF",
            color: "#9A6D38",
          }}
        >
          Reserva activa
        </Badge>
      );
    }
    if (status === "RESERVED" && isReservedByCurrentUser) {
      return (
        <Badge className="bg-berkeley-blue/10 text-berkeley-blue border-0">
          Reservado por ti
        </Badge>
      );
    }
    if (status === "RESERVED" || !available) {
      return (
        <Badge className="border-0 bg-rose-100 text-rose-800">
          No disponible
        </Badge>
      );
    }
    return (
      <Badge className="border-0 bg-emerald-100 text-emerald-800">
        Disponible
      </Badge>
    );
  };

  return (
    <div className={["flex", className].filter(Boolean).join(" ")}>
      {/* Image container */}
      <div className="bg-muted/20 border-muted/20 relative aspect-[2/3] w-[160px] flex-shrink-0 overflow-hidden rounded-l-lg border border-r-0">
        {coverUrl && (
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="160px"
            priority={false}
          />
        )}
        {!coverUrl && (
          <div className="bg-muted/10 flex h-full w-full items-center justify-center">
            <BookOpen className="text-muted-foreground/50 h-12 w-12" />
          </div>
        )}
      </div>

      {/* Content container */}
      <Card className="bg-card relative flex-1 overflow-hidden rounded-l-none border-0 p-5">
        <div className="flex h-full flex-col">
          {/* Header with title, availability and favorite */}
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-foreground mb-2 line-clamp-2 text-xl font-bold tracking-tight">
                {title}
              </h3>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {getStatusBadge()}

              {onToggleFavorite && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={
                    isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
                  }
                  onClick={onToggleFavorite}
                  className="h-8 w-8 shrink-0"
                  disabled={isLoadingFavorite}
                >
                  {isLoadingFavorite ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Heart
                      className={`h-4 w-4 ${isFavorite ? "fill-current text-rose-600" : ""}`}
                    />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Metadata in two rows of three */}
          <div className="mb-3 space-y-2">
            {/* First row: Author, Category, Editorial */}
            <div className="flex items-center gap-x-4">
              <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <UserRound className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate font-medium">{fullAuthorName}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <Tag className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate font-medium">{category}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate font-medium">{editorial}</span>
              </div>
            </div>

            {/* Second row: Year, Location, ISBN */}
            <div className="flex items-center gap-x-4">
              <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{year}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate font-medium">
                  {location.trim() || "No especificada"}
                </span>
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <Hash className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate font-medium">{isbn}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-4 line-clamp-2 flex-1 text-sm leading-relaxed">
            {description}
          </p>

          {/* Bottom section */}
          <div className="space-y-3">
            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={onViewMore}>
                Ver más
              </Button>
              <Button
                size="sm"
                className="bg-berkeley-blue hover:bg-berkeley-blue/90 text-white"
                onClick={onReserve}
                disabled={!available || isLoadingReserve}
              >
                <>
                  {isLoadingReserve ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      <span>Reservar</span>
                    </>
                  )}
                </>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
