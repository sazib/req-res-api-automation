import { test as base, expect } from "@playwright/test";
import { UsersClient } from "../clients/users-client";
import { OrdersClient, AgentUsersClient } from "../clients/orders-client";
import { AuthClient } from "../clients/auth-client";

export interface ApiTestFixtures {
  usersClient: UsersClient;
  ordersClient: OrdersClient;
  agentUsersClient: AgentUsersClient;
  authClient: AuthClient;
}

export const test = base.extend<ApiTestFixtures>({
  usersClient: async ({ request }, use) => {
    await use(new UsersClient(request));
  },
  ordersClient: async ({ request }, use) => {
    await use(new OrdersClient(request));
  },
  agentUsersClient: async ({ request }, use) => {
    await use(new AgentUsersClient(request));
  },
  authClient: async ({ request }, use) => {
    await use(new AuthClient(request));
  },
});

export { expect };
