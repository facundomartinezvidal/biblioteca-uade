"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw, Search, ChevronsUpDown } from "lucide-react";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardContent } from "~/components/ui/card";
import Image from "next/image";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import LoanDetailsModal from "../_components/loan-details-modal";
import { useState } from "react";

// Function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-blue-600 text-white";
    case "RESERVED":
      return "bg-blue-500 text-white";
    case "FINISHED":
      return "bg-gray-600 text-white";
    case "EXPIRED":
      return "bg-red-600 text-white";
    case "CANCELLED":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

// Function to get status text
const getStatusText = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "Activo";
    case "RESERVED":
      return "Reservado";
    case "FINISHED":
      return "Finalizado";
    case "EXPIRED":
      return "Vencido";
    case "CANCELLED":
      return "Cancelado";
    default:
      return status;
  }
};

// Function to get actions based on status
const getActions = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return {
        primary: { label: "Ver Más", variant: "outline" as const },
        secondary: { label: "Cancelar", variant: "destructive" as const }
      };
    case "RESERVED":
      return {
        primary: { label: "Ver Más", variant: "outline" as const },
        secondary: { label: "Cancelar", variant: "destructive" as const }
      };
    case "FINISHED":
      return {
        primary: { label: "Ver Más", variant: "outline" as const },
        secondary: { label: "Renovar ↻", variant: "default" as const }
      };
    case "EXPIRED":
    case "CANCELLED":
      return {
        primary: { label: "Ver Más", variant: "outline" as const },
        secondary: { label: "Reservar →", variant: "default" as const }
      };
    default:
      return {
        primary: { label: "Ver Más", variant: "outline" as const },
        secondary: { label: "Acción", variant: "default" as const }
      };
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

export default function LoansPage() {
  // TODO: Replace with real user ID when authentication is implemented
  const userId = "temp-user-id";
  
  const { data: loansData, isLoading } = api.loans.getByUserId.useQuery({
    userId,
    page: 1,
    limit: 50,
  });

  // State for modal
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Count expired loans for alert
  const expiredLoans = loansData?.results && Array.isArray(loansData.results) 
    ? loansData.results.filter((loan: any) => loan.status === "EXPIRED").length 
    : 0;

  // Function to open modal
  const handleViewMore = (loan: any) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLoan(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Alert Banner - Only show if there are expired loans */}
      {expiredLoans > 0 && (
        <Alert className="bg-white border-[#CC3F0C] rounded-lg border-2" style={{ color: '#CC3F0C' }}>
          <AlertDescription className="flex items-start gap-3">
          <span className="text-lg">⚠️</span>
            <div className="flex flex-col">
              <span className="font-medium" style={{ color: '#CC3F0C' }}>
                Atención!
              </span>
              <span style={{ color: '#CC3F0C' }}>
                Tienes {expiredLoans} préstamo(s) vencido(s). Se aplicarán multas automáticamente después de 7 días del vencimiento.
          </span>
            </div>
        </AlertDescription>
      </Alert>
      )}

      <main className="container mx-auto px-8 py-8">
        {/* Volver al Inicio */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-berkeley-blue hover:text-berkeley-blue/80">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al Inicio
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-berkeley-blue mb-2 flex items-center gap-3">
            <RotateCcw className="h-8 w-8" />
            Historial de Préstamos
          </h1>
          <p className="text-lg text-gray-600">
            Estos son todos tus préstamos hasta hoy
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por título, autor, etc..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Loans Table */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="font-semibold text-berkeley-blue">
                    <div className="flex items-center gap-2">
                      Libro
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-berkeley-blue">
                    <div className="flex items-center gap-2">
                      Estado
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-berkeley-blue">
                    <div className="flex items-center gap-2">
                      Desde
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-berkeley-blue">
                    <div className="flex items-center gap-2">
                      Hasta
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-berkeley-blue">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Skeleton loading state
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-4">
                          <Skeleton className="w-16 h-20 rounded" />
                          <div className="flex flex-col gap-2">
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
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : loansData?.results && Array.isArray(loansData.results) && loansData.results.length > 0 ? (
                  loansData.results.map((loan: any) => {
                    const actions = getActions(loan.status);
                    return (
                  <TableRow key={loan.id} className="hover:bg-gray-50">
                    {/* Columna Libro */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                              {loan.book.imageUrl ? (
                          <Image
                                  src={loan.book.imageUrl}
                            alt={loan.book.title}
                            width={64}
                            height={80}
                            className="object-cover rounded"
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
                              <div className={`${loan.book.imageUrl ? 'hidden' : 'flex'} w-full h-full bg-gray-200 rounded items-center justify-center text-gray-400 text-xs`}>
                            Sin imagen
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {loan.book.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                                {loan.author.name} {loan.author.middleName} {loan.author.lastName}
                          </p>
                          <p className="text-gray-500 text-xs">
                            #ISBN: {loan.book.isbn}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Columna Estado */}
                    <TableCell>
                          <Badge className={`${getStatusColor(loan.status)} border-0`}>
                            {getStatusText(loan.status)}
                      </Badge>
                    </TableCell>

                    {/* Columna Desde */}
                    <TableCell className="text-gray-700">
                          {formatDate(loan.createdAt)}
                    </TableCell>

                    {/* Columna Hasta */}
                    <TableCell className="text-gray-700">
                          {formatDate(loan.endDate)}
                    </TableCell>

                    {/* Columna Acciones */}
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                              variant={actions.primary.variant}
                          size="sm"
                          className="text-xs"
                              onClick={() => handleViewMore(loan)}
                        >
                              {actions.primary.label}
                        </Button>
                        <Button
                              variant={actions.secondary.variant}
                          size="sm"
                          className="text-xs"
                        >
                              {actions.secondary.label}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No tienes préstamos registrados
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
            0 of {loansData?.results?.length || 0} row(s) selected.
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </main>

      {/* Loan details modal */}
      {selectedLoan && (
        <LoanDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          loan={selectedLoan}
        />
      )}
    </div>
  );
}
