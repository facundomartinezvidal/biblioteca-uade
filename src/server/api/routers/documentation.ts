import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { randomUUID } from "crypto";
import {
  buildBookByIdResponse,
  buildBooksListResponse,
} from "../examples/book";
import { buildUserByIdResponse } from "../examples/users";
import { buildNotificationsList } from "../examples/notifications";
import { buildLoansList } from "../examples/loans";
import {
  buildPenaltyByIdResponse,
  buildPenaltyListResponse,
} from "../examples/penalty";

export interface DocumentationResponse {
  method: string;
  endpoint: string;
  description: string;
  request?: Record<string, unknown>;
  body?: Record<string, unknown>;
  response: Record<string, unknown>;
}

const documentationResponseSchema = z.object({
  method: z.string(),
  endpoint: z.string(),
  description: z.string(),
  request: z.record(z.unknown()).optional(),
  body: z.record(z.unknown()).optional(),
  response: z.record(z.unknown()),
});

export const documentationRouter = createTRPCRouter({
  groups: publicProcedure
    .output(
      z.array(
        z.object({
          group: z.string(),
          endpoints: z.array(documentationResponseSchema),
        }),
      ),
    )
    .query(() => {
      // Books
      const booksEndpoints: DocumentationResponse[] = [
        {
          method: "GET",
          endpoint: "/books.getAll",
          description: "Obtiene todos los libros",
          request: {
            page: 1,
            limit: 10,
            filters: [{ key: "filters", values: ["Programming"] }],
          },
          response: buildBooksListResponse(),
        },
        {
          method: "GET",
          endpoint: "/books.getById{id}",
          description: "Obtiene un libro por su ID",
          request: { id: randomUUID() },
          response: buildBookByIdResponse(),
        },
        {
          method: "GET",
          endpoint: "/books.getFavorites{userId}",
          description: "Obtiene los libros favoritos de un usuario por su ID",
          request: { userId: randomUUID() },
          response: buildBooksListResponse(),
        },
        {
          method: "GET",
          endpoint: "/books.getRecommended{userId}",
          description:
            "Obtiene los libros recomendados para un usuario por su ID",
          request: { userId: randomUUID() },
          response: buildBooksListResponse(),
        },
      ];

      // Users
      const usersEndpoints: DocumentationResponse[] = [
        {
          method: "GET",
          endpoint: "/users.getById{id}",
          description: "Obtiene un usuario por su ID",
          request: { id: randomUUID() },
          response: buildUserByIdResponse(),
        },
      ];

      // Notifications
      const notificationsEndpoints: DocumentationResponse[] = [
        {
          method: "GET",
          endpoint: "/notifications.getByUserId{id}",
          description:
            "Obtiene todas las notificaciones de un usuario por su ID",
          request: { id: randomUUID() },
          response: buildNotificationsList(),
        },
      ];

      // Loans
      const loansEndpoints: DocumentationResponse[] = [
        {
          method: "GET",
          endpoint: "/loans.getByUserId{id}",
          description: "Obtiene todos los préstamos de un usuario por su ID",
          request: {
            page: 1,
            limit: 10,
            filters: [{ key: "filters", values: ["ACTIVE"] }],
          },
          response: buildLoansList(),
        },
        {
          method: "GET",
          endpoint: "/loans.getById{id}",
          description: "Obtiene un préstamo por su ID",
          request: { id: randomUUID() },
          response: buildLoansList(),
        },
        {
          method: "POST",
          endpoint: "/loans.reserve",
          description: "Crea un nueva Reserva",
          body: {
            bookId: randomUUID(),
            userId: randomUUID(),
            endDate: new Date().toISOString(),
          },
          response: {
            success: true,
            message: "Préstamo reservado correctamente",
            loanId: randomUUID(),
          },
        },
        {
          method: "POST",
          endpoint: "/loans.renew{id}",
          description: "Renueva un préstamo por su ID",
          body: {
            userId: randomUUID(),
          },
          response: {
            success: true,
            message: "Préstamo renovado correctamente",
            loanId: randomUUID(),
          },
        },
        {
          method: "PUT",
          endpoint: "/loans.cancel{id}",
          description: "Cancela un préstamo por su ID",
          body: {
            userId: randomUUID(),
          },
          response: {
            success: true,
            message: "Préstamo cancelado correctamente",
            loanId: randomUUID(),
          },
        },
        {
          method: "PUT",
          endpoint: "/loans.activate{id}",
          description: "Activa un préstamo por su ID",
          body: {
            userId: randomUUID(),
          },
          response: {
            success: true,
            message: "Préstamo activado correctamente",
            loanId: randomUUID(),
          },
        },
        {
          method: "PUT",
          endpoint: "/loans.finish{id}",
          description: "Finaliza un préstamo por su ID",
          body: {
            userId: randomUUID(),
          },
          response: {
            success: true,
            message: "Préstamo finalizado correctamente",
            loanId: randomUUID(),
          },
        },
      ];

      const penaltiesEndpoints: DocumentationResponse[] = [
        {
          method: "GET",
          endpoint: "/penalties.getById{id}",
          description: "Obtiene una penalización por su ID",
          request: { id: randomUUID() },
          response: buildPenaltyByIdResponse(),
        },
        {
          method: "GET",
          endpoint: "/penalties.getAll{userId}",
          description:
            "Obtiene todas las penalizaciones de un usuario por su ID",
          request: {
            page: 1,
            limit: 10,
            filters: [{ key: "filters", values: ["PENDING"] }],
          },
          response: buildPenaltyListResponse(),
        },
      ];

      return [
        { group: "Books", endpoints: booksEndpoints },
        { group: "Users", endpoints: usersEndpoints },
        { group: "Notifications", endpoints: notificationsEndpoints },
        { group: "Loans", endpoints: loansEndpoints },
        { group: "Penalties", endpoints: penaltiesEndpoints },
      ];
    }),
});
