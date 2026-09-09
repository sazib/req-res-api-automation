import { expect } from "../../fixtures";
import { test } from "../../fixtures";
import { ApiClient } from "../../src/clients/api-client";

class PaymentsClient extends ApiClient {
  async discover(): Promise<Record<string, unknown>> {
    const response = await this.get("/sim/payments/v1/");
    await expect(response).toBeOK();
    return (await response.json()) as Record<string, unknown>;
  }
}

test.describe("GET /sim/payments/v1/ - Payments sandbox", () => {
  test("should return the sandbox catalog", async ({ request }) => {
    const client = new PaymentsClient(request);
    const catalog = await client.discover();

    expect(catalog).toBeDefined();
  });

  test("docs the payment lifecycle in the catalog", async ({ request }) => {
    const client = new PaymentsClient(request);
    const catalog = await client.discover();

    const serialized = JSON.stringify(catalog).toLowerCase();
    expect(serialized).toContain("requires_payment_method");
    expect(serialized).toContain("succeeded");
    expect(serialized).toContain("idempotency");
  });
});
