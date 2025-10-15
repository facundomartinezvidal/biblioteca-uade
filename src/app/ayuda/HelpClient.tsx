"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Search, HelpCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

const FAQS = [
  {
    title: "¿Puedo renovar un préstamo?",
    body:
      "Podés renovar tus préstamos solo 1 vez por el plazo de una semana adicional desde el apartado 'Mis Préstamos', siempre que el libro no tenga una reserva pendiente. Solo hacé clic en el botón 'Renovar' junto al título del libro.",
  },
  {
    title: "¿Cuánto dura una reserva?",
    body:
      "Una vez confirmada la reserva de un libro, la misma solo se mantiene activa durante 24 horas desde la notificación. Si pasado ese plazo el libro no fue retirado, la reserva será dada de baja y el ejemplar quedará disponible para otras reservas.",
  },
  {
    title: "¿Puedo cancelar una reserva?",
    body:
      "Todos los usuarios cuentan con un límite de 2 (dos) cancelaciones permitidas. En caso de que desees cancelar una reserva antes de retirar el libro por tercera vez, se aplicará una multa.",
  },
  {
    title: "¿Cómo puedo abonar una multa?",
    body:
      "El pago de multas no se gestiona desde esta plataforma. Para realizarlo, ingresá a tu perfil en el Portal del Estudiante y completá el pago. En la sección 'Multas' podrás ver el detalle de cada sanción.",
  },
  {
    title: "¿Por cuánto tiempo puedo conservar el libro prestado?",
    body:
      "El plazo estándar de préstamo es de 7 (siete) días corridos, con posibilidad de 1 (una) renovación. El plazo máximo permitido por alumno es de 2 semanas totales bajo un mismo préstamo.",
  },
  {
    title: "¿No encontrás la respuesta?",
    body:
      "Comunicáte con nosotros a través del correo biblioteca@uade.edu.ar o al teléfono 11 5478 9443. También podés usar el buscador para filtrar preguntas frecuentes.",
  },
];

export default function HelpClient() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter(
      (f) => f.title.toLowerCase().includes(q) || f.body.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8">
      <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
        <Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline">
          <ChevronLeft className="h-4 w-4" /> Volver al Inicio
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-full bg-blue-600/5 p-2 text-blue-700">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Ayuda</h1>
          <p className="text-sm text-muted-foreground">¿No encontrás la respuesta que buscás? Comunicate con nosotros a través del correo biblioteca@uade.edu.ar o al teléfono 11 5478 9443.</p>
        </div>
      </div>

      <div className="mb-6 flex w-full items-center gap-3">
        <div className="flex w-full items-center gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por palabras clave..."
            className="flex-1"
            aria-label="Buscar preguntas frecuentes"
          />
          <Button variant="ghost" size="icon" onClick={() => setQuery("")}> 
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold">Preguntas frecuentes</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <Card key={item.title}>
            <CardContent>
              <h3 className="mb-2 text-base font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} Biblioteca UADE. Todos los derechos reservados</div>
        <div className="flex items-center gap-4">
          <a href="mailto:biblioteca@uade.edu.ar" className="text-sm hover:underline">biblioteca@uade.edu.ar</a>
          <span className="text-sm text-muted-foreground">11 5478 9443</span>
        </div>
      </div>
    </div>
  );
}
