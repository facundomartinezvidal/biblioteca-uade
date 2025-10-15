"use client";

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { format } from "date-fns";

interface CalendarPopoverProps {
  className?: string;
}

export default function CalendarPopover({ className }: CalendarPopoverProps) {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-10 w-10 rounded-md text-white hover:bg-white/10 hover:text-white",
            className
          )}
        >
          <CalendarIcon className="h-5 w-5" />
          <span className="sr-only">Calendario</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-white border border-gray-200 shadow-lg rounded-lg" 
        align="end"
      >
        <div className="p-3">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">
              Calendario de Biblioteca
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Selecciona una fecha para ver eventos y fechas importantes
            </p>
          </div>
          
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border-0"
            initialFocus
          />
          
          {date && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Fecha seleccionada:</span>{" "}
                {format(date, "dd/MM/yyyy")}
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
