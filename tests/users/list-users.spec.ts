import { expect } from "../../fixtures";
import { test } from "../../fixtures";
import { isValidEmail, isValidUrl } from "../../src/utils/helpers";

test.describe("GET /api/users - List users", () => {
  test("should return 200 with a list of users", async ({ usersClient }) => {
    const response = await usersClient.listUsers();

    expect(response.page).toBe(1);
    expect(response.per_page).toBeGreaterThan(0);
    expect(response.total).toBeGreaterThan(0);
    expect(response.total_pages).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.support.url).toBeTruthy();
    expect(response.support.text).toBeTruthy();
  });

  test("should return users with valid data shape", async ({ usersClient }) => {
    const response = await usersClient.listUsers();

    for (const user of response.data) {
      expect(typeof user.id).toBe("number");
      expect(isValidEmail(user.email)).toBe(true);
      expect(user.first_name.length).toBeGreaterThan(0);
      expect(user.last_name.length).toBeGreaterThan(0);
      expect(isValidUrl(user.avatar)).toBe(true);
    }
  });

  test("should paginate users with page parameter", async ({ usersClient }) => {
    const page2 = await usersClient.listUsers({ page: 2 });
    const page1 = await usersClient.listUsers({ page: 1 });

    expect(page2.page).toBe(2);
    const page1Ids = page1.data.map((u) => u.id);
    const page2Ids = page2.data.map((u) => u.id);
    expect(page1Ids.some((id) => page2Ids.includes(id))).toBe(false);
  });

  test("should support per_page parameter", async ({ usersClient }) => {
    const response = await usersClient.listUsers({ per_page: 3 });

    expect(response.per_page).toBe(3);
    expect(response.data.length).toBeLessThanOrEqual(3);
  });

  test("should return 200 for a non-existent page (empty data)", async ({ usersClient }) => {
    const response = await usersClient.listUsers({ page: 9999 });

    expect(response.page).toBe(9999);
    expect(response.data).toEqual([]);
  });
});
