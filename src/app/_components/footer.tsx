import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-berkeley-blue text-white">
      <div className="container mx-auto px-8 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs leading-none">Biblioteca</span>
                <span className="text-sm leading-none font-bold">UADE</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/70">
              Portal académico para consulta, gestión y descubrimiento de
              recursos bibliográficos de la Universidad Argentina de la Empresa.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              Enlaces Rápidos
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                Inicio
              </Link>
              <Link
                href="/prestamos"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                Préstamos
              </Link>
              <Link
                href="/multas"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                Multas
              </Link>
              <Link
                href="/documentation"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                Documentación API
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              Contacto
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:biblioteca@uade.edu.ar"
                className="flex items-start gap-2 text-sm text-white/70 transition-colors hover:text-white"
              >
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>biblioteca@uade.edu.ar</span>
              </a>
              <a
                href="tel:+541154789443"
                className="flex items-start gap-2 text-sm text-white/70 transition-colors hover:text-white"
              >
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>11 5478 9443</span>
              </a>
              <div className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>Lima 717, C1073, CABA</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              Horarios
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2 text-sm text-white/70">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <span>Lunes a Viernes</span>
                  <span className="text-xs text-white/50">8:00 - 22:00</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm text-white/70">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <span>Sábados</span>
                  <span className="text-xs text-white/50">9:00 - 14:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-1 text-center md:items-start md:text-left">
            <p className="text-sm text-white/60">
              © 2025 Biblioteca UADE. Todos los derechos reservados.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="link"
              className="h-auto p-0 text-sm text-white/60 underline-offset-4 hover:text-white"
              asChild
            >
              <Link href="/terminos">Términos y Condiciones</Link>
            </Button>
            <span className="text-white/30">•</span>
            <Button
              variant="link"
              className="h-auto p-0 text-sm text-white/60 underline-offset-4 hover:text-white"
              asChild
            >
              <Link href="/privacidad">Política de Privacidad</Link>
            </Button>
            <span className="text-white/30">•</span>
            <Button
              variant="link"
              className="h-auto p-0 text-sm text-white/60 underline-offset-4 hover:text-white"
              asChild
            >
              <Link href="/ayuda">Ayuda</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
