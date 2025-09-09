export interface Parameter {
  field: string;
  type: string;
  example: string;
  required?: boolean;
}

export interface ResponseField {
  field: string;
  type: string;
  description: string;
}

export interface QueryCardProps {
  description: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  parameters?: Parameter[];
  responseFields?: ResponseField[];
  exampleRequest?: Record<string, unknown> | null;
  exampleResponse?: Record<string, unknown> | null;
}
