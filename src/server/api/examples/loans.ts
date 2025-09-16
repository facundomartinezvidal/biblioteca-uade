import { randomUUID } from "crypto";

export function buildLoansList(): Record<string, unknown> {
  return {
    results: [
      {
        id: randomUUID(),
        title: "Clean Code",
        author: {
          id: randomUUID(),
          name: "Robert",
          middleName: "C.",
          lastName: "Martin",
          createdAt: new Date().toISOString(),
        },
        gender: {
          id: randomUUID(),
          name: "Programming",
          createdAt: new Date().toISOString(),
        },
        location: {
          id: randomUUID(),
          address: "Independencia Piso 5",
          campus: "MONSERRAT",
          createdAt: new Date().toISOString(),
        },
        imageUrl: "https://example.com/image.jpg",
        createdAt: new Date().toISOString(),
      },
      {
        id: randomUUID(),
        title: "Clean Agile",
        author: {
          id: randomUUID(),
          name: "Robert",
          middleName: "C.",
          lastName: "Martin",
          createdAt: new Date().toISOString(),
        },
        gender: {
          id: randomUUID(),
          name: "Programming",
          createdAt: new Date().toISOString(),
        },
        location: {
          id: randomUUID(),
          address: "Lima 1 Piso 2",
          campus: "MONSERRAT",
          createdAt: new Date().toISOString(),
        },
        imageUrl: "https://example.com/image.jpg",
        createdAt: new Date().toISOString(),
      },
    ],
    filters: [
      { key: "status", values: ["ACTIVE"] },
      { key: "search", values: ["Clean"] },
    ],
    page: 1,
    limit: 10,
    total: 0,
  };
}

export function buildLoansById(): Record<string, unknown> {
  return {
    id: randomUUID(),
    book: {
      id: randomUUID(),
      title: "Clean Agile",
      author: {
        id: randomUUID(),
        name: "Robert",
        middleName: "C.",
        lastName: "Martin",
        createdAt: new Date().toISOString(),
      },
      gender: {
        id: randomUUID(),
        name: "Programming",
        createdAt: new Date().toISOString(),
      },
      location: {
        id: randomUUID(),
        address: "Lima 1 Piso 2",
        campus: "MONSERRAT",
        createdAt: new Date().toISOString(),
      },
      imageUrl: "https://example.com/image.jpg",
      createdAt: new Date().toISOString(),
    },
    userId: randomUUID(),
    endDate: new Date().toISOString(),
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  };
}
