"use client";
import { ArrowRight, Globe, Landmark, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { routes } from "~/lib/routes";
import * as React from "react";
import Image from "next/image";
import { Countdown } from "./_components/countdown";
import { Button } from "~/components/ui/button";
import LinkedInIcon from "~/components/icons/icons/linkedin-icon";

export default function HomePage() {
  const router = useRouter();
  // Fecha objetivo: próximo 2 de noviembre a las 09:00 hora local
  const targetDate = React.useMemo(() => {
    const now = new Date();
    // Mes: 10 (0-based) = Noviembre
    let year = now.getFullYear();
    const hasPassedThisYear =
      now.getMonth() > 10 || (now.getMonth() === 10 && now.getDate() > 2);
    if (hasPassedThisYear) year += 1; // si ya pasó el 2 de nov este año, usar el próximo
    return new Date(year, 10, 2, 9, 0, 0, 0);
  }, []);
  const [goingDocumentation, setGoDocumentation] = React.useState(false);

  const goDocumentationHandler = () => {
    setGoDocumentation(true);
    router.push(routes.documentation);
  };
  return (
    <div
      className={`relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-[#0b1e39] via-[#0e2747] to-[#132d52] text-white`}
    >
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pt-10 pb-16 md:px-10 lg:px-12">
        <div className="relative flex flex-1 flex-col justify-center">
          <div className="relative z-10 grid gap-10 md:grid-cols-2 md:gap-14">
            {/* Text + countdown */}
            <div className="flex flex-col justify-center">
              <h1 className="font-serif text-4xl leading-tight font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                PRÓXIMAMENTE
              </h1>
              <h2 className="text-golden-brown-light mt-4 font-serif text-lg font-semibold md:text-xl">
                NUEVO PORTAL DE BIBLIOTECA
              </h2>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/65 md:text-base">
                Estamos finalizando una plataforma académica para consulta,
                gestión y descubrimiento de recursos. Prepará tus integraciones
                revisando la API disponible y su documentación oficial.
              </p>
              <div className="mt-10">
                <Countdown target={targetDate} />
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button
                  onClick={goDocumentationHandler}
                  className="bg-golden-brown hover:bg-golden-brown/75 rounded-md"
                >
                  Ver Documentación
                  {goingDocumentation ? (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="ml-1 h-4 w-4" />
                  )}
                </Button>
                <span className="text-xs tracking-wide text-white/40">
                  Versión preliminar • {new Date().getFullYear()}
                </span>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Button
                  className="bg-white/5 hover:bg-white/10"
                  onClick={() =>
                    window.open(routes.webcampus, "_blank", "noreferrer")
                  }
                >
                  <Landmark />
                  WebCampus
                </Button>
                <Button
                  className="bg-white/5 hover:bg-white/10"
                  onClick={() =>
                    window.open(routes.linkedinUade, "_blank", "noreferrer")
                  }
                >
                  <LinkedInIcon />
                  Linkedin
                </Button>
                <Button
                  className="bg-white/5 hover:bg-white/10"
                  onClick={() =>
                    window.open(routes.uadeWebsite, "_blank", "noreferrer")
                  }
                >
                  <Globe />
                  Website
                </Button>
              </div>
            </div>
            {/* Owl / visual */}
            <div className="relative flex items-end justify-center md:justify-end">
              <div className="relative isolate">
                <Image
                  src="/new-booky.png"
                  alt="Búho leyendo libro UADE"
                  width={500}
                  height={500}
                  priority
                  className="relative z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)] select-none"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
