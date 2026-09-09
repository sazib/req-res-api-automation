import { expect } from "../../fixtures";
import { test } from "../../fixtures";
import { isValidULID } from "../../src/utils/helpers";

test.describe("GET /agent/v1/users - Agent users", () => {
  test("should return 200 with a list of agent users", async ({ agentUsersClient }) => {
    const response = await agentUsersClient.listUsers();

    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.meta).toBeDefined();
    expect(typeof response.meta.has_more).toBe("boolean");
  });

  test("should return users with valid shape", async ({ agentUsersClient }) => {
    const response = await agentUsersClient.listUsers();
    const user = response.data[0];

    expect(isValidULID(user.id)).toBe(true);
    expect(user.email).toContain("@");
    expect(user.full_name.length).toBeGreaterThan(0);
    expect(["active", "suspended"]).toContain(user.status);
    expect(user.profile).toBeDefined();
  });

  test("should support sparse fields via fields parameter", async ({ agentUsersClient }) => {
    const response = await agentUsersClient.listUsers({ fields: "id,email" });

    for (const user of response.data) {
      expect(user.id).toBeTruthy();
      expect(user.email).toBeTruthy();
    }
  });

  test("should be deterministic for the same seed", async ({ agentUsersClient }) => {
    const a = await agentUsersClient.listUsers({ seed: 42, limit: 5 });
    const b = await agentUsersClient.listUsers({ seed: 42, limit: 5 });

    expect(a.data.map((u) => u.id)).toEqual(b.data.map((u) => u.id));
  });

  test("should support cursor pagination", async ({ agentUsersClient }) => {
    const first = await agentUsersClient.listUsers({ limit: 3 });

    if (first.meta.next_cursor) {
      const second = await agentUsersClient.listUsers({
        limit: 3,
        cursor: first.meta.next_cursor,
      });

      const firstIds = first.data.map((u) => u.id);
      const secondIds = second.data.map((u) => u.id);
      expect(firstIds.some((id) => secondIds.includes(id))).toBe(false);
    }
  });

  test("should clamp invalid limit values", async ({ agentUsersClient }) => {
    const response = await agentUsersClient.listUsers({ limit: 9999 });

    expect(response.data.length).toBeLessThanOrEqual(100);
  });
});

test.describe("GET /agent/v1/users/{id} - Single agent user", () => {
  test("should return a single agent user", async ({ agentUsersClient }) => {
    const list = await agentUsersClient.listUsers({ limit: 1 });
    const id = list.data[0].id;

    const detail = await agentUsersClient.getUser(id);

    expect(detail.data.id).toBe(id);
    expect(detail.data.email).toContain("@");
  });

  test("should return 400 for malformed id", async ({ agentUsersClient }) => {
    const response = await agentUsersClient.getUserRaw("not-a-valid-id");

    expect(response.status()).toBe(400);
  });

  test("should return fixture data for any well-formed ulid (deterministic)", async ({ agentUsersClient }) => {
    const response = await agentUsersClient.getUserRaw(
      "usr_12345678901234567890123456",
    );

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(isValidULID(body.data.id)).toBe(true);
  });
});
