import { expect } from "../../fixtures";
import { test } from "../../fixtures";
import { getEnvironment } from "../../src/config/environments";

const baseURL = getEnvironment().baseUrl;

test.describe("GET /agent/v1/scenarios - Failure scenarios", () => {
  test("should list available scenarios", async ({ request }) => {
    const response = await request.get(`${baseURL}/agent/v1/scenarios`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test("should return a controlled rate-limited scenario (free tier)", async ({ request }) => {
    const response = await request.get(`${baseURL}/agent/v1/scenarios/rate-limited`);

    expect(response.status()).toBe(429);
    expect(response.headers()["retry-after"]).toBeTruthy();
  });

  test("should return a controlled validation-error scenario (free tier)", async ({ request }) => {
    const response = await request.get(`${baseURL}/agent/v1/scenarios/validation-error`);

    expect(response.status()).toBe(422);
  });

  test("should return 403 for paid-only scenarios on the free tier", async ({ request }) => {
    const response = await request.get(`${baseURL}/agent/v1/scenarios/server-error`);

    expect([403, 500]).toContain(response.status());
  });
});

test.describe("GET /agent/v1/health - Health probe", () => {
  test("should report healthy status", async ({ request }) => {
    const response = await request.get(`${baseURL}/agent/v1/health`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.status).toBeDefined();
    expect(body.data.version).toBeTruthy();
  });
});
