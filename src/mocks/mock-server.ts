import http from "http";
import { URL } from "url";

const USERS_FIXTURES = [
  { id: 1, email: "george.bluth@reqres.in", first_name: "George", last_name: "Bluth", avatar: "https://reqres.in/img/faces/1-image.jpg" },
  { id: 2, email: "janet.weaver@reqres.in", first_name: "Janet", last_name: "Weaver", avatar: "https://reqres.in/img/faces/2-image.jpg" },
  { id: 3, email: "emma.wong@reqres.in", first_name: "Emma", last_name: "Wong", avatar: "https://reqres.in/img/faces/3-image.jpg" },
  { id: 4, email: "eve.holt@reqres.in", first_name: "Eve", last_name: "Holt", avatar: "https://reqres.in/img/faces/4-image.jpg" },
  { id: 5, email: "charles.morris@reqres.in", first_name: "Charles", last_name: "Morris", avatar: "https://reqres.in/img/faces/5-image.jpg" },
  { id: 6, email: "tracey.ramos@reqres.in", first_name: "Tracey", last_name: "Ramos", avatar: "https://reqres.in/img/faces/6-image.jpg" },
];

const UNKNOWN_FIXTURES = [
  { id: 1, name: "cerulean", year: 2000, color: "#98B2D1", pantone_value: "15-4020" },
  { id: 2, name: "fuchsia rose", year: 2001, color: "#C74375", pantone_value: "17-2031" },
];

const SUPPORT = { url: "https://reqres.in/#support-heading", text: "Tester" };

function support() {
  return SUPPORT;
}

function paginate<T>(items: T[], page: number, perPage: number) {
  const start = (page - 1) * perPage;
  const data = items.slice(start, start + perPage);
  return {
    page,
    per_page: perPage,
    total: items.length,
    total_pages: Math.ceil(items.length / perPage),
    data,
    support: support(),
  };
}

function agentUsers() {
  const make = (id: number) => ({
    id: `usr_${id.toString().padStart(26, "Q")}`,
    email: `user${id}@mock.reqres`,
    full_name: `Mock User ${id}`,
    locale: "en_US",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    timezone: "UTC",
    profile: { avatar_url: "", bio: "", company: "Mock Co", social: {} },
    preferences: {},
    status: "active",
  });
  return Array.from({ length: 20 }, (_, i) => make(i + 1));
}

function agentOrders(seed: number) {
  const make = (id: number) => ({
    id: `ord_${id.toString().padStart(24, "R")}`,
    reference: `NW-2026-${10000 + id}`,
    status: ["pending", "paid", "shipped", "delivered", "refunded", "cancelled"][id % 6],
    created_at: "2026-04-07T10:23:41.000Z",
    shipped_at: id % 2 === 0 ? "2026-04-08T10:23:41.000Z" : null,
    delivered_at: id % 2 === 0 ? "2026-04-10T10:23:41.000Z" : null,
    customer: {
      id: `usr_${(id + 90).toString().padStart(26, "Q")}`,
      email: `customer${id}@mock.reqres`,
      full_name: `Customer ${id}`,
    },
    line_items: [
      {
        id: `li_${id.toString().padStart(24, "L")}`,
        product: {
          id: `prd_${id.toString().padStart(24, "P")}`,
          sku: `SKU-${id}`,
          name: `Product ${id}`,
          price: { amount: (100 * id) / 2 + seed, currency: "USD", formatted: `$${((100 * id) / 2 + seed) / 100}` },
          deleted_at: null,
        },
        quantity: 1,
        unit_price: { amount: (100 * id) / 2 + seed, currency: "USD", formatted: `$${((100 * id) / 2 + seed) / 100}` },
        subtotal: { amount: (100 * id) / 2 + seed, currency: "USD", formatted: `$${((100 * id) / 2 + seed) / 100}` },
      },
    ],
    totals: {
      subtotal: { amount: (100 * id) / 2 + seed, currency: "USD", formatted: `$${((100 * id) / 2 + seed) / 100}` },
      shipping: { amount: 500, currency: "USD", formatted: "$5.00" },
      tax: { amount: 100, currency: "USD", formatted: "$1.00" },
      total: { amount: (100 * id) / 2 + seed + 600, currency: "USD", formatted: `$${((100 * id) / 2 + seed + 600) / 100}` },
    },
    payment_method: null,
    shipping_address: null,
    metadata: {},
  });
  return Array.from({ length: 40 }, (_, i) => make(i + 1));
}

function cursorMeta(page: number, perPage: number, total: number) {
  const returned = Math.min(perPage, total - (page - 1) * perPage);
  const hasMore = (page - 1) * perPage + returned < total;
  return {
    limit: perPage,
    returned,
    next_cursor: hasMore ? `cursor_${page + 1}` : null,
    prev_cursor: page > 1 ? `cursor_${page - 1}` : null,
    has_more: hasMore,
    total_estimate: total,
  };
}

let nextUserId = 7;

const SCENARIOS = [
  { name: "rate-limited", url: "/agent/v1/scenarios/rate-limited", status_code: 429, description: "Rate limit", requires_paid_tier: false },
  { name: "server-error", url: "/agent/v1/scenarios/server-error", status_code: 500, description: "Generic 5xx", requires_paid_tier: true },
  { name: "validation-error", url: "/agent/v1/scenarios/validation-error", status_code: 422, description: "Validation", requires_paid_tier: false },
  { name: "unauthorized", url: "/agent/v1/scenarios/unauthorized", status_code: 401, description: "Unauthorized", requires_paid_tier: false },
];

function readBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function json(res: http.ServerResponse, status: number, payload: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

export function createMockApiServer(): http.Server {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url || "/", "http://localhost");
    const method = req.method || "GET";
    const pathname = url.pathname;
    const q = url.searchParams;

    // ---- Legacy users ----
    if (pathname === "/api/users" && method === "GET") {
      const page = Number(q.get("page") || 1);
      const perPage = Number(q.get("per_page") || 6);
      return json(res, 200, paginate(USERS_FIXTURES, page, perPage));
    }
    if (pathname === "/api/users" && method === "POST") {
      const body = await readBody(req);
      return json(res, 201, {
        ...body,
        id: String(nextUserId++),
        createdAt: new Date().toISOString(),
      });
    }
    const userMatch = pathname.match(/^\/api\/users\/(\d+)$/);
    if (userMatch) {
      const id = Number(userMatch[1]);
      const user = USERS_FIXTURES.find((u) => u.id === id);
      if (method === "GET") {
        if (!user) return json(res, 404, {});
        return json(res, 200, { data: user, support: support() });
      }
      if (method === "PUT" || method === "PATCH") {
        const body = await readBody(req);
        return json(res, 200, {
          ...body,
          updatedAt: new Date().toISOString(),
        });
      }
      if (method === "DELETE") {
        res.writeHead(204);
        return res.end();
      }
    }

    // ---- Legacy unknown ----
    if (pathname === "/api/unknown" && method === "GET") {
      const page = Number(q.get("page") || 1);
      const perPage = Number(q.get("per_page") || 6);
      return json(res, 200, paginate(UNKNOWN_FIXTURES, page, perPage));
    }
    const unknownMatch = pathname.match(/^\/api\/unknown\/(\d+)$/);
    if (unknownMatch && method === "GET") {
      const item = UNKNOWN_FIXTURES.find((u) => u.id === Number(unknownMatch[1]));
      if (!item) return json(res, 404, {});
      return json(res, 200, { data: item, support: support() });
    }

    // ---- Auth ----
    if (pathname === "/api/login" && method === "POST") {
      const body = await readBody(req);
      if (!body.email || !body.password) {
        return json(res, 400, { error: "Missing email or username" });
      }
      return json(res, 200, { token: "QpwL5tke4Pnpja7X4" });
    }
    if (pathname === "/api/register" && method === "POST") {
      const body = await readBody(req);
      if (!body.email || !body.password) {
        return json(res, 400, { error: "Missing email or username" });
      }
      return json(res, 200, { id: 4, token: "QpwL5tke4Pnpja7X4" });
    }

    // ---- Agent users ----
    if (pathname === "/agent/v1/users" && method === "GET") {
      const users = agentUsers();
      const limit = Math.min(Number(q.get("limit") || 20) || 20, 100);
      const cursor = q.get("cursor");
      const page = cursor ? Number(cursor.replace("cursor_", "")) : 1;
      const seed = Number(q.get("seed") || 42);
      const start = (page - 1) * limit;
      const data = users.slice(start, start + limit);
      const fields = q.get("fields");
      const mapped = fields
        ? data.map((u) => {
            const keep: Record<string, unknown> = {};
            fields.split(",").forEach((f) => {
              if (f in u) (keep as Record<string, unknown>)[f] = (u as Record<string, unknown>)[f];
            });
            return keep;
          })
        : data;
      return json(res, 200, {
        data: mapped,
        meta: cursorMeta(page, limit, users.length),
        seed,
      });
    }
    const agentUserMatch = pathname.match(/^\/agent\/v1\/users\/(.+)$/);
    if (agentUserMatch && method === "GET") {
      const id = agentUserMatch[1];
      if (!/^usr_[0-9A-Z]{26}$/.test(id)) {
        return json(res, 400, { error: "invalid_id_format", message: "Invalid ID format" });
      }
      return json(res, 200, {
        data: {
          id,
          email: "mock.user@mock.reqres",
          full_name: "Mock User",
          locale: "en_US",
          created_at: "2026-01-01T00:00:00.000Z",
          updated_at: "2026-01-01T00:00:00.000Z",
          timezone: "UTC",
          profile: {},
          preferences: {},
          status: "active",
        },
      });
    }

    // ---- Agent orders ----
    if (pathname === "/agent/v1/orders" && method === "GET") {
      const seed = Number(q.get("seed") || 42);
      if (q.get("status") && !["pending", "paid", "shipped", "delivered", "refunded", "cancelled"].includes(q.get("status")!)) {
        return json(res, 400, { error: "invalid_status", message: "Invalid status" });
      }
      const orders = agentOrders(seed).filter((o) => (q.get("status") ? o.status === q.get("status") : true));
      const limit = Math.min(Number(q.get("limit") || 20) || 20, 100);
      const cursor = q.get("cursor");
      const page = cursor ? Number(cursor.replace("cursor_", "")) : 1;
      const start = (page - 1) * limit;
      const data = orders.slice(start, start + limit);
      return json(res, 200, {
        data,
        meta: cursorMeta(page, limit, orders.length),
        seed,
      });
    }

    // ---- Agent scenarios / health ----
    if (pathname === "/agent/v1/scenarios" && method === "GET") {
      return json(res, 200, { data: SCENARIOS });
    }
    const scenarioMatch = pathname.match(/^\/agent\/v1\/scenarios\/(.+)$/);
    if (scenarioMatch && method === "GET") {
      const name = scenarioMatch[1];
      const scenario = SCENARIOS.find((s) => s.name === name);
      if (!scenario) return json(res, 404, { error: "unknown_scenario" });
      if (name === "rate-limited") {
        res.writeHead(429, { "Retry-After": "30" });
        return res.end(JSON.stringify({ error: "rate_limited" }));
      }
      if (name === "validation-error") return json(res, 422, { error: "validation_error" });
      if (name === "unauthorized") return json(res, 401, { error: "unauthorized" });
      if (scenario.requires_paid_tier) return json(res, 403, { error: "paid_tier_required" });
      return json(res, scenario.status_code, { error: name });
    }
    if (pathname === "/agent/v1/health" && method === "GET") {
      return json(res, 200, {
        data: {
          status: "healthy",
          version: "v1.1.0-mock",
          uptime_seconds: 1000,
          rate_limit_status: { tier: "mock", remaining_today: 1000, limit_today: 1000, reset_at: null },
          deprecations: [],
        },
      });
    }

    // ---- Payments sandbox ----
    if (pathname === "/sim/payments/v1/" && method === "GET") {
      return json(res, 200, {
        data: {
          name: "ReqRes Payments Sandbox (mock)",
          test_payment_methods: {
            pm_card_success: "succeeded",
            pm_card_insufficient_funds: "failed:insufficient_funds",
            pm_card_declined: "failed:card_declined",
          },
          lifecycle: "requires_payment_method -> requires_confirmation -> (requires_action) -> succeeded | failed",
          idempotency: "Send Idempotency-Key on POSTs. Same key + same body replays; same key + different body is a 409.",
          state_ttl_hours: 24,
        },
      });
    }
    if (pathname === "/sim/payments/v1/payment_intents" && method === "POST") {
      const body = await readBody(req);
      const amount = body.amount || 1000;
      const currency = body.currency || "usd";
      const pm = body.payment_method || null;
      let status = "requires_payment_method";
      if (pm) status = "requires_confirmation";
      return json(res, 201, {
        data: {
          id: `pi_${Math.random().toString(36).slice(2).toUpperCase()}`,
          object_type: "payment_intent",
          amount: { amount, currency, formatted: `$${(amount / 100).toFixed(2)}` },
          customer: null,
          payment_method: pm,
          status,
          last_payment_error: null,
          next_action: null,
          created_at: "2026-04-13T10:23:44.000Z",
        },
      });
    }

    return json(res, 404, { error: "not_found", message: "Not found" });
  });
}
