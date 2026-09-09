import { expect } from "../../fixtures";
import { test } from "../../fixtures";
import { isValidTimestamp } from "../../src/utils/helpers";

test.describe("PUT /api/users/{id} - Update user", () => {
  test("should update a user and return 200", async ({ usersClient }) => {
    const body = { name: "morpheus", job: "zion resident" };
    const response = await usersClient.updateUserRaw(2, body);

    expect(response.status()).toBe(200);
    const result = await response.json();

    expect(result.name).toBe("morpheus");
    expect(result.job).toBe("zion resident");
    expect(typeof result.updatedAt).toBe("string");
    expect(isValidTimestamp(result.updatedAt)).toBe(true);
  });

  test("should return a new updatedAt on subsequent updates", async ({ usersClient }) => {
    const first = await usersClient.updateUser(2, { name: "morpheus", job: "a" });
    const second = await usersClient.updateUser(2, { name: "morpheus", job: "b" });

    expect(first.updatedAt).toBeDefined();
    expect(second.updatedAt).toBeDefined();
    expect(new Date(second.updatedAt!).getTime()).toBeGreaterThanOrEqual(
      new Date(first.updatedAt!).getTime(),
    );
  });

  test("should return id as string when id is provided in path", async ({ usersClient }) => {
    const body = { name: "morpheus", job: "choosen one" };
    const response = await usersClient.updateUserRaw(7, body);

    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result.name).toBe("morpheus");
  });
});

test.describe("PATCH /api/users/{id} - Partial update", () => {
  test("should partially update a user and return 200", async ({ usersClient }) => {
    const response = await usersClient.patchUserRaw(2, { job: "zion resident" });

    expect(response.status()).toBe(200);
    const result = await response.json();

    expect(result.job).toBe("zion resident");
    expect(isValidTimestamp(result.updatedAt)).toBe(true);
  });

  test("should update only provided field, keeping others", async ({ usersClient }) => {
    const response = await usersClient.patchUserRaw(2, { name: "Morpheus" });

    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result.name).toBe("Morpheus");
  });
});
