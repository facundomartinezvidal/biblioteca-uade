import { randomUUID } from "crypto";

export function buildBooksListResponse(): Record<string, unknown> {
  return {
    results: [
      {
        id: randomUUID(),
        title: "Clean Code",
        description: "A book about clean code",
        isbn: "1234567890",
        status: "AVAILABLE",
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
      {
        id: randomUUID(),
        title: "",
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
    ],
    filters: ["Programming"],
    total: 2,
    page: 1,
    limit: 10,
  };
}

export function buildBookByIdResponse(): Record<string, unknown> {
  return {
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
      address: "Lima 1 Piso 2",
      campus: "MONSERRAT",
      createdAt: new Date().toISOString(),
    },
    year: 2020,
    editorial: "Pearson",
    imageUrl: "https://example.com/image.jpg",
    createdAt: new Date().toISOString(),
  };
}
