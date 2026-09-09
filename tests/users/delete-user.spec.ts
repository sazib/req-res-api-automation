import { expect } from "../../fixtures";
import { test } from "../../fixtures";
import { isValidUrl } from "../../src/utils/helpers";

test.describe("DELETE /api/users/{id} - Delete user", () => {
  test("should delete a user and return 204", async ({ usersClient }) => {
    const response = await usersClient.deleteUser(2);

    expect(response.status()).toBe(204);
    expect(await response.text()).toBe("");
  });

  test("should delete any valid user id", async ({ usersClient }) => {
    const response = await usersClient.deleteUser(7);

    expect(response.status()).toBe(204);
  });

  test("should return 204 for non-existing user too", async ({ usersClient }) => {
    const response = await usersClient.deleteUser(9999);

    expect(response.status()).toBe(204);
  });
});

test.describe("GET /api/unknown - List resources", () => {
  test("should return 200 with resources", async ({ usersClient }) => {
    const response = await usersClient.listUnknownResources();

    expect(response.page).toBe(1);
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.total).toBeGreaterThan(0);
    expect(response.support.url).toBeTruthy();
  });

  test("should return resources with valid shape", async ({ usersClient }) => {
    const response = await usersClient.listUnknownResources();

    for (const resource of response.data) {
      expect(typeof resource.id).toBe("number");
      expect(resource.name.length).toBeGreaterThan(0);
      expect(typeof resource.year).toBe("number");
      expect(resource.color).toMatch(/^#/);
      expect(resource.pantone_value).toBeTruthy();
    }
  });

  test("should paginate resources", async ({ usersClient }) => {
    const page2 = await usersClient.listUnknownResources({ page: 2 });

    expect(page2.page).toBe(2);
  });
});

test.describe("GET /api/unknown/{id} - Single resource", () => {
  test("should return a resource by id", async ({ usersClient }) => {
    const response = await usersClient.getUnknownResource(1);

    expect(response.data.id).toBe(1);
    expect(response.data.name.length).toBeGreaterThan(0);
    expect(isValidUrl(response.support.url)).toBe(true);
  });

  test("should return 404 for non-existent resource", async ({ usersClient }) => {
    const response = await usersClient.getUnknownResourceRaw(9999);

    expect(response.status()).toBe(404);
  });
});
