"use server";

import { cookies } from "next/headers";
import { login, type LoginRequest, CORE_FRONTEND_URL } from "~/lib/core-api";
import { redirect } from "next/navigation";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  sameSite: "lax" as const,
};

export async function loginAction(credentials: LoginRequest) {
  try {
    const tokens = await login(credentials);

    const cookieStore = await cookies();
    cookieStore.set("access_token", tokens.access_token, {
      ...COOKIE_OPTIONS,
      maxAge: tokens.expires_in,
    });
    cookieStore.set("refresh_token", tokens.refresh_token, {
      ...COOKIE_OPTIONS,
      maxAge: 30 * 24 * 60 * 60, // 30 days usually, or match API
    });
  } catch (error) {
    return { error: (error as Error).message };
  }

  redirect("/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  redirect(CORE_FRONTEND_URL);
}
