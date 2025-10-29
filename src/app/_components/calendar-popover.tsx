"use client";

import { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  BookOpen,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import {
  format,
  isSameDay,
  parseISO,
  differenceInDays,
  isAfter,
  startOfDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { api } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";

interface CalendarPopoverProps {
  className?: string;
}

export default function CalendarPopover({ className }: CalendarPopoverProps) {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);

  const { data: activeLoans, isLoading: isLoadingActive } =
    api.loans.getByUserId.useQuery({
      page: 1,
      limit: 100,
      status: "ACTIVE",
    });

  const { data: reservedLoans, isLoading: isLoadingReserved } =
    api.loans.getByUserId.useQuery({
      page: 1,
      limit: 100,
      status: "RESERVED",
    });

  const allLoans = useMemo(() => {
    const active = activeLoans?.results ?? [];
    const reserved = reservedLoans?.results ?? [];
    return [...active, ...reserved];
  }, [activeLoans, reservedLoans]);

  const datesWithLoans = useMemo(() => {
    return allLoans.map((loan) => ({
      date: parseISO(loan.endDate),
      loan,
    }));
  }, [allLoans]);

  const getLoansForDate = (checkDate: Date) => {
    return datesWithLoans.filter(({ date }) => isSameDay(date, checkDate));
  };

  const upcomingLoans = useMemo(() => {
    const today = startOfDay(new Date());
    const upcoming = allLoans
      .map((loan) => ({
        ...loan,
        endDate: parseISO(loan.endDate),
        daysUntilDue: differenceInDays(parseISO(loan.endDate), today),
      }))
      .filter((loan) => isAfter(loan.endDate, today))
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
      .slice(0, 3);

    return upcoming;
  }, [allLoans]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
  };

  const selectedDateLoans = date ? getLoansForDate(date) : [];
  const isLoading = isLoadingActive || isLoadingReserved;

  const activeDates = useMemo(() => {
    return datesWithLoans
      .filter(({ loan }) => loan.status === "ACTIVE")
      .map(({ date }) => date);
  }, [datesWithLoans]);

  const reservedDates = useMemo(() => {
    return datesWithLoans
      .filter(({ loan }) => loan.status === "RESERVED")
      .map(({ date }) => date);
  }, [datesWithLoans]);

  const modifiers = {
    active: activeDates,
    reserved: reservedDates,
  };

  const modifiersClassNames = {
    active:
      "relative after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-green-500",
    reserved:
      "relative before:absolute before:bottom-0.5 before:left-1/3 before:-translate-x-1/2 before:h-1 before:w-1 before:rounded-full before:bg-amber-500",
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative h-10 w-10 rounded-md text-white hover:bg-white/10 hover:text-white",
            className,
          )}
        >
          <CalendarIcon className="h-5 w-5" />
          {upcomingLoans.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {upcomingLoans.length}
            </span>
          )}
          <span className="sr-only">Calendario</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[420px] rounded-xl border border-gray-200 bg-white p-0 shadow-xl"
        align="end"
      >
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900">
              Calendario de Préstamos
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Gestiona y visualiza tus préstamos
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {allLoans.length > 0 && (
                <div className="mb-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">
                      Leyenda
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-gray-700">Préstamo Activo</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      <span className="text-gray-700">Reservado</span>
                    </div>
                  </div>
                </div>
              )}

              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-lg border border-gray-200"
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                locale={es}
              />

              {upcomingLoans.length > 0 && !date && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <h4 className="text-sm font-semibold text-gray-900">
                      Próximos Vencimientos
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {upcomingLoans.map((loan) => {
                      const isUrgent = loan.daysUntilDue <= 3;
                      return (
                        <div
                          key={loan.id}
                          className={cn(
                            "rounded-lg border p-3 transition-colors",
                            isUrgent
                              ? "border-red-200 bg-red-50"
                              : "border-gray-200 bg-gray-50 hover:bg-gray-100",
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                "mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                                isUrgent
                                  ? "bg-red-100 text-red-600"
                                  : "bg-blue-100 text-blue-600",
                              )}
                            >
                              <BookOpen className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900">
                                {loan.book.title}
                              </p>
                              {loan.author && (
                                <p className="mt-0.5 truncate text-xs text-gray-600">
                                  {loan.author.name} {loan.author.lastName}
                                </p>
                              )}
                              <div className="mt-2 flex items-center gap-2">
                                <Badge
                                  variant={
                                    loan.status === "ACTIVE"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="h-5 text-xs"
                                >
                                  {loan.status === "ACTIVE"
                                    ? "Activo"
                                    : "Reservado"}
                                </Badge>
                                <span
                                  className={cn(
                                    "flex items-center gap-1 text-xs font-medium",
                                    isUrgent ? "text-red-600" : "text-gray-600",
                                  )}
                                >
                                  <Clock className="h-3 w-3" />
                                  {loan.daysUntilDue === 0
                                    ? "Vence hoy"
                                    : loan.daysUntilDue === 1
                                      ? "Vence mañana"
                                      : `${loan.daysUntilDue} días`}
                                </span>
                              </div>
                            </div>
                            {isUrgent && (
                              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {date && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">
                      {format(date, "EEEE, d 'de' MMMM", { locale: es })}
                    </p>
                    {selectedDateLoans.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {selectedDateLoans.length}{" "}
                        {selectedDateLoans.length === 1
                          ? "préstamo"
                          : "préstamos"}
                      </Badge>
                    )}
                  </div>

                  {selectedDateLoans.length > 0 ? (
                    <div className="space-y-2">
                      {selectedDateLoans.map(({ loan }) => {
                        return (
                          <div
                            key={loan.id}
                            className={cn(
                              "rounded-lg border p-3",
                              loan.status === "ACTIVE"
                                ? "border-green-200 bg-green-50"
                                : "border-amber-200 bg-amber-50",
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={cn(
                                  "mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                                  loan.status === "ACTIVE"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-amber-100 text-amber-600",
                                )}
                              >
                                {loan.status === "ACTIVE" ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  <Clock className="h-4 w-4" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900">
                                  {loan.book.title}
                                </p>
                                {loan.author && (
                                  <p className="mt-0.5 truncate text-xs text-gray-600">
                                    {loan.author.name} {loan.author.lastName}
                                  </p>
                                )}
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                  <Badge
                                    variant={
                                      loan.status === "ACTIVE"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="h-5 text-xs"
                                  >
                                    {loan.status === "ACTIVE"
                                      ? "Activo"
                                      : "Reservado"}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    Desde{" "}
                                    {format(
                                      parseISO(loan.createdAt),
                                      "dd/MM/yyyy",
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                      <CalendarIcon className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        No hay préstamos para esta fecha
                      </p>
                    </div>
                  )}
                </div>
              )}

              {allLoans.length === 0 && (
                <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-3 text-sm font-medium text-gray-900">
                    No tienes préstamos activos
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Cuando reserves o tengas libros prestados, aparecerán aquí
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
