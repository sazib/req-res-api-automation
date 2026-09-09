import { expect } from "../../fixtures";
import { test } from "../../fixtures";
import { isValidEmail, isValidUrl } from "../../src/utils/helpers";

test.describe("GET /api/users/{id} - Single user", () => {
  test("should return 200 with the requested user", async ({ usersClient }) => {
    const response = await usersClient.getUser(2);

    expect(response.data.id).toBe(2);
    expect(isValidEmail(response.data.email)).toBe(true);
    expect(response.data.first_name.length).toBeGreaterThan(0);
    expect(response.data.last_name.length).toBeGreaterThan(0);
    expect(isValidUrl(response.data.avatar)).toBe(true);
    expect(response.support.url).toBeTruthy();
  });

  test("should return the known Janet Weaver user for id 1", async ({ usersClient }) => {
    const response = await usersClient.getUser(1);

    expect(response.data.id).toBe(1);
    expect(response.data.first_name).toBe("Janet");
    expect(response.data.last_name).toBe("Weaver");
    expect(response.data.email.toLowerCase()).toContain("janet");
  });

  test("should return 404 for a non-existent user", async ({ usersClient }) => {
    const response = await usersClient.getUserRaw(9999);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toEqual({});
  });

  test("should return 404 for negative id", async ({ usersClient }) => {
    const response = await usersClient.getUserRaw(-1);

    expect(response.status()).toBe(404);
  });

  test("should return 404 for id 0", async ({ usersClient }) => {
    const response = await usersClient.getUserRaw(0);

    expect(response.status()).toBe(404);
  });
});
