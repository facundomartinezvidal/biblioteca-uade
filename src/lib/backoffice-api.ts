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

export interface BackofficeParameter {
  id_parametro: string;
  nombre: string;
  tipo: "multa" | "sancion";
  valor_numerico: string;
  valor_texto: string | null;
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

/**
 * Get all users with ALUMNO role from backoffice
 * Supports pagination and search
 */
export async function getStudentsFromBackoffice(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ users: BackofficeUser[]; total: number }> {
  // First, get all users
  const res = await fetch(`${BACKOFFICE_API_URL}/users/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users from backoffice");
  }

  let users = (await res.json()) as BackofficeUser[];

  // Filter by ALUMNO role
  users = users.filter((user) => user.rol.categoria.toUpperCase() === "ALUMNO");

  // Apply search filter if provided
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    users = users.filter(
      (user) =>
        user.nombre.toLowerCase().includes(searchLower) ||
        user.apellido.toLowerCase().includes(searchLower) ||
        user.legajo.toLowerCase().includes(searchLower) ||
        user.email_institucional.toLowerCase().includes(searchLower) ||
        user.dni.toLowerCase().includes(searchLower),
    );
  }

  const total = users.length;

  // Apply pagination
  if (params?.page && params?.limit) {
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;
    users = users.slice(start, end);
  }

  return { users, total };
}

/**
 * Get student by ID from backoffice
 */
export async function getStudentByIdFromBackoffice(
  userId: string,
): Promise<BackofficeUser | null> {
  // Get all users and find the specific one
  const res = await fetch(`${BACKOFFICE_API_URL}/users/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users from backoffice");
  }

  const users = (await res.json()) as BackofficeUser[];
  const user = users.find((u) => u.id_usuario === userId);

  // Ensure it's a student
  if (user && user.rol.categoria.toUpperCase() === "ALUMNO") {
    return user;
  }

  return null;
}

/**
 * Get all parameters from backoffice
 */
export async function getAllParametersFromBackoffice(): Promise<
  BackofficeParameter[]
> {
  const res = await fetch(`${BACKOFFICE_API_URL}/parametros`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch parameters from backoffice");
  }

  const parameters = (await res.json()) as BackofficeParameter[];
  
  // Filter only active parameters
  return parameters.filter((param) => param.status === true);
}

/**
 * Get parameter by name from backoffice
 */
export async function getParameterByNameFromBackoffice(
  name: string,
): Promise<BackofficeParameter | null> {
  const parameters = await getAllParametersFromBackoffice();
  return parameters.find((param) => param.nombre === name) ?? null;
}

/**
 * Get parameters by type from backoffice
 */
export async function getParametersByTypeFromBackoffice(
  type: "multa" | "sancion",
): Promise<BackofficeParameter[]> {
  const parameters = await getAllParametersFromBackoffice();
  return parameters.filter((param) => param.tipo === type);
}
