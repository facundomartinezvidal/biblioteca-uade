// Utilidades para formateo de datos en tablas

export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    AVAILABLE: "bg-emerald-100 text-emerald-800",
    NOT_AVAILABLE: "bg-red-100 text-red-800",
    RESERVED: "bg-amber-100 text-amber-800",
  };
  return colors[status] ?? "bg-gray-100 text-gray-800";
};

export const getStatusText = (status: string) => {
  const text: Record<string, string> = {
    AVAILABLE: "Disponible",
    NOT_AVAILABLE: "No disponible",
    RESERVED: "Reservado",
  };
  return text[status] ?? status;
};

export const formatAuthorName = (
  firstName?: string | null,
  middleName?: string | null,
  lastName?: string | null,
): string => {
  return [firstName, middleName, lastName].filter(Boolean).join(" ").trim();
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return dateString;
  }
};
