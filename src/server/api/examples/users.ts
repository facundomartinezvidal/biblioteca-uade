import { randomUUID } from "crypto";

export function buildUserByIdResponse(): Record<string, unknown> {
  return {
    id: randomUUID(),
    name: "John",
    lastName: "Doe",
    username: "john.doe",
    emailUniversity: "john.doe@example.com",
    emailPersonal: "john.doe@example.com",
    phone: "1234567890",
    identityCard: "1234567890",
    career: "Computer Science",
    imageUrl: "https://example.com/image.jpg",
    role: "STUDENT",
    totalLoans: 1,
    activeLoans: 1,
  };
}
