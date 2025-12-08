import { createTRPCRouter, protectedProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    // Return user data from context (comes from backoffice via middleware)
    const ctxUser = ctx.user;

    // Split name into first name and last name
    const fullName = ctxUser.name ?? "";
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0] ?? null;
    const lastName = nameParts.slice(1).join(" ") || null;

    return {
      user: {
        id: ctxUser.id,
        name: firstName,
        last_name: lastName,
        email: ctxUser.email,
        phone: null,
        identity_card: null,
        career: null,
        rol: ctxUser.role ?? "alumno",
        subrol: ctxUser.subrol ?? null,
        description: null,
        subcategory: null,
        base_salary: null,
        status: true,
      },
    };
  }),
});
