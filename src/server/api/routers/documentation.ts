import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { randomUUID } from "crypto";
import {
  buildBookByIdResponse,
  buildBooksListResponse,
} from "../examples/book";
import { buildUserByIdResponse } from "../examples/users";
import { buildNotificationsList } from "../examples/notifications";
import { buildLoansById, buildLoansList } from "../examples/loans";
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
        {
          method: "GET",
          endpoint: "/books.getReadBooks{userId}",
          description: "Obtiene los libros leídos por un usuario por su ID",
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
          endpoint: "/loans.getActive{id}",
          description: "Obtiene los préstamos activos por su ID",
          request: { id: randomUUID() },
          response: buildLoansList(),
        },
        {
          method: "GET",
          endpoint: "/loans.nextDeadline{id}",
          description:
            "Obtiene los préstamos con la fecha proxima a vencer por su ID",
          request: { id: randomUUID() },
          response: buildLoansList(),
        },
        {
          method: "GET",
          endpoint: "/loans.getById{id}",
          description: "Obtiene un préstamo por su ID",
          request: { id: randomUUID() },
          response: buildLoansById(),
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
        {
          method: "POST",
          endpoint: "/penalties.create",
          description: "Crea una penalización",
          body: {
            userId: randomUUID(),
            motive: "LOANS_EXPIRED",
          },
          response: buildPenaltyByIdResponse(),
        },
      ];

      const libraryEndpoints: DocumentationResponse[] = [
        {
          method: "GET",
          endpoint: "/library.getAll",
          description: "Obtiene todas las bibliotecas",
          request: {
            page: 1,
            limit: 10,
            filters: [{ key: "filters", values: ["MONSERRAT"] }],
          },
          response: {
            results: [
              {
                id: randomUUID(),
                name: "Biblioteca de Montserrat",
                address: "Lima 1 Piso 2",
                campus: "MONSERRAT",
                hours: "09:00 - 18:00",
                createdAt: new Date().toISOString(),
              },
            ],
            total: 1,
            page: 1,
            limit: 10,
          },
        },
      ];

      const errorsEndpoints: DocumentationResponse[] = [
        {
          method: "ERROR",
          endpoint: "/errors.badRequest",
          description: "Solicitud inválida (400)",
          response: {
            status: 400,
            code: "BAD_REQUEST",
            message: "The request parameters are invalid",
            traceId: randomUUID(),
          },
        },
        {
          method: "ERROR",
          endpoint: "/errors.unauthorized",
          description: "No autorizado (401)",
          response: {
            status: 401,
            code: "UNAUTHORIZED",
            message: "Authentication is required",
            traceId: randomUUID(),
          },
        },
        {
          method: "ERROR",
          endpoint: "/errors.forbidden",
          description: "Prohibido (403)",
          response: {
            status: 403,
            code: "FORBIDDEN",
            message: "You do not have access to this resource",
            traceId: randomUUID(),
          },
        },
        {
          method: "ERROR",
          endpoint: "/errors.notFound",
          description: "No encontrado (404)",
          response: {
            status: 404,
            code: "NOT_FOUND",
            message: "The requested resource was not found",
            traceId: randomUUID(),
          },
        },

        {
          method: "ERROR",
          endpoint: "/errors.internal",
          description: "Error interno del servidor (500)",
          response: {
            status: 500,
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred",
            traceId: randomUUID(),
          },
        },
      ];

      const externalBackOfficeEndpoints: DocumentationResponse[] = [
        {
          method: "GET",
          endpoint: "https://backoffice-yoem.onrender.com/api/v1/users/{id}",
          description: "Obtiene un usuario por su ID desde el backoffice",
          request: { id: randomUUID() },
          response: {
            id: randomUUID(),
            name: "Juan Pérez",
            email: "juan@example.com",
            role: "STUDENT",
          },
        },
        {
          method: "GET",
          endpoint:
            "https://backoffice-yoem.onrender.com/api/v1/penalties/{motive}",
          description: "Obtiene las multas desde el backoffice por motivo",
          request: { motive: "LOANS_EXPIRED" },
          response: {
            id: randomUUID(),
            userId: randomUUID(),
            motive: "LOANS_EXPIRED",
            amount: 100,
          },
        },
        {
          method: "GET",
          endpoint:
            "https://backoffice-yoem.onrender.com/api/v1/spaces/libraries",
          description: "Obtiene todas las bibliotecas desde el backoffice",
          response: {
            locations: [
              {
                id: randomUUID(),
                address: "Lima 1 Piso 2",
                campus: "MONSERRAT",
                hours: "09:00 - 18:00",
              },
              {
                id: randomUUID(),
                address: "Independencia Piso 5",
                campus: "RECOLETA",
                hours: "09:00 - 18:00",
              },
            ],
          },
        },
      ];

      const externalCoreEndpoints: DocumentationResponse[] = [
        {
          method: "GET",
          endpoint: "https://api-core/api/auth/login",
          description: "Obtiene un token de acceso desde el Core",
          body: {
            email: "juan@example.com",
            password: "123456",
          },
          response: {
            success: true,
            data: {
              access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              token_type: "Bearer",
              expires_in: 3600,
              user: {
                uuid: randomUUID(),
                name: "John Doe",
                email: "john.doe@example.com",
              },
            },
          },
        },
        {
          method: "GET",
          endpoint: "https://api-core/api/auth/refresh",
          description: "Refresca un token de acceso desde el Core",
          body: {
            refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
          response: {
            success: true,
            data: {
              access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              token_type: "Bearer",
              expires_in: 3600,
              user: {
                uuid: randomUUID(),
                name: "John Doe",
                email: "john.doe@example.com",
              },
            },
          },
        },
        {
          method: "GET",
          endpoint: "https://api-core/api/auth/logout",
          description: "Cierra la sesión desde el Core",
          response: {
            success: true,
            message: "Logout successful",
          },
        },
        {
          method: "GET",
          endpoint: "https://api-core/api/wallets/by-user/{user_id}",
          description: "Obtiene el wallet de un usuario desde el Core",
          request: { user_id: randomUUID(), currency: "ARS" },
          response: {
            uuid: randomUUID(),
            userId: randomUUID(),
            currency: "ARS",
            status: "active",
            createdAt: new Date().toISOString(),
          },
        },
        {
          method: "POST",
          endpoint: "https://api-core/api/transactions/by-user/{user_id}",
          description: "Crea un transacción de un usuario desde el Core",
          body: {
            user_id: randomUUID(),
            currency: "ARS",
            amount: 100,
            type: "penalty_payment",
            description: "Pago de multa de 100 ARS",
          },
          response: {
            uuid: randomUUID(),
            userId: randomUUID(),
            currency: "ARS",
            status: "completed",
            createdAt: new Date().toISOString(),
          },
        },
      ];

      return [
        { group: "Books", endpoints: booksEndpoints },
        { group: "Users", endpoints: usersEndpoints },
        { group: "Notifications", endpoints: notificationsEndpoints },
        { group: "Loans", endpoints: loansEndpoints },
        { group: "Penalties", endpoints: penaltiesEndpoints },
        { group: "Library", endpoints: libraryEndpoints },
        { group: "Errors", endpoints: errorsEndpoints },
        {
          group: "Backoffice - Endpoints",
          endpoints: externalBackOfficeEndpoints,
        },
        {
          group: "Core - Endpoints",
          endpoints: externalCoreEndpoints,
        },
      ];
    }),
});
