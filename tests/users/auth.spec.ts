import { expect } from "../../fixtures";
import { test } from "../../fixtures";

test.describe("POST /api/login - Authentication", () => {
  test("should login successfully and return a token", async ({ authClient }) => {
    const response = await authClient.loginRaw("eve.holt@reqres.in", "cityslicka");

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.token).toBe("string");
    expect(body.token.length).toBeGreaterThan(0);
  });

  test("should return 400 when password is missing", async ({ authClient }) => {
    const response = await authClient.loginRaw("eve.holt@reqres.in", "");

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });

  test("should return 400 when email is missing", async ({ authClient }) => {
    const response = await authClient.loginRaw("", "cityslicka");

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });

  test("should return 400 when request body is empty", async ({ authClient }) => {
    const response = await authClient.loginRaw("", "");

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });
});

test.describe("POST /api/register - Registration", () => {
  test("should register successfully and return id and token", async ({ authClient }) => {
    const response = await authClient.registerRaw(
      "eve.holt@reqres.in",
      "pistol",
    );

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.id).toBe("number");
    expect(typeof body.token).toBe("string");
  });

  test("should return 400 when password is missing", async ({ authClient }) => {
    const response = await authClient.registerRaw("eve.holt@reqres.in", "");

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });

  test("should return 400 when email is missing", async ({ authClient }) => {
    const response = await authClient.registerRaw("", "pistol");

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });

  test("should return 400 when both fields are missing", async ({ authClient }) => {
    const response = await authClient.registerRaw("", "");

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });
});
