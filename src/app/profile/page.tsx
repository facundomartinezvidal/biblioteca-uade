"use client";

import {
  User,
  MapPin,
  CalendarDays,
  GraduationCap,
  Mail,
  IdCard,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Image from "next/image";

// Datos ficticios del usuario (ajustados al nuevo diseño tipo "profile header card")
const mockUser = {
  id: "115610",
  name: "Facundo Martínez Vidal",
  username: "fmartinezvidal",
  studentId: "1155873",
  role: "Estudiante",
  career: "Lic. en Gestión de la Tecnología",
  emailUade: "fmartinezvidal@uade.edu.ar",
  emailPersonal: "fmartinezvidal@gmail.com",
  phone: "11 6551 5615",
  profileImage: "/fmartinezvidal-profile.jpeg", // Ruta ficticia
  location: "CABA, Argentina",
  joinedAt: "septiembre 2024",
  bio: "Investigadora apasionada por la intersección entre tecnología y comportamiento humano. Interesada en trabajo remoto, ética de IA y transformación digital en educación.",
  stats: {
    activeLoans: 4,
    pendingFines: 2,
    expiringSoon: 2,
    booksRead: 28,
  },
};

// Datos ficticios de préstamos activos (para la tabla)
const mockActiveLoans = [
  {
    id: "1",
    bookId: "1",
    status: "ACTIVE",
    fromDate: "2024-08-13T00:00:00.000Z",
    toDate: "2024-08-16T00:00:00.000Z",
    book: {
      id: "1",
      title: "Ciudad de los Perros",
      author: "Mario Vargas Llosa",
      isbn: "978-84-322-0002-4",
      imageUrl: "/covers/ciudad-perros.jpg",
    },
  },
  {
    id: "2",
    bookId: "2",
    status: "ACTIVE",
    fromDate: "2024-08-13T00:00:00.000Z",
    toDate: "2024-08-16T00:00:00.000Z",
    book: {
      id: "2",
      title: "Cien Años de Soledad",
      author: "Gabriel García Márquez",
      isbn: "978-84-376-0494-7",
      imageUrl: "/covers/cien-anos-soledad.jpg",
    },
  },
  {
    id: "3",
    bookId: "3",
    status: "ACTIVE",
    fromDate: "2024-08-13T00:00:00.000Z",
    toDate: "2024-08-16T00:00:00.000Z",
    book: {
      id: "3",
      title: "El Laberinto de la Soledad",
      author: "Octavio Paz",
      isbn: "9780140399103",
      imageUrl: "/covers/el-laberinto-soledad.jpg",
    },
  },
  {
    id: "4",
    bookId: "4",
    status: "ACTIVE",
    fromDate: "2024-08-13T00:00:00.000Z",
    toDate: "2024-08-16T00:00:00.000Z",
    book: {
      id: "4",
      title: "Rayuela",
      author: "Julio Cortázar",
      isbn: "978-84-376-0313-1",
      imageUrl: "/covers/rayuela.jpeg",
    },
  },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-8 py-8">
        {/* Profile Header */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              {/* Left: avatar + basic info */}
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-100">
                  <Image
                    src={mockUser.profileImage}
                    alt={mockUser.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const sibling = target.nextElementSibling as HTMLElement;
                      if (sibling) sibling.style.display = "flex";
                    }}
                  />
                  <div className="absolute inset-0 hidden items-center justify-center text-gray-400">
                    <User className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">
                      {mockUser.name}
                    </h1>

                    <Badge className="text-berkeley-blue border-0 bg-blue-100 text-sm">
                      <GraduationCap className="mr-1 h-4 w-4" />
                      {mockUser.role}
                    </Badge>
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-sm text-gray-700">
                      {mockUser.career}
                    </span>
                  </div>
                  <p className="mt-1 text-base text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <User className="h-4 w-4" /> {mockUser.username}
                    </span>
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <IdCard className="h-4 w-4" /> {mockUser.id}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-4 w-4" /> {mockUser.emailUade}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" /> Ingresó{" "}
                      {mockUser.joinedAt}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-4" />

            {/* Stats (claras y escaneables) */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {/* Préstamos activos */}
              <div
                className="rounded-md bg-blue-50 p-4"
                role="region"
                aria-label="Préstamos activos"
                title="Préstamos activos en curso"
              >
                <div className="text-berkeley-blue flex items-center justify-center gap-2 text-sm font-medium">
                  <BookOpen className="h-4 w-4" />
                  Préstamos activos
                </div>
                <p className="text-berkeley-blue mt-2 text-center text-2xl font-bold">
                  {mockUser.stats.activeLoans}
                </p>
                <p className="text-berkeley-blue text-center text-sm">
                  en curso
                </p>
              </div>

              {/* Libros leídos */}
              <div
                className="rounded-md bg-green-50 p-4"
                role="region"
                aria-label="Libros leídos"
                title="Total de libros leídos"
              >
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  Libros leídos
                </div>
                <p className="mt-2 text-center text-2xl font-bold text-green-700">
                  {mockUser.stats.booksRead}
                </p>
                <p className="text-center text-sm text-green-700/80">total</p>
              </div>

              {/* Multas pendientes */}
              <div
                className="rounded-md bg-red-50 p-4"
                role="region"
                aria-label="Multas pendientes"
                title="Multas pendientes de pago"
              >
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  Multas pendientes
                </div>
                <p className="mt-2 text-center text-2xl font-bold text-red-700">
                  {mockUser.stats.pendingFines}
                </p>
                <p className="text-center text-sm text-red-700/80">por pagar</p>
              </div>

              {/* Vencen pronto */}
              <div
                className="rounded-md bg-orange-50 p-4"
                role="region"
                aria-label="Vencimientos próximos"
                title="Préstamos que vencen pronto"
              >
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-orange-700">
                  <Clock className="h-4 w-4" />
                  Vencimientos próximos
                </div>
                <p className="mt-2 text-center text-2xl font-bold text-orange-700">
                  {mockUser.stats.expiringSoon}
                </p>
                <p className="text-center text-sm text-orange-700/80">
                  próximos días
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de préstamos actuales */}
        <Card className="mt-6 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Préstamos actuales
              </h3>
              <Badge className="text-berkeley-blue border-0 bg-blue-100 text-sm">
                {mockActiveLoans.length} activos
              </Badge>
            </div>

            {mockActiveLoans.length ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Libro</TableHead>
                      <TableHead className="min-w-[120px]">ISBN</TableHead>
                      <TableHead className="min-w-[120px]">Desde</TableHead>
                      <TableHead className="min-w-[120px]">Hasta</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockActiveLoans.map((loan) => (
                      <TableRow key={loan.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded bg-gray-200">
                              {loan.book.imageUrl ? (
                                <Image
                                  src={loan.book.imageUrl}
                                  alt={loan.book.title}
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    const t = e.target as HTMLImageElement;
                                    t.style.display = "none";
                                  }}
                                />
                              ) : null}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-gray-900">
                                {loan.book.title}
                              </p>
                              <p className="truncate text-sm text-gray-600">
                                {loan.book.author}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {loan.book.isbn}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(loan.fromDate)}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {formatDate(loan.toDate)}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-berkeley-blue border-0 text-sm font-medium text-white">
                            Activo
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Ver más
                            </Button>
                            <Button variant="destructive" size="sm">
                              Cancelar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No tienes préstamos activos
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
