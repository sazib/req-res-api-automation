import { expect } from "../../fixtures";
import { test } from "../../fixtures";
import { isValidTimestamp } from "../../src/utils/helpers";

test.describe("POST /api/users - Create user", () => {
  test("should create a user and return 201", async ({ usersClient }) => {
    const requestBody = { name: "morpheus", job: "leader" };
    const response = await usersClient.createUserRaw(requestBody);

    expect(response.status()).toBe(201);
    const body = await response.json();

    expect(body.name).toBe("morpheus");
    expect(body.job).toBe("leader");
    expect(typeof body.id).toBe("string");
    expect(isValidTimestamp(body.createdAt)).toBe(true);
  });

  test("should generate unique id for each created user", async ({ usersClient }) => {
    const a = await usersClient.createUser({ name: "a", job: "x" });
    const b = await usersClient.createUser({ name: "b", job: "y" });

    expect(a.id).not.toBe(b.id);
    expect(a.createdAt).not.toBe(b.createdAt);
  });

  test("should create user without optional createdAt field error", async ({ usersClient }) => {
    const body = { name: "neo", job: "night_shift" };
    const response = await usersClient.createUserRaw(body);

    expect(response.status()).toBe(201);
    const result = await response.json();
    expect(result.name).toBe("neo");
    expect(result.job).toBe("night_shift");
  });

  test("should accept and echo any additional fields", async ({ usersClient }) => {
    const requestBody = {
      name: "trinity",
      job: "architect",
      height: 175,
      active: true,
    };
    const response = await usersClient.createUserRaw(requestBody);

    expect(response.status()).toBe(201);
  });
});
