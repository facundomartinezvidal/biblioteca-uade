"use client";

import { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  BookOpen,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import {
  addMonths,
  differenceInDays,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isValid,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "~/components/ui/badge";
import { api, type RouterOutputs } from "~/trpc/react";

type LoanItem = RouterOutputs["loans"]["getByUserId"]["results"][number];

interface CalendarPopoverProps {
  className?: string;
}

type LoanWithComputedDates = {
  loan: LoanItem;
  startDate: Date;
  endDate: Date;
  dueDate: Date | null;
};

const normalizeDate = (value: string | Date | null | undefined) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
};

export default function CalendarPopover({ className }: CalendarPopoverProps) {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const weekdayLabels = ["L", "M", "X", "J", "V", "S", "D"];

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

  const loansWithDates = useMemo<LoanWithComputedDates[]>(() => {
    return allLoans
      .map((loan) => {
        const start = normalizeDate(loan.createdAt);
        const due = normalizeDate(loan.endDate);

        if (!start && !due) return null;

        const startDate = startOfDay(start ?? due ?? new Date());
        const endDate = endOfDay(due ?? start ?? new Date());

        return {
      loan,
          startDate,
          endDate,
          dueDate: due ? startOfDay(due) : null,
        };
      })
      .filter(Boolean) as LoanWithComputedDates[];
  }, [allLoans]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setDate(undefined);
      return;
    }

    if (date && isSameDay(selectedDate, date)) {
      setDate(undefined);
      return;
    }

    setDate(selectedDate);
    setCurrentMonth(startOfMonth(selectedDate));
  };

  const handleMonthChange = (value: number) => {
    setCurrentMonth((prev) => startOfMonth(addMonths(prev, value)));
  };

  const weeks = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    const result: Date[][] = [];

    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }

    return result;
  }, [currentMonth]);

  const getDayHighlights = (day: Date) => {
    let isInLoanPeriod = false;
    let hasActiveDue = false;
    let hasReservedDue = false;

    for (const loanData of loansWithDates) {
      if (
        !isInLoanPeriod &&
        isWithinInterval(day, {
          start: loanData.startDate,
          end: loanData.endDate,
        })
      ) {
        isInLoanPeriod = true;
      }

      if (loanData.dueDate && isSameDay(day, loanData.dueDate)) {
        if (loanData.loan.status === "ACTIVE") {
          hasActiveDue = true;
        } else if (loanData.loan.status === "RESERVED") {
          hasReservedDue = true;
        }
      }

      if (isInLoanPeriod && hasActiveDue && hasReservedDue) {
        break;
      }
    }

    return { isInLoanPeriod, hasActiveDue, hasReservedDue };
  };

  const today = useMemo(() => startOfDay(new Date()), []);

  const upcomingLoans = useMemo(() => {
    return loansWithDates
      .filter(({ dueDate }) => dueDate && !isBefore(dueDate, today))
      .map(({ loan, dueDate }) => ({
        ...loan,
        dueDate: dueDate!,
        daysUntilDue: differenceInDays(dueDate!, today),
      }))
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
      .slice(0, 3);
  }, [loansWithDates, today]);

  const selectedDateLoans = useMemo(() => {
    if (!date) return [];

    return loansWithDates
      .filter(({ startDate, endDate }) =>
        isWithinInterval(date, { start: startDate, end: endDate }),
      )
      .map((loanData) => ({
        ...loanData,
        isDueDate:
          loanData.dueDate !== null && isSameDay(loanData.dueDate, date),
      }));
  }, [date, loansWithDates]);

  const isLoading = isLoadingActive || isLoadingReserved;

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
                      <span className="h-[11px] w-[11px] rounded-full bg-sky-400"></span>
                      <span className="text-gray-700">Duración del préstamo</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-[11px] w-[11px] rounded-full bg-green-500"></span>
                      <span className="text-gray-700">Finalización</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-[11px] w-[11px] rounded-full bg-amber-500"></span>
                      <span className="text-gray-700">Reservado</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-gray-200">
                <div className="flex items-center justify-between px-4 pt-4">
                  <button
                    type="button"
                    onClick={() => handleMonthChange(-1)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    aria-label="Mes anterior"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                  </button>
                  <span className="text-sm font-semibold capitalize text-gray-900">
                    {format(currentMonth, "MMMM yyyy", { locale: es })}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleMonthChange(1)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    aria-label="Mes siguiente"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-7 gap-0 px-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {weekdayLabels.map((label) => (
                    <div key={label} className="flex h-9 items-center justify-center">
                      {label}
                    </div>
                  ))}
                </div>
                <div className="mt-1 space-y-1 px-3 pb-4">
                  {weeks.map((week, weekIndex) => (
                    <div
                      key={`week-${weekIndex}`}
                      className="grid grid-cols-7 gap-0 text-sm"
                    >
                      {week.map((day) => {
                        const { isInLoanPeriod, hasActiveDue, hasReservedDue } =
                          getDayHighlights(day);
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isSelected = date ? isSameDay(day, date) : false;
                        const isToday = isSameDay(day, today);

                        const dayClasses = cn(
                          "relative mx-auto flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors",
                          isCurrentMonth ? "text-gray-900" : "text-gray-300",
                          isInLoanPeriod && !isSelected &&
                            "bg-sky-100 text-sky-900",
                          isSelected &&
                            "bg-sky-600 text-white shadow focus:outline-none",
                          !isSelected && "hover:bg-sky-100",
                          isToday && !isSelected && "ring-1 ring-sky-500/70",
                        );

                        return (
                          <button
                            key={day.toISOString()}
                            type="button"
                            onClick={() => handleDateSelect(day)}
                            className={dayClasses}
                            aria-pressed={isSelected}
                            aria-label={format(day, "d 'de' MMMM yyyy", { locale: es })}
                          >
                            <span className="flex h-6 w-6 items-center justify-center rounded-full">
                              {format(day, "d")}
                            </span>
                            {(hasActiveDue || hasReservedDue) && (
                              <span className="absolute -bottom-1.5 flex gap-1">
                                {hasActiveDue && (
                                  <span className="h-[11px] w-[11px] rounded-full border border-white bg-emerald-500 shadow-sm" />
                                )}
                                {hasReservedDue && (
                                  <span className="h-[11px] w-[11px] rounded-full border border-white bg-amber-500 shadow-sm" />
                                )}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

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
                                    : `Faltan ${loan.daysUntilDue} días`}
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
                      {selectedDateLoans.map(({ loan, dueDate, startDate, endDate, isDueDate }) => {
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
                                    Desde {format(startDate, "dd/MM/yyyy")}
                                  </span>
                                  {dueDate ? (
                                    <span
                                      className={cn(
                                        "flex items-center gap-1 text-xs",
                                        isDueDate
                                          ? "font-semibold text-red-600"
                                          : "text-gray-500",
                                      )}
                                    >
                                      <Clock className="h-3 w-3" />
                                      Hasta {format(dueDate, "dd/MM/yyyy")}
                                      {isDueDate && " · Vence"}
                                    </span>
                                  ) : (
                                    <span className="text-xs text-gray-500">
                                      Hasta {format(endDate, "dd/MM/yyyy")}
                                    </span>
                                  )}
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
