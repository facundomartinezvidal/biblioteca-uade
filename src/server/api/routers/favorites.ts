import { createTRPCRouter, protectedProcedure } from "../trpc";
import { favorites } from "~/server/db/schemas/favorites";
import { books, authors, genders, editorials } from "~/server/db/schemas";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

export const favoritesRouter = createTRPCRouter({
  // Agregar libro a favoritos
  addFavorite: protectedProcedure
    .input(
      z.object({
        bookId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verificar si ya existe en favoritos
      const existingFavorite = await ctx.db
        .select()
        .from(favorites)
        .where(
          and(
            eq(favorites.userId, ctx.user.id),
            eq(favorites.bookId, input.bookId),
          ),
        )
        .limit(1);

      if (existingFavorite.length > 0) {
        return {
          success: false,
          message: "El libro ya está en favoritos",
        };
      }

      await ctx.db.insert(favorites).values({
        userId: ctx.user.id,
        bookId: input.bookId,
        createdAt: new Date().toISOString(),
      });

      return {
        success: true,
        message: "Libro agregado a favoritos",
      };
    }),

  // Eliminar libro de favoritos
  removeFavorite: protectedProcedure
    .input(
      z.object({
        bookId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(favorites)
        .where(
          and(
            eq(favorites.userId, ctx.user.id),
            eq(favorites.bookId, input.bookId),
          ),
        );

      return {
        success: true,
        message: "Libro eliminado de favoritos",
      };
    }),

  // Obtener todos los favoritos del usuario con información completa del libro
  getFavorites: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userFavorites = await ctx.db
        .select({
          favoriteId: favorites.id,
          bookId: books.id,
          title: books.title,
          description: books.description,
          isbn: books.isbn,
          status: books.status,
          year: books.year,
          imageUrl: books.imageUrl,
          location: books.locationId,
          author: authors.name,
          authorMiddleName: authors.middleName,
          authorLastName: authors.lastName,
          gender: genders.name,
          editorial: editorials.name,
          createdAt: favorites.createdAt,
        })
        .from(favorites)
        .where(eq(favorites.userId, ctx.user.id))
        .leftJoin(books, eq(favorites.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .orderBy(desc(favorites.createdAt));

      if (!userFavorites || !Array.isArray(userFavorites)) {
        return [];
      }

      return userFavorites
        .filter((fav) => fav.bookId !== null)
        .map((fav) => ({
          id: fav.bookId!,
          title: fav.title ?? "",
          author: fav.author ?? null,
          authorMiddleName: fav.authorMiddleName ?? null,
          authorLastName: fav.authorLastName ?? null,
          editorial: fav.editorial ?? null,
          year: fav.year ?? null,
          gender: fav.gender ?? null,
          description: fav.description ?? null,
          isbn: fav.isbn ?? null,
          location: fav.location ?? null,
          imageUrl: fav.imageUrl ?? null,
          status: fav.status ?? null,
        }));
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return [];
    }
  }),

  // Verificar si un libro está en favoritos
  isFavorite: protectedProcedure
    .input(
      z.object({
        bookId: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const favorite = await ctx.db
        .select()
        .from(favorites)
        .where(
          and(
            eq(favorites.userId, ctx.user.id),
            eq(favorites.bookId, input.bookId),
          ),
        )
        .limit(1);

      return {
        isFavorite: favorite.length > 0,
      };
    }),

  // Obtener IDs de todos los libros en favoritos (útil para marcar múltiples libros)
  getFavoriteIds: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userFavorites = await ctx.db
        .select({
          bookId: favorites.bookId,
        })
        .from(favorites)
        .where(eq(favorites.userId, ctx.user.id));

      if (!userFavorites || !Array.isArray(userFavorites)) {
        return [];
      }

      return userFavorites
        .filter(
          (fav): fav is typeof fav & { bookId: string } => fav.bookId !== null,
        )
        .map((fav) => fav.bookId);
    } catch (error) {
      console.error("Error fetching favorite IDs:", error);
      return [];
    }
  }),
});
