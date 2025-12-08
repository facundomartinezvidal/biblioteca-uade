export const BACKOFFICE_API_URL =
  "https://backoffice-production-df78.up.railway.app/api/v1";

export interface BackofficeUser {
  id_usuario: string;
  nombre: string;
  apellido: string;
  legajo: string;
  dni: string;
  email_institucional: string;
  email_personal: string;
  telefono_personal: string;
  fecha_alta: string;
  status: boolean;
  rol: {
    id_rol: string;
    categoria: string;
    sueldo_base: number;
    status: boolean;
  };
  carrera: {
    id_carrera: string;
    status: boolean;
  };
}

export interface BackofficeLocation {
  id_sede: string;
  nombre: string;
  ubicacion: string;
  status: boolean;
}

/**
 * Get user from backoffice by email
 */
export async function getUserFromBackoffice(
  email: string,
): Promise<BackofficeUser | null> {
  const res = await fetch(
    `${BACKOFFICE_API_URL}/users/?param=email_institucional&value=${encodeURIComponent(email)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch user from backoffice");
  }

  const users = (await res.json()) as BackofficeUser[];
  return users.length > 0 ? users[0]! : null;
}

/**
 * Get location (sede) from backoffice by ID
 */
export async function getLocationFromBackoffice(
  locationId: string,
): Promise<BackofficeLocation | null> {
  const res = await fetch(`${BACKOFFICE_API_URL}/sedes/${locationId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch location from backoffice");
  }

  return (await res.json()) as BackofficeLocation;
}

/**
 * Get all locations (sedes) from backoffice
 */
export async function getAllLocationsFromBackoffice(): Promise<
  BackofficeLocation[]
> {
  const res = await fetch(`${BACKOFFICE_API_URL}/sedes/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch locations from backoffice");
  }

  return (await res.json()) as BackofficeLocation[];
}
