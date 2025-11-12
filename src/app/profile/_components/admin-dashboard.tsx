import {
  Ban,
  BookCheck,
  BookMarked,
  Bookmark,
  CircleAlert,
  LibraryBig,
  PenSquare,
  TimerOff,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RouterOutputs } from "~/trpc/react";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { StatCard } from "./stat-card";

type AdminOverview = RouterOutputs["dashboard"]["getAdminOverview"];

interface AdminDashboardProps {
  data: AdminOverview;
}

const chartColors = [
  "#0f4c81",
  "#2563eb",
  "#0891b2",
  "#f97316",
  "#16a34a",
  "#9333ea",
  "#ea580c",
  "#f43f5e",
];

export function AdminDashboard({ data }: AdminDashboardProps) {
  const {
    summary: {
      totalBooks,
      availableBooks,
      reservedBooks,
      notAvailableBooks,
      activeLoans,
      reservedLoans,
      overdueLoans,
      pendingPenalties,
      totalStudents,
      totalAuthors,
    },
    charts,
  } = data;

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("es-AR").format(value);

  const stats = [
    {
      icon: LibraryBig,
      label: "Libros en catálogo",
      value: formatNumber(totalBooks),
      sublabel: "total registrados",
      bgColor: "bg-blue-50",
      textColor: "text-berkeley-blue",
      ariaLabel: "Libros cargados en catálogo",
      title: "Cantidad total de libros registrados en el sistema",
    },
    {
      icon: BookCheck,
      label: "Libros disponibles",
      value: formatNumber(availableBooks),
      sublabel: "para préstamo",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      ariaLabel: "Libros disponibles para préstamo",
      title: "Libros actualmente disponibles para ser reservados",
    },
    {
      icon: BookMarked,
      label: "Préstamos activos",
      value: formatNumber(activeLoans),
      sublabel: "en curso",
      bgColor: "bg-sky-50",
      textColor: "text-sky-700",
      ariaLabel: "Préstamos activos gestionados por la biblioteca",
      title: "Cantidad de préstamos activos en este momento",
    },
    {
      icon: Bookmark,
      label: "Reservas pendientes",
      value: formatNumber(reservedLoans),
      sublabel: "sin retirar",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      ariaLabel: "Reservas pendientes de retiro por estudiantes",
      title: "Reservas que aún no se convirtieron en préstamo activo",
    },
    {
      icon: TimerOff,
      label: "Préstamos vencidos",
      value: formatNumber(overdueLoans),
      sublabel: "requieren seguimiento",
      bgColor: "bg-rose-50",
      textColor: "text-rose-700",
      ariaLabel: "Préstamos vencidos que requieren acción",
      title: "Cantidad de préstamos que superaron su fecha de devolución",
    },
    {
      icon: CircleAlert,
      label: "Multas abiertas",
      value: formatNumber(pendingPenalties),
      sublabel: "pendientes o vencidas",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      ariaLabel: "Multas pendientes de pago o vencidas",
      title: "Multas que aún no fueron regularizadas",
    },
    {
      icon: Users,
      label: "Estudiantes registrados",
      value: formatNumber(totalStudents),
      sublabel: "activos",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      ariaLabel: "Estudiantes con acceso activo",
      title: "Cantidad de estudiantes registrados en la biblioteca",
    },
    {
      icon: PenSquare,
      label: "Autores cargados",
      value: formatNumber(totalAuthors),
      sublabel: "en catálogo",
      bgColor: "bg-slate-50",
      textColor: "text-slate-700",
      ariaLabel: "Autores registrados en el catálogo",
      title: "Cantidad de autores asociados a los libros",
    },
    {
      icon: Ban,
      label: "Libros no disponibles",
      value: formatNumber(notAvailableBooks),
      sublabel: "en mantenimiento",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      ariaLabel: "Libros marcados como no disponibles",
      title: "Libros fuera de circulación por mantenimiento o revisión",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            sublabel={stat.sublabel}
            ariaLabel={stat.ariaLabel}
            title={stat.title}
            bgColor={stat.bgColor}
            textColor={stat.textColor}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-berkeley-blue/10">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Evolución de préstamos (últimos 6 meses)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.loansByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  stroke="#6B7280"
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <YAxis
                  stroke="#6B7280"
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "0.75rem",
                    borderColor: "#E5E7EB",
                  }}
                  formatter={(value: number) => [`${value} préstamos`, "Total"]}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#0F4C81"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-berkeley-blue/10">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Estado de préstamos
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.loansByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="label"
                  stroke="#6B7280"
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <YAxis
                  stroke="#6B7280"
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "0.75rem",
                    borderColor: "#E5E7EB",
                  }}
                  formatter={(value: number) => [`${value}`, "Cantidad"]}
                />
                <Bar dataKey="count" radius={6}>
                  {charts.loansByStatus.map((statusItem, index) => (
                    <Cell
                      key={statusItem.status}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-berkeley-blue/10 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Géneros más prestados (Top 5)
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Distribución de préstamos según el género literario de los libros
            </p>
          </CardHeader>
          <CardContent className="flex h-[320px] flex-col items-center justify-center gap-4 lg:flex-row">
            {charts.genreDistribution.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No hay datos suficientes para mostrar esta gráfica todavía.
              </p>
            ) : (
              <>
                <div className="h-56 w-full max-w-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "0.75rem",
                          borderColor: "#E5E7EB",
                        }}
                        formatter={(value: number, name: string) => [
                          `${value} préstamos`,
                          name,
                        ]}
                      />
                      <Pie
                        data={charts.genreDistribution}
                        dataKey="count"
                        nameKey="genre"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={4}
                      >
                        {charts.genreDistribution.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid w-full max-w-sm gap-2 text-sm">
                  {charts.genreDistribution.map((genre, index) => (
                    <div
                      key={genre.genre}
                      className="border-berkeley-blue/10 flex items-center justify-between rounded-md border bg-slate-50 px-4 py-2 text-slate-700"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <span
                          className="block h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              chartColors[index % chartColors.length],
                          }}
                        />
                        {genre.genre}
                      </span>
                      <span>{genre.count}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
