import { APIRequestContext, expect } from "@playwright/test";
import { ApiClient } from "./api-client";
import {
  CreateUserRequest,
  UnknownListResponse,
  UnknownResourceResponse,
  UpdateUserRequest,
  UserListResponse,
  UserMutationResponse,
  UserResponse,
} from "../models/user";

export class UsersClient extends ApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async listUsers(params?: { page?: number; per_page?: number }): Promise<UserListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.per_page) query.set("per_page", String(params.per_page));

    const suffix = query.toString() ? `?${query.toString()}` : "";
    const response = await this.get(`/api/users${suffix}`);
    await expect(response).toBeOK();
    return (await response.json()) as UserListResponse;
  }

  async listUsersRaw(params?: {
    page?: number;
    per_page?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.per_page) query.set("per_page", String(params.per_page));

    const suffix = query.toString() ? `?${query.toString()}` : "";
    return this.get(`/api/users${suffix}`);
  }

  async getUser(id: number): Promise<UserResponse> {
    const response = await this.get(`/api/users/${id}`);
    return (await response.json()) as UserResponse;
  }

  async getUserRaw(id: number) {
    return this.get(`/api/users/${id}`);
  }

  async createUser(body: CreateUserRequest): Promise<UserMutationResponse> {
    const response = await this.post("/api/users", body);
    return (await response.json()) as UserMutationResponse;
  }

  async createUserRaw(body: CreateUserRequest) {
    return this.post("/api/users", body);
  }

  async updateUser(id: number, body: UpdateUserRequest): Promise<UserMutationResponse> {
    const response = await this.put(`/api/users/${id}`, body);
    return (await response.json()) as UserMutationResponse;
  }

  async updateUserRaw(id: number, body: UpdateUserRequest) {
    return this.put(`/api/users/${id}`, body);
  }

  async patchUser(id: number, body: Partial<UpdateUserRequest>): Promise<UserMutationResponse> {
    const response = await this.patch(`/api/users/${id}`, body);
    return (await response.json()) as UserMutationResponse;
  }

  async patchUserRaw(id: number, body: Partial<UpdateUserRequest>) {
    return this.patch(`/api/users/${id}`, body);
  }

  async deleteUser(id: number) {
    return this.delete(`/api/users/${id}`);
  }

  async listUnknownResources(params?: {
    page?: number;
    per_page?: number;
  }): Promise<UnknownListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.per_page) query.set("per_page", String(params.per_page));

    const suffix = query.toString() ? `?${query.toString()}` : "";
    const response = await this.get(`/api/unknown${suffix}`);
    return (await response.json()) as UnknownListResponse;
  }

  async listUnknownResourcesRaw(params?: { page?: number; per_page?: number }) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.per_page) query.set("per_page", String(params.per_page));

    const suffix = query.toString() ? `?${query.toString()}` : "";
    return this.get(`/api/unknown${suffix}`);
  }

  async getUnknownResource(id: number): Promise<UnknownResourceResponse> {
    const response = await this.get(`/api/unknown/${id}`);
    return (await response.json()) as UnknownResourceResponse;
  }

  async getUnknownResourceRaw(id: number) {
    return this.get(`/api/unknown/${id}`);
  }
}
