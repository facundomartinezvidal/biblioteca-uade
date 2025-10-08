import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-berkeley-blue mb-2">
            Términos y Condiciones
          </h1>
          <p className="text-lg text-gray-600">
            Conoce las reglas y políticas para el uso responsable de nuestros servicios
          </p>
        </div>

        {/* Cards Grid - EXACTO a la imagen de referencia */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Card 1: Importante - Top Left */}
          <Card className="bg-gray-50 border-0 shadow-sm rounded-lg">
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-berkeley-blue text-lg mb-1 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-berkeley-blue text-white text-sm font-bold">
                    !
                  </div>
                  Importante
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                El cumplimiento de las normas es fundamental para un servicio equitativo 
                y un acceso responsable a los recursos. Te recomendamos consultar con el 
                personal de biblioteca para consultas adicionales.
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Damaged Book - Top Right */}
          <Card className="bg-gray-50 border-0 shadow-sm rounded-lg">
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-berkeley-blue text-lg mb-1">Libro dañado</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Si un libro es devuelto con daños, roturas, dibujos o cualquier tipo 
                de maltrato, se aplicará una multa.
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Loan Duration - Middle Left */}
          <Card className="bg-gray-50 border-0 shadow-sm rounded-lg">
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-berkeley-blue text-lg mb-1">Duración del Préstamo</h3>
                <p className="text-sm text-gray-600">Tiempo límite y opciones de renovación</p>
              </div>
              
              <div>
                <p className="font-bold text-berkeley-blue mb-1">
                  Duración inicial: 7 días
                </p>
                <p className="text-gray-700">
                  Cada préstamo tiene una duración de una semana desde el retiro del libro.
                </p>
              </div>

              <div>
                <p className="font-bold text-berkeley-blue mb-1">
                  Renovación: 1 vez únicamente
                </p>
                <p className="text-gray-700">
                  Puedes renovar el préstamo por 1 semana adicional, solo una vez.
                </p>
              </div>

              <div>
                <p className="font-bold text-berkeley-blue mb-1">
                  Multa por retraso
                </p>
                <p className="text-gray-700">
                  Si no renuevas ni devuelves el libro en el tiempo debido, se aplicará una multa.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Plazo de retiro - Middle Right */}
          <Card className="bg-gray-50 border-0 shadow-sm rounded-lg">
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-berkeley-blue text-lg mb-1">Plazo de retiro: 24 horas</h3>
                <p className="text-gray-700">
                  Una vez realizada la reserva, tienes 24 horas para retirar el libro.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                    1ra vez
                  </Badge>
                  <div>
                    <p className="font-bold text-berkeley-blue">Advertencia</p>
                    <p className="text-sm text-gray-700">
                      Se genera una advertencia sin costo económico
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                    2da vez
                  </Badge>
                  <div>
                    <p className="font-bold text-berkeley-blue">Multa con cargo</p>
                    <p className="text-sm text-gray-700">
                      Se aplicará una multa con costo económico
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 5: Loan Duration - Cancellations - Bottom Full Width */}
          <Card className="bg-gray-50 border-0 shadow-sm rounded-lg lg:col-span-2">
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-berkeley-blue text-lg mb-1">Duración del Préstamo</h3>
                <p className="text-sm text-gray-600">Límites para cancelar reservas realizadas</p>
              </div>

              <div>
                <p className="font-bold text-berkeley-blue mb-3">
                  Límite: 2 cancelaciones permitidas
                </p>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                    1ra y 2da
                  </Badge>
                  <div>
                    <p className="font-bold text-berkeley-blue">Cancelaciones permitidas</p>
                    <p className="text-sm text-gray-700">
                      Puedes cancelar una reserva antes de retirar el libro sin penalización
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                    3ra vez
                  </Badge>
                  <div>
                    <p className="font-bold text-berkeley-blue">Multa aplicada</p>
                    <p className="text-sm text-gray-700">
                      Se aplicará una multa por quitarle el lugar a otros estudiantes
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <p className="font-bold text-berkeley-blue mb-1">Razón:</p>
                <p className="text-sm text-gray-700">
                  Las cancelaciones excesivas impiden que otros estudiantes puedan acceder a los libros disponibles.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}