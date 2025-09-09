import { Separator } from "@radix-ui/react-separator";
import QueryCard from "./query-card";
import { type Parameter, type ResponseField } from "./types";

export default function QuerySection({ title }: { title: string }) {
  // Ejemplo de parámetros dinámicos
  const exampleParameters: Parameter[] = [
    {
      field: "name",
      type: "string",
      example: '"John Doe"',
      required: true,
    },
    {
      field: "age",
      type: "number",
      example: "30",
      required: true,
    },
    {
      field: "greeting",
      type: "string",
      example: '"Hello"',
      required: false,
    },
  ];

  // Ejemplo de campos de respuesta dinámicos
  const exampleResponseFields: ResponseField[] = [
    {
      field: "message",
      type: "string",
      description: "Mensaje de saludo personalizado",
    },
    {
      field: "timestamp",
      type: "string",
      description: "Fecha y hora de la respuesta en formato ISO",
    },
    {
      field: "user",
      type: "object",
      description: "Información del usuario que hizo la petición",
    },
  ];

  // Ejemplos de request y response
  const exampleRequest = {
    name: "John Doe",
    age: 30,
    greeting: "Hello",
  };

  const exampleResponse = {
    message: "Hello John Doe! You are 30 years old.",
    timestamp: "2025-09-09T10:30:00Z",
    user: {
      name: "John Doe",
      age: 30,
    },
  };

  return (
    <div>
      <h2 className="text-lg font-medium">{title}</h2>
      <Separator />
      <QueryCard
        method="GET"
        endpoint="hello"
        description="Endpoint para que el servidor te salude de manera personalizada"
        parameters={exampleParameters}
        responseFields={exampleResponseFields}
        exampleRequest={exampleRequest}
        exampleResponse={exampleResponse}
      />
    </div>
  );
}
