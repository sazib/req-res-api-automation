import { APIRequestContext, APIResponse } from "@playwright/test";
import { getEnvironment } from "../config/environments";
import { withRetry } from "../utils/retry";

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  data?: unknown;
  timeout?: number;
}

export class ApiClient {
  protected readonly baseUrl: string;
  protected readonly apiKey: string;
  protected readonly timeout: number;
  protected readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    const env = getEnvironment();
    this.request = request;
    this.baseUrl = env.baseUrl;
    this.apiKey = env.apiKey;
    this.timeout = env.timeout;
  }

  protected get(path: string, options: RequestOptions = {}) {
    return this.send(path, { ...options, method: "GET" });
  }

  protected post(path: string, body?: unknown, options: RequestOptions = {}) {
    return this.send(path, { ...options, method: "POST", data: body });
  }

  protected put(path: string, body?: unknown, options: RequestOptions = {}) {
    return this.send(path, { ...options, method: "PUT", data: body });
  }

  protected patch(path: string, body?: unknown, options: RequestOptions = {}) {
    return this.send(path, { ...options, method: "PATCH", data: body });
  }

  protected delete(path: string, options: RequestOptions = {}) {
    return this.send(path, { ...options, method: "DELETE" });
  }

  private send(path: string, options: RequestOptions): Promise<APIResponse> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(this.apiKey ? { "x-api-key": this.apiKey } : {}),
      ...options.headers,
    };

    return withRetry(() =>
      this.request.fetch(`${this.baseUrl}${path}`, {
        method: options.method,
        headers,
        timeout: options.timeout ?? this.timeout,
        ...(options.data !== undefined ? { data: options.data } : {}),
      }),
    );
  }
}
