export const agentUserSchema = {
  type: "object",
  required: [
    "id", "email", "full_name", "locale", "created_at",
    "updated_at", "timezone", "profile", "preferences", "status",
  ],
  properties: {
    id: { type: "string", pattern: "^usr_[0-9A-HJKMNP-TV-Z]{26}$" },
    email: { type: "string", format: "email" },
    full_name: { type: "string" },
    locale: { type: "string" },
    created_at: { type: "string" },
    updated_at: { type: "string" },
    timezone: { type: "string" },
    profile: { type: "object" },
    preferences: { type: "object" },
    status: { type: "string", enum: ["active", "suspended"] },
  },
} as const;

export const agentOrderSchema = {
  type: "object",
  required: [
    "id", "customer", "status", "line_items", "total", "created_at", "updated_at",
  ],
  properties: {
    id: { type: "string" },
    status: {
      type: "string",
      enum: ["pending", "paid", "shipped", "delivered", "refunded", "cancelled"],
    },
    customer: { type: "object" },
    line_items: {
      type: "array",
      items: { type: "object" },
    },
    total: {
      type: "object",
      required: ["amount", "currency", "formatted"],
      properties: {
        amount: { type: "integer" },
        currency: { type: "string" },
        formatted: { type: "string" },
      },
    },
  },
} as const;

export const paginationMetaSchema = {
  type: "object",
  required: ["limit", "returned", "has_more", "total_estimate"],
  properties: {
    limit: { type: "integer" },
    returned: { type: "integer" },
    next_cursor: { type: ["string", "null"] },
    prev_cursor: { type: ["string", "null"] },
    has_more: { type: "boolean" },
    total_estimate: { type: "integer" },
  },
} as const;
