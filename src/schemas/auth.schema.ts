export const authRequestSchema = {
  type: "object",
  required: ["email", "password"],
  additionalProperties: false,
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 1 },
  },
} as const;

export const registerResponseSchema = {
  type: "object",
  required: ["id", "token"],
  additionalProperties: false,
  properties: {
    id: { type: "integer" },
    token: { type: "string" },
  },
} as const;

export const loginResponseSchema = {
  type: "object",
  required: ["token"],
  additionalProperties: false,
  properties: {
    token: { type: "string" },
  },
} as const;

export const errorResponseSchema = {
  type: "object",
  required: ["error"],
  additionalProperties: false,
  properties: {
    error: { type: "string" },
    message: { type: "string" },
  },
} as const;
