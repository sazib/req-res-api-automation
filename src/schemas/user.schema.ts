export const userSchema = {
  type: "object",
  required: ["id", "email", "first_name", "last_name", "avatar"],
  properties: {
    id: { type: "integer" },
    email: { type: "string", format: "email" },
    first_name: { type: "string" },
    last_name: { type: "string" },
    avatar: { type: "string", format: "uri" },
  },
  additionalProperties: false,
} as const;

export const userListResponseSchema = {
  type: "object",
  required: ["page", "per_page", "total", "total_pages", "data", "support"],
  properties: {
    page: { type: "integer" },
    per_page: { type: "integer" },
    total: { type: "integer" },
    total_pages: { type: "integer" },
    data: {
      type: "array",
      items: userSchema,
    },
    support: {
      type: "object",
      required: ["url", "text"],
      properties: {
        url: { type: "string", format: "uri" },
        text: { type: "string" },
      },
    },
  },
} as const;

export const userResponseSchema = {
  type: "object",
  required: ["data", "support"],
  properties: {
    data: userSchema,
    support: {
      type: "object",
      required: ["url", "text"],
      properties: {
        url: { type: "string", format: "uri" },
        text: { type: "string" },
      },
    },
  },
} as const;

export const userMutationResponseSchema = {
  type: "object",
  required: ["name", "job", "id", "createdAt"],
  properties: {
    name: { type: "string" },
    job: { type: "string" },
    id: { type: "string" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
} as const;
