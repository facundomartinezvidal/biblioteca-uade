"use client";

import Link from "next/link";
import { ArrowLeft, Search, ChevronsUpDown, AlertTriangle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Alert, AlertDescription } from "~/components/ui/alert";
import Image from "next/image";
import { useState } from "react";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import PenaltyDetailsModal from "~/app/_components/penalty-details-modal";

// Fictitious data for penalties - will be generated dynamically based on available books
const generateMockPenalties = (books: any[]) => {
  if (!books || books.length === 0) return [];
  
  return books.slice(0, 3).map((book, index) => ({
    id: `penalty-${index + 1}`,
    bookId: book.id,
    status: index === 0 ? "PAID" : index === 1 ? "PENDING" : "RESERVED",
    fromDate: "2024-08-13T00:00:00.000Z",
    toDate: "2024-08-16T00:00:00.000Z",
    amount: 300,
  }));
};

export default function PenaltiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedPenalty, setSelectedPenalty] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("DATE_DESC");

  // Obtener datos de libros de la base de datos
  const { data: booksData, isLoading } = api.books.getAll.useQuery();
  
  // Generar multas ficticias basadas en los libros disponibles
  const mockPenalties = booksData?.response ? generateMockPenalties(booksData.response) : [];

  // Function to get badge status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-blue-100 text-blue-800 border-0">Pagada</Badge>;
      case "PENDING":
        return <Badge className="bg-red-100 text-red-800 border-0">Pendiente</Badge>;
      case "RESERVED":
        return <Badge className="bg-purple-100 text-purple-800 border-0">Reservado</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  // Function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Function to handle row selection
  const handleRowSelection = (penaltyId: string) => {
    setSelectedRows(prev => 
      prev.includes(penaltyId) 
        ? prev.filter(id => id !== penaltyId)
        : [...prev, penaltyId]
    );
  };

  // Function to open modal
  const handleViewMore = (penalty: any) => {
    const book = booksData?.response?.find(b => b.id === penalty.bookId);
    if (book) {
      setSelectedPenalty({ penalty, book });
      setIsModalOpen(true);
    }
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPenalty(null);
  };

  // Filtrar y ordenar multas
  const filteredAndSortedPenalties = mockPenalties
    .filter(penalty => {
      if (!booksData?.response) return false;
      const book = booksData.response.find(b => b.id === penalty.bookId);
      if (!book) return false;
      
      // Filter by search
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = (
          book.title.toLowerCase().includes(searchLower) ||
          book.author.toLowerCase().includes(searchLower) ||
          book.isbn.toLowerCase().includes(searchLower)
        );
        if (!matchesSearch) return false;
      }
      
      // Filtro por estado
      if (statusFilter !== "ALL" && penalty.status !== statusFilter) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "DATE_ASC":
          return new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime();
        case "DATE_DESC":
          return new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime();
        case "AMOUNT_ASC":
          return a.amount - b.amount;
        case "AMOUNT_DESC":
          return b.amount - a.amount;
        default:
          return 0;
      }
    });

  // Contar multas vencidas (simulado)
  const expiredPenalties = 1;

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
        {/* Attention alert */}
        <Alert className="bg-white border-[#CC3F0C] rounded-lg border-2 mb-6" style={{ color: '#CC3F0C' }}>
          <AlertDescription className="flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div className="flex flex-col">
              <span className="font-medium" style={{ color: '#CC3F0C' }}>
                Atención!
              </span>
              <span style={{ color: '#CC3F0C' }}>
                Tienes {expiredPenalties} préstamo(s) vencido(s). Se aplicarán multas automáticamente después de 7 días del vencimiento.
              </span>
            </div>
          </AlertDescription>
        </Alert>

        {/* Main title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Multas y Sanciones
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Las sanciones y multas se aplican a préstamos vencidos después de 7 días de la fecha limite
          </p>
        </div>

        {/* Search bar and filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título, autor, etc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-berkeley-blue focus:border-transparent"
                >
                  <option value="ALL">Todos los estados</option>
                  <option value="PAID">Pagada</option>
                  <option value="PENDING">Pendiente</option>
                  <option value="RESERVED">Reservado</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-berkeley-blue focus:border-transparent"
                >
                  <option value="DATE_DESC">Fecha (más reciente)</option>
                  <option value="DATE_ASC">Fecha (más antigua)</option>
                  <option value="AMOUNT_DESC">Monto (mayor)</option>
                  <option value="AMOUNT_ASC">Monto (menor)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de multas */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Libro
                      <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Estado
                      <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Desde
                      <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Hasta
                      <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Monto
                      <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Skeleton loading
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-4 rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Skeleton className="w-12 h-16 rounded" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-20" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredAndSortedPenalties.length > 0 ? (
                  filteredAndSortedPenalties.map((penalty) => {
                    const book = booksData?.response?.find(b => b.id === penalty.bookId);
                    if (!book) return null;

                    return (
                      <TableRow key={penalty.id} className="hover:bg-gray-50">
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(penalty.id)}
                            onChange={() => handleRowSelection(penalty.id)}
                            className="rounded border-gray-300 text-berkeley-blue focus:ring-berkeley-blue"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="relative w-12 h-16 bg-gray-200 rounded overflow-hidden">
                              {book.imageUrl ? (
                                <Image
                                  src={book.imageUrl}
                                  alt={book.title}
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
                              <div className={`${book.imageUrl ? 'hidden' : 'flex'} w-full h-full bg-gray-200 items-center justify-center text-gray-400 text-xs`}>
                                Sin imagen
                              </div>
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-semibold text-gray-900 text-sm">
                                {book.title}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {book.author}
                              </p>
                              <p className="text-gray-500 text-xs">
                                #ISBN: {book.isbn}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(penalty.status)}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {formatDate(penalty.fromDate)}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {formatDate(penalty.toDate)}
                        </TableCell>
                        <TableCell className="text-gray-700 font-semibold">
                          ${penalty.amount}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-berkeley-blue hover:bg-berkeley-blue/90 text-white"
                            onClick={() => handleViewMore(penalty)}
                          >
                            Ver Más
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No se encontraron multas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            {selectedRows.length} of {filteredAndSortedPenalties.length} row(s) selected.
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button variant="outline">
              Next
            </Button>
          </div>
        </div>
      </main>

      {/* Modal de detalles de multa */}
      {selectedPenalty && (
        <PenaltyDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          penalty={selectedPenalty.penalty}
          book={selectedPenalty.book}
        />
      )}
    </div>
  );
}
