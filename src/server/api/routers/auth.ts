import { createTRPCRouter, protectedProcedure } from "../trpc";
// import { roles, users } from "~/server/db/schema";
// import { eq } from "drizzle-orm";
// import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    // First, get user data quickly
    // For now, we return the user from context directly since we don't have local DB sync yet
    // The context user comes from getMe() in core-api called in trpc context creation
    const ctxUser = ctx.user;

    // If we need extended info not in the token, we should fetch it from Core API here or return partial data
    // based on what's available in ctx.user (which comes from Core /me endpoint)

    // Mapping Core User to our internal UserData structure as best as possible
    // Note: You might need to adjust types in core-api.ts 'User' interface to match actual response

    // Split name into first name and last name
    const fullName = ctxUser.name ?? "";
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0] ?? null;
    const lastName = nameParts.slice(1).join(" ") || null;

    const user = userResult[0]!;

    // Then get role data if exists
    let roleData = null;
    if (user.id_rol) {
      const roleResult = await ctx.db
        .select({
          nombre_rol: roles.nombre_rol,
          descripcion: roles.descripcion,
          subcategoria: roles.subcategoria,
          sueldo_base: roles.sueldo_base,
          status: roles.status,
        })
        .from(roles)
        .where(eq(roles.id_rol, user.id_rol))
        .limit(1);

      roleData = roleResult[0] ?? null;
    }

    return {
      user: {
        id: ctxUser.id,
        name: firstName,
        last_name: lastName,
        email: ctxUser.email,
        phone: null,
        identity_card: null,
        career: null,
        rol: ctxUser.role! ?? "alumno", // Defaulting for now, or extract from token claims if available
        subrol: ctxUser.subrol ?? null,
        description: null,
        subcategory: null,
        base_salary: null,
        status: true,
      },
    };
  }),
});
