import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export const metadata = {
  title: "Política de Privacidad - Biblioteca UADE",
  description: "Política de privacidad y manejo de datos personales de Biblioteca UADE",
};

export default function PrivacyContent() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8">
      <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
        <Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline">
          <ChevronLeft className="h-4 w-4" /> Volver al Inicio
        </Link>
      </div>

      <h1 className="mb-4 text-2xl font-bold">Política de Privacidad</h1>

      <Card className="mb-6">
        <CardContent className="bg-muted/50 flex items-start gap-4">
          <div className="rounded-full bg-blue-500/10 p-2 text-blue-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8-3a1 1 0 00-.993.883L9 8v3a1 1 0 00.883.993L10 12h.01a1 1 0 00.993-.883L11 11V8a1 1 0 00-1-1zM9 14a1 1 0 100 2 1 1 0 000-2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="mb-1 font-semibold">Importante</p>
            <p className="text-sm text-muted-foreground">
              La Biblioteca UADE valora la privacidad de sus usuarios y se compromete a proteger sus datos personales conforme a la legislación vigente. Esta política explica cómo recopilamos, utilizamos y resguardamos tu información cuando utilizas nuestros servicios en línea.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Información Recopilada</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Recopilamos los siguientes tipos de información:
            </CardDescription>
            <ul className="mt-2 list-disc pl-5 text-sm">
              <li>Datos personales (nombre completo, legajo, correos electrónicos, teléfonos).</li>
              <li>Información de uso del sistema (consultas, reservas, historial de préstamos).</li>
              <li>Datos técnicos como dirección IP y dispositivo utilizado.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uso de la Información</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              La información se utiliza para:
            </CardDescription>
            <ul className="mt-2 list-disc pl-5 text-sm">
              <li>Gestionar préstamos, reservas y renovaciones.</li>
              <li>Enviar notificaciones y recordatorios sobre tus operaciones.</li>
              <li>Mejorar la calidad de los servicios bibliotecarios.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Divulgación de Información</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              UADE no compartirá tus datos personales con terceros, salvo por obligación legal o requerimiento judicial. Toda la información se maneja con estricta confidencialidad y medidas de seguridad adecuadas.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seguridad de los Datos</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Implementamos protocolos y tecnologías de protección (cifrado, autenticación segura, control de acceso) para evitar accesos no autorizados o pérdidas de información.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Derechos del Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Tenés derecho a acceder, actualizar o eliminar tus datos personales. Para hacerlo, accedé a tu perfil en el Portal del Estudiante o contactá con la Biblioteca.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actualización de Políticas</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              UADE se reserva el derecho de modificar esta política. Cualquier cambio será publicado en esta misma sección con la fecha de actualización correspondiente.
            </CardDescription>
          </CardContent>
        </Card>
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
