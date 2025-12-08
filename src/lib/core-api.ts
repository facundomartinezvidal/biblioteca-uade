export const CORE_API_URL =
  "https://jtseq9puk0.execute-api.us-east-1.amazonaws.com";

export const CORE_FRONTEND_URL = "https://core-frontend-2025-02.netlify.app";

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface AuthTokens {
  success: boolean;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  subrol?: string | null;
  // Add other fields as needed
}

// Raw response from Core API /me endpoint
export interface CoreMeResponse {
  user: {
    sub: string; // JWT standard field for user ID
    email: string;
    name?: string;
    role?: string;
    subrol?: string | null;
  };
}

export interface VerifyResponse {
  valid: boolean;
  kind: string;
  reason?: string;
}

export async function login(credentials: LoginRequest): Promise<AuthTokens> {
  const res = await fetch(`${CORE_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Login failed");
  }

  return res.json() as Promise<AuthTokens>;
}

export async function refreshToken(token: string): Promise<AuthTokens> {
  const res = await fetch(`${CORE_API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken: token }),
  });

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  return res.json() as Promise<AuthTokens>;
}

export async function getMe(token: string): Promise<{ user: User }> {
  const res = await fetch(`${CORE_API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  const response = (await res.json()) as CoreMeResponse;

  // Map the Core API response to our User interface
  // JWT uses 'sub' field for user ID
  return {
    user: {
      id: response.user.sub,
      email: response.user.email,
      name: response.user.name,
      role: response.user.role,
      subrol: response.user.subrol,
    },
  };
}

export async function verifyToken(
  token: string,
  kind: "access" | "refresh" = "access",
): Promise<VerifyResponse> {
  const res = await fetch(`${CORE_API_URL}/api/auth/verify-jwt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ kind, token }),
  });

  if (!res.ok) {
    return { valid: false, kind };
  }

  return res.json() as Promise<VerifyResponse>;
}
