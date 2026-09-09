import { APIRequestContext } from "@playwright/test";
import { ApiClient } from "./api-client";

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  token: string;
}

export interface LoginResponse {
  token: string;
}

export class AuthClient extends ApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async register(email: string, password: string): Promise<RegisterResponse> {
    const response = await this.post("/api/register", { email, password });
    return (await response.json()) as RegisterResponse;
  }

  async registerRaw(email: string, password: string) {
    return this.post("/api/register", { email, password });
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.post("/api/login", { email, password });
    return (await response.json()) as LoginResponse;
  }

  async loginRaw(email: string, password: string) {
    return this.post("/api/login", { email, password });
  }

  async logout() {
    return this.post("/api/logout");
  }
}
