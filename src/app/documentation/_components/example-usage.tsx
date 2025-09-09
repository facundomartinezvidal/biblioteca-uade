import QueryCard from "./query-card";
import { type Parameter, type ResponseField } from "./types";

/**
 * Ejemplo de cómo usar el componente QueryCard con datos dinámicos
 *
 * Este archivo muestra diferentes casos de uso:
 * 1. Endpoint con parámetros requeridos y opcionales
 * 2. Endpoint sin parámetros (solo respuesta)
 * 3. Endpoint POST con body complejo
 */

export default function ExampleUsage() {
  // Ejemplo 1: GET con parámetros
  const getUserParameters: Parameter[] = [
    {
      field: "id",
      type: "string",
      example: '"user123"',
      required: true,
    },
    {
      field: "include",
      type: "string[]",
      example: '["profile", "posts"]',
      required: false,
    },
  ];

  const getUserResponse: ResponseField[] = [
    {
      field: "id",
      type: "string",
      description: "ID único del usuario",
    },
    {
      field: "name",
      type: "string",
      description: "Nombre completo del usuario",
    },
    {
      field: "email",
      type: "string",
      description: "Correo electrónico del usuario",
    },
    {
      field: "profile",
      type: "object | null",
      description: "Perfil del usuario (si se incluye)",
    },
  ];

  // Ejemplo 2: POST con body complejo
  const createBookParameters: Parameter[] = [
    {
      field: "title",
      type: "string",
      example: '"El Quijote"',
      required: true,
    },
    {
      field: "author",
      type: "string",
      example: '"Miguel de Cervantes"',
      required: true,
    },
    {
      field: "isbn",
      type: "string",
      example: '"978-84-376-0494-7"',
      required: true,
    },
    {
      field: "genre",
      type: "string",
      example: '"Novela"',
      required: false,
    },
    {
      field: "publishedYear",
      type: "number",
      example: "1605",
      required: false,
    },
  ];

  const createBookResponse: ResponseField[] = [
    {
      field: "id",
      type: "string",
      description: "ID único del libro creado",
    },
    {
      field: "title",
      type: "string",
      description: "Título del libro",
    },
    {
      field: "author",
      type: "string",
      description: "Autor del libro",
    },
    {
      field: "createdAt",
      type: "string",
      description: "Fecha de creación en formato ISO",
    },
  ];

  // Ejemplo 3: GET sin parámetros
  const getBooksResponse: ResponseField[] = [
    {
      field: "books",
      type: "array",
      description: "Lista de todos los libros disponibles",
    },
    {
      field: "total",
      type: "number",
      description: "Número total de libros",
    },
    {
      field: "page",
      type: "number",
      description: "Página actual",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Ejemplo 1: GET con parámetros */}
      <QueryCard
        method="GET"
        endpoint="users/{id}"
        description="Obtiene la información de un usuario específico por su ID"
        parameters={getUserParameters}
        responseFields={getUserResponse}
        exampleRequest={{
          id: "user123",
          include: ["profile", "posts"],
        }}
        exampleResponse={{
          id: "user123",
          name: "Juan Pérez",
          email: "juan@example.com",
          profile: {
            bio: "Estudiante de ingeniería",
            avatar: "https://example.com/avatar.jpg",
          },
        }}
      />

      {/* Ejemplo 2: POST con body complejo */}
      <QueryCard
        method="POST"
        endpoint="books"
        description="Crea un nuevo libro en la biblioteca"
        parameters={createBookParameters}
        responseFields={createBookResponse}
        exampleRequest={{
          title: "El Quijote",
          author: "Miguel de Cervantes",
          isbn: "978-84-376-0494-7",
          genre: "Novela",
          publishedYear: 1605,
        }}
        exampleResponse={{
          id: "book456",
          title: "El Quijote",
          author: "Miguel de Cervantes",
          createdAt: "2025-09-09T10:30:00Z",
        }}
      />

      {/* Ejemplo 3: GET sin parámetros */}
      <QueryCard
        method="GET"
        endpoint="books"
        description="Obtiene la lista de todos los libros disponibles en la biblioteca"
        parameters={[]} // Sin parámetros
        responseFields={getBooksResponse}
        exampleRequest={null} // Sin request body
        exampleResponse={{
          books: [
            {
              id: "book1",
              title: "Don Quijote de la Mancha",
              author: "Miguel de Cervantes",
            },
            {
              id: "book2",
              title: "Cien años de soledad",
              author: "Gabriel García Márquez",
            },
          ],
          total: 2,
          page: 1,
        }}
      />
    </div>
  );
}
