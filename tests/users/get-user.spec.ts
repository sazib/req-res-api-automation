import { expect } from "../../fixtures";
import { test } from "../../fixtures";
import { isValidEmail, isValidUrl } from "../../src/utils/helpers";

test.describe("GET /api/users/{id} - Single user", () => {
  test("should return 200 with the requested user", async ({ usersClient }) => {
    const list = await usersClient.listUsers();
    const userId = list.data[0].id;

    const response = await usersClient.getUser(userId);

    expect(response.data.id).toBe(userId);
    expect(isValidEmail(response.data.email)).toBe(true);
    expect(response.data.first_name.length).toBeGreaterThan(0);
    expect(response.data.last_name.length).toBeGreaterThan(0);
    expect(isValidUrl(response.data.avatar)).toBe(true);
    expect(response.support.url).toBeTruthy();
  });

  test("should return a user matching the list data", async ({ usersClient }) => {
    const list = await usersClient.listUsers();
    const listUser = list.data[0];

    const response = await usersClient.getUser(listUser.id);

    expect(response.data.id).toBe(listUser.id);
    expect(response.data.first_name).toBe(listUser.first_name);
    expect(response.data.last_name).toBe(listUser.last_name);
    expect(response.data.email).toBe(listUser.email);
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
