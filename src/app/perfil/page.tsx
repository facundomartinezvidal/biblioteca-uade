"use client";

import Link from "next/link";
import { ArrowLeft, User, FileText, GraduationCap, Mail, Phone, Book, AlertTriangle, Clock, CheckCircle, ChevronsUpDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import Image from "next/image";
import { useState } from "react";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";

// Datos ficticios del usuario
const mockUser = {
  id: "user-1",
  name: "Eva Menéndez",
  username: "emenendez",
  studentId: "1155873",
  role: "Estudiante",
  career: "Lic. en Gestión de la Tecnología",
  emailUade: "emenendez@uade.edu.ar",
  emailPersonal: "evamdz@gmail.com.ar",
  phone: "11 6551 5615",
  profileImage: "/avatars/eva-menendez.jpg", // Ruta ficticia
  stats: {
    activeLoans: 4,
    pendingFines: 2,
    expiringSoon: 2,
    booksRead: 28
  }
};

// Datos ficticios de préstamos activos con información completa de libros
const mockActiveLoans = [
  {
    id: "1",
    bookId: "1",
    status: "ACTIVE",
    fromDate: "2024-08-13T00:00:00.000Z",
    toDate: "2024-08-16T00:00:00.000Z",
    book: {
      id: "1",
      title: "Clean Code Architecture",
      author: "Robert C. Martin",
      isbn: "978-84-376-0494-7",
      imageUrl: "/covers/clean-code.jpg"
    }
  },
  {
    id: "2",
    bookId: "2", 
    status: "ACTIVE",
    fromDate: "2024-08-13T00:00:00.000Z",
    toDate: "2024-08-16T00:00:00.000Z",
    book: {
      id: "2",
      title: "Clean Code Architecture",
      author: "Robert C. Martin",
      isbn: "978-84-376-0494-7",
      imageUrl: "/covers/clean-code.jpg"
    }
  },
  {
    id: "3",
    bookId: "3",
    status: "ACTIVE", 
    fromDate: "2024-08-13T00:00:00.000Z",
    toDate: "2024-08-16T00:00:00.000Z",
    book: {
      id: "3",
      title: "Clean Code Architecture",
      author: "Robert C. Martin",
      isbn: "978-84-376-0494-7",
      imageUrl: "/covers/clean-code.jpg"
    }
  },
  {
    id: "4",
    bookId: "4",
    status: "ACTIVE",
    fromDate: "2024-08-13T00:00:00.000Z", 
    toDate: "2024-08-16T00:00:00.000Z",
    book: {
      id: "4",
      title: "Clean Code Architecture",
      author: "Robert C. Martin",
      isbn: "978-84-376-0494-7",
      imageUrl: "/covers/clean-code.jpg"
    }
  }
];

export default function ProfilePage() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Obtener datos de libros de la base de datos
  const { data: booksData, isLoading } = api.books.getAll.useQuery();
  
  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Función para manejar selección de filas
  const handleRowSelection = (loanId: string) => {
    setSelectedRows(prev => 
      prev.includes(loanId) 
        ? prev.filter(id => id !== loanId)
        : [...prev, loanId]
    );
  };

  // Usar préstamos mock para simular 4 préstamos activos
  const activeLoans = mockActiveLoans;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-8 py-4">
          <Button variant="ghost" asChild className="text-berkeley-blue hover:text-berkeley-blue/80">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al Inicio
            </Link>
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-8 py-8">
        {/* Título principal */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Datos Personales
            </h1>
          </div>
          <p className="text-gray-600 text-sm">
            Para actualizar tus datos, comunícate con el área de servicio
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Información del perfil */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  {/* Foto de perfil */}
                  <div className="relative w-24 h-24 bg-gray-200 rounded-full overflow-hidden mb-4">
                    <Image
                      src={mockUser.profileImage}
                      alt={mockUser.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const nextElement = target.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="hidden w-full h-full bg-gray-200 items-center justify-center text-gray-400">
                      <User className="h-8 w-8" />
                    </div>
                  </div>
                  
                  {/* Nombre */}
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {mockUser.name}
                  </h2>
                  
                  {/* Badge de rol */}
                  <Badge className="bg-blue-100 text-blue-800 border-0 mb-6">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    {mockUser.role}
                  </Badge>

                  {/* Identificadores */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Usuario {mockUser.username}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Legajo {mockUser.studentId}</span>
                    </div>
                  </div>

                  {/* Información académica */}
                  <div className="w-full space-y-3 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 text-left">Académico</h3>
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-gray-600" />
                      <div className="text-left">
                        <span className="text-sm text-gray-600">Carrera</span>
                        <p className="font-medium text-gray-900">{mockUser.career}</p>
                      </div>
                    </div>
                  </div>

                  {/* Información de contacto */}
                  <div className="w-full space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 text-left">Contacto</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-600" />
                        <div className="text-left">
                          <span className="text-sm text-gray-600">Email UADE:</span>
                          <p className="font-medium text-gray-900">{mockUser.emailUade}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-600" />
                        <div className="text-left">
                          <span className="text-sm text-gray-600">Email personal:</span>
                          <p className="font-medium text-gray-900">{mockUser.emailPersonal}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-600" />
                        <div className="text-left">
                          <span className="text-sm text-gray-600">Teléfono:</span>
                          <p className="font-medium text-gray-900">{mockUser.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha - Información rápida y préstamos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información rápida */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información rápida</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <Book className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{mockUser.stats.activeLoans}</p>
                    <p className="text-sm text-gray-600">Préstamos activos</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">{mockUser.stats.pendingFines}</p>
                    <p className="text-sm text-gray-600">Multas pendientes</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-600">{mockUser.stats.expiringSoon}</p>
                    <p className="text-sm text-gray-600">Vencen pronto</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{mockUser.stats.booksRead}</p>
                    <p className="text-sm text-gray-600">Libros leídos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Préstamos actuales */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Book className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Préstamos actuales</h3>
                </div>

                    {activeLoans.length > 0 ? (
                  <div className="space-y-3">
                    {activeLoans.slice(0, 4).map((loan: any) => (
                      <div key={loan.id} className="flex gap-3 p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex-shrink-0">
                          <div className="relative w-12 h-16 bg-gray-200 rounded overflow-hidden">
                            {loan.book.imageUrl ? (
                              <Image
                                src={loan.book.imageUrl}
                                alt={loan.book.title}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const nextElement = target.nextElementSibling as HTMLElement;
                                  if (nextElement) {
                                    nextElement.style.display = 'flex';
                                  }
                                }}
                              />
                            ) : null}
                            <div className={`${loan.book.imageUrl ? 'hidden' : 'flex'} w-full h-full bg-gray-200 items-center justify-center text-gray-400 text-xs`}>
                              Sin imagen
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">
                            {loan.book.title}
                          </h4>
                          <p className="text-gray-600 text-xs truncate">
                            {loan.book.author}
                          </p>
                          <p className="text-gray-500 text-xs">
                            ISBN: {loan.book.isbn}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className="bg-blue-100 text-blue-800 border-0 text-xs">
                            Activo
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" className="text-xs h-7">
                              Ver Más
                            </Button>
                            <Button variant="destructive" size="sm" className="text-xs h-7">
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Book className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No tienes préstamos activos</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
