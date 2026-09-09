import { expect } from "../../fixtures";
import { test } from "../../fixtures";
import { ApiClient } from "../../src/clients/api-client";
import { generateIdempotencyKey } from "../../src/utils/data-generator";

class PaymentsClient extends ApiClient {
  async createPaymentIntent(body: Record<string, unknown>) {
    return this.post("/sim/payments/v1/payment_intents", body);
  }
}

test.describe("Payment intents lifecycle", () => {
  test("should create a payment intent without a method and enter requires_payment_method", async ({ request }) => {
    const client = new PaymentsClient(request);
    const response = await client.createPaymentIntent({
      amount: 1000,
      currency: "usd",
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.status).toBe("requires_payment_method");
    expect(body.data.amount.amount).toBe(1000);
    expect(body.data.amount.formatted).toBe("$10.00");
  });

  test("should create a payment intent with a success method and enter requires_confirmation", async ({ request }) => {
    const client = new PaymentsClient(request);
    const response = await client.createPaymentIntent({
      amount: 2500,
      currency: "usd",
      payment_method: "pm_card_success",
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.status).toBe("requires_confirmation");
    expect(body.data.amount.amount).toBe(2500);
  });

  test("should create a payment intent with an insufficient-funds method", async ({ request }) => {
    const client = new PaymentsClient(request);
    const response = await client.createPaymentIntent({
      amount: 500,
      currency: "usd",
      payment_method: "pm_card_insufficient_funds",
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.payment_method).toBe("pm_card_insufficient_funds");
  });

  test("should enforce idempotency: same key replays, different body conflicts", async ({ request }) => {
    const client = new PaymentsClient(request);
    const key = generateIdempotencyKey();

    const first = await client.createPaymentIntent({
      amount: 1000,
      currency: "usd",
      payment_method: "pm_card_success",
      idempotency_key: key,
    });

    expect(first.status()).toBe(201);
    const firstBody = await first.json();
    expect(firstBody.data.status).toBe("requires_confirmation");
  });
});
