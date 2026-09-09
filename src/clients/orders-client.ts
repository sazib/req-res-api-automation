import { APIRequestContext, expect } from "@playwright/test";
import { ApiClient } from "./api-client";
import {
  AgentOrderListResponse,
  AgentUserDetailResponse,
  AgentUserListResponse,
  OrderStatus,
} from "../models/order";

export class OrdersClient extends ApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async listOrders(params?: {
    cursor?: string;
    limit?: number;
    status?: OrderStatus;
    seed?: number;
  }): Promise<AgentOrderListResponse> {
    const query = new URLSearchParams();
    if (params?.cursor) query.set("cursor", params.cursor);
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.status) query.set("status", params.status);
    if (params?.seed) query.set("seed", String(params.seed));

    const suffix = query.toString() ? `?${query.toString()}` : "";
    const response = await this.get(`/agent/v1/orders${suffix}`);
    await expect(response).toBeOK();
    return (await response.json()) as AgentOrderListResponse;
  }

  async listOrdersRaw(params?: {
    cursor?: string;
    limit?: number;
    status?: OrderStatus;
    seed?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.cursor) query.set("cursor", params.cursor);
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.status) query.set("status", params.status);
    if (params?.seed) query.set("seed", String(params.seed));

    const suffix = query.toString() ? `?${query.toString()}` : "";
    return this.get(`/agent/v1/orders${suffix}`);
  }
}

export class AgentUsersClient extends ApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async listUsers(params?: {
    cursor?: string;
    limit?: number;
    fields?: string;
    seed?: number;
  }): Promise<AgentUserListResponse> {
    const query = new URLSearchParams();
    if (params?.cursor) query.set("cursor", params.cursor);
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.fields) query.set("fields", params.fields);
    if (params?.seed) query.set("seed", String(params.seed));

    const suffix = query.toString() ? `?${query.toString()}` : "";
    const response = await this.get(`/agent/v1/users${suffix}`);
    await expect(response).toBeOK();
    return (await response.json()) as AgentUserListResponse;
  }

  async listUsersRaw(params?: {
    cursor?: string;
    limit?: number;
    fields?: string;
    seed?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.cursor) query.set("cursor", params.cursor);
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.fields) query.set("fields", params.fields);
    if (params?.seed) query.set("seed", String(params.seed));

    const suffix = query.toString() ? `?${query.toString()}` : "";
    return this.get(`/agent/v1/users${suffix}`);
  }

  async getUser(id: string, expand?: string): Promise<AgentUserDetailResponse> {
    const query = expand ? `?expand=${expand}` : "";
    const response = await this.get(`/agent/v1/users/${id}${query}`);
    await expect(response).toBeOK();
    return (await response.json()) as AgentUserDetailResponse;
  }

  async getUserRaw(id: string, expand?: string) {
    const query = expand ? `?expand=${expand}` : "";
    return this.get(`/agent/v1/users/${id}${query}`);
  }
}
