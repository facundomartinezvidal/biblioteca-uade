import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { randomUUID } from "crypto";

// Mock data for loans while database is being configured
const mockLoansData = [
  {
    id: randomUUID(),
    userId: "temp-user-id",
    endDate: "2024-02-15T00:00:00.000Z",
    status: "ACTIVE",
    createdAt: "2024-01-15T00:00:00.000Z",
    book: {
      id: randomUUID(),
      title: "Cien años de soledad",
      description:
        "Una novela épica que narra la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo.",
      isbn: "978-84-376-0494-7",
      status: "NOT_AVAILABLE",
      year: 1967,
      editorial: "Sudamericana",
      imageUrl: "/covers/cien-anos-soledad.jpg",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    author: {
      id: randomUUID(),
      name: "Gabriel",
      middleName: "José",
      lastName: "García Márquez",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    gender: {
      id: randomUUID(),
      name: "Literatura",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    location: {
      id: randomUUID(),
      address: "Piso 1, Sección Literatura",
      campus: "MONSERRAT",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
  },
  {
    id: randomUUID(),
    userId: "temp-user-id",
    endDate: "2024-02-20T00:00:00.000Z",
    status: "RESERVED",
    createdAt: "2024-01-20T00:00:00.000Z",
    book: {
      id: randomUUID(),
      title: "La ciudad y los perros",
      description:
        "Una novela que narra la vida de los cadetes en el Colegio Militar Leoncio Prado y sus experiencias de violencia y amistad.",
      isbn: "978-84-376-0495-4",
      status: "NOT_AVAILABLE",
      year: 1963,
      editorial: "Seix Barral",
      imageUrl: "/covers/ciudad-perros.jpg",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    author: {
      id: randomUUID(),
      name: "Mario",
      middleName: "Vargas",
      lastName: "Llosa",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    gender: {
      id: randomUUID(),
      name: "Literatura",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    location: {
      id: randomUUID(),
      address: "Piso 1, Sección Literatura",
      campus: "MONSERRAT",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
  },
  {
    id: randomUUID(),
    userId: "temp-user-id",
    endDate: "2024-01-10T00:00:00.000Z",
    status: "EXPIRED",
    createdAt: "2023-12-10T00:00:00.000Z",
    book: {
      id: randomUUID(),
      title: "Rayuela",
      description:
        "Una novela experimental que puede leerse de múltiples maneras, explorando temas como el amor, la búsqueda de sentido y la vida bohemia en París.",
      isbn: "978-84-376-0496-1",
      status: "AVAILABLE",
      year: 1963,
      editorial: "Sudamericana",
      imageUrl: "/covers/rayuela.jpeg",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    author: {
      id: randomUUID(),
      name: "Julio",
      middleName: "",
      lastName: "Cortázar",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    gender: {
      id: randomUUID(),
      name: "Literatura",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    location: {
      id: randomUUID(),
      address: "Piso 1, Sección Literatura",
      campus: "MONSERRAT",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
  },
];

export const loansRouter = createTRPCRouter({
  getByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(async ({ input }) => {
      // Filter by userId and apply pagination
      const userLoans = mockLoansData.filter(
        (loan) => loan.userId === input.userId,
      );
      const offset = (input.page - 1) * input.limit;
      const paginatedLoans = userLoans.slice(offset, offset + input.limit);

      return {
        results: paginatedLoans,
        total: userLoans.length,
        page: input.page,
        limit: input.limit,
      };
    }),

  getActive: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const activeLoans = mockLoansData.filter(
        (loan) => loan.userId === input.userId && loan.status === "ACTIVE",
      );

      return {
        results: activeLoans,
        total: activeLoans.length,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const loan = mockLoansData.find((loan) => loan.id === input.id);
      return loan ?? null;
    }),
});
