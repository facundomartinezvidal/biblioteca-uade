"use client";

import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Hash, Heart, MapPin, Tag, UserRound } from "lucide-react";

type BookCardProps = {
  coverUrl?: string | null;
  title: string;
  author: string;
  category: string;
  description: string;
  isbn: string;
  location: string;
  available?: boolean;
  isFavorite?: boolean;
  onViewMore?: () => void;
  onReserve?: () => void;
  onToggleFavorite?: () => void;
  className?: string;
};

export default function BookCard(props: BookCardProps) {
  const {
    coverUrl,
    title,
    author,
    category,
    description,
    isbn,
    location,
    available = true,
    isFavorite = false,
    onViewMore,
    onReserve,
    onToggleFavorite,
    className,
  } = props;

  return (
    <div className={["flex", className].filter(Boolean).join(" ")}>
      {/* Image container */}
      <div className="bg-muted/20 border-muted/20 relative aspect-[2/3] w-[180px] flex-shrink-0 overflow-hidden rounded-l-lg border border-r-0">
        {coverUrl && (
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="120px"
            priority={false}
          />
        )}
        {!coverUrl && (
          <div className="bg-muted/10 flex h-full w-full items-center justify-center">
            <span className="text-muted-foreground/70 text-xs">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Content container */}
      <Card className="bg-card relative flex-1 overflow-hidden rounded-l-none border-0 p-4">
        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-4">
            {/* Title and author */}
            <div className="flex-1 space-y-2">
              <h3 className="text-lg leading-tight font-semibold tracking-tight">
                {title}
              </h3>
              <div className="text-muted-foreground flex items-center gap-1 text-sm">
                <UserRound className="h-4 w-4" />
                <span>{author}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-1 text-sm">
                <Tag className="h-4 w-4" />
                <span>{category}</span>
              </div>
            </div>

            {/* Favorite button */}
            <Button
              variant="ghost"
              size="icon"
              aria-label={
                isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
              }
              onClick={onToggleFavorite}
              className="shrink-0"
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? "fill-current text-rose-600" : ""}`}
              />
            </Button>
          </div>

          {/* Description */}
          <p className="text-muted-foreground mt-3 line-clamp-2 text-sm">
            {description}
          </p>

          {/* ISBN and location */}
          <div className="text-muted-foreground mt-3 space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              <span className="font-medium">ISBN:</span>
              <span>{isbn}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          </div>

          {/* Availability */}
          <div className="mt-3 flex items-center justify-between">
            <Badge
              className={`${available ? "bg-emerald-600/90 text-white hover:bg-emerald-600" : "bg-rose-600/90 text-white"} rounded-full px-3 py-1 text-xs font-medium`}
            >
              {available ? "Disponible" : "No disponible"}
            </Badge>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onViewMore}
            >
              Ver más
            </Button>
            <Button
              size="sm"
              className="bg-berkeley-blue flex-1 text-white"
              onClick={onReserve}
              disabled={!available}
            >
              Reservar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
