import { expect } from "../../fixtures";
import { test } from "../../fixtures";

test.describe("GET /agent/v1/orders - List orders", () => {
  test("should return 200 with a list of orders", async ({ ordersClient }) => {
    const response = await ordersClient.listOrders();

    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.meta).toBeDefined();
    expect(response.meta.limit).toBeGreaterThan(0);
    expect(typeof response.meta.has_more).toBe("boolean");
  });

  test("should return orders with valid shape", async ({ ordersClient }) => {
    const response = await ordersClient.listOrders();
    const order = response.data[0];

    expect(order.id).toMatch(/^ord_/);
    expect(order.reference).toBeTruthy();
    expect(order.customer.id).toMatch(/^usr_/);
    expect(order.customer.email).toContain("@");
    expect(order.customer.full_name).toBeTruthy();
    expect(order.line_items.length).toBeGreaterThan(0);
    expect(order.totals.total.amount).toBeGreaterThan(0);
    expect(order.totals.total.currency).toBeTruthy();
    expect(order.totals.total.formatted).toMatch(/\d/);

    const item = order.line_items[0];
    expect(item.product.id).toMatch(/^prd_/);
    expect(item.product.name).toBeTruthy();
    expect(item.quantity).toBeGreaterThan(0);
    expect(item.subtotal.amount).toBeGreaterThan(0);
  });

  test("should support limit parameter", async ({ ordersClient }) => {
    const response = await ordersClient.listOrders({ limit: 5 });

    expect(response.data.length).toBeLessThanOrEqual(5);
  });

  test("should filter by status", async ({ ordersClient }) => {
    const response = await ordersClient.listOrders({ status: "paid" });

    for (const order of response.data) {
      expect(order.status).toBe("paid");
    }
  });

  test("should support cursor pagination", async ({ ordersClient }) => {
    const first = await ordersClient.listOrders({ limit: 2 });

    if (first.meta.next_cursor) {
      const second = await ordersClient.listOrders({
        limit: 2,
        cursor: first.meta.next_cursor,
      });

      const firstIds = first.data.map((o) => o.id);
      const secondIds = second.data.map((o) => o.id);
      expect(firstIds.some((id) => secondIds.includes(id))).toBe(false);
    }
  });

  test("should return same data for same seed (deterministic)", async ({ ordersClient }) => {
    const a = await ordersClient.listOrders({ seed: 42, limit: 3 });
    const b = await ordersClient.listOrders({ seed: 42, limit: 3 });

    expect(a.data.map((o) => o.id)).toEqual(b.data.map((o) => o.id));
  });

  test("should return 400 for invalid status filter", async ({ ordersClient }) => {
    const response = await ordersClient.listOrdersRaw({
      status: "invalid-status" as never,
    });

    expect(response.status()).toBe(400);
  });
});
