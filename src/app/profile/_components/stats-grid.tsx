import { BookOpen, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { StatCard } from "./stat-card";

interface StatsGridProps {
  activeLoans: number;
  finishedLoans: number;
  pendingFines: number;
  upcomingDue: number;
  onPendingFinesClick?: () => void;
}

export function StatsGrid({
  activeLoans,
  finishedLoans,
  pendingFines,
  upcomingDue,
  onPendingFinesClick,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard
        icon={BookOpen}
        label="Préstamos activos"
        value={activeLoans.toString()}
        sublabel="en curso"
        ariaLabel="Préstamos activos"
        title="Préstamos activos en curso"
        bgColor="bg-blue-50"
        textColor="text-berkeley-blue"
      />
      <StatCard
        icon={CheckCircle}
        label="Libros leídos"
        value={finishedLoans.toString()}
        sublabel="total"
        ariaLabel="Libros leídos"
        title="Total de libros leídos"
        bgColor="bg-green-50"
        textColor="text-green-700"
      />
      <StatCard
        icon={AlertTriangle}
        label="Multas pendientes"
        value={pendingFines.toString()}
        sublabel="por pagar"
        ariaLabel="Multas pendientes"
        title="Multas pendientes de pago - Click para ver detalles"
        bgColor="bg-red-50"
        textColor="text-red-700"
        onClick={onPendingFinesClick}
      />
      <StatCard
        icon={Clock}
        label="Vencimientos próximos"
        value={upcomingDue.toString()}
        sublabel="próximos días"
        ariaLabel="Vencimientos próximos"
        title="Préstamos que vencen pronto"
        bgColor="bg-orange-50"
        textColor="text-orange-700"
      />
    </div>
  );
}
