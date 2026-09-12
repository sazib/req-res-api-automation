export interface EnvironmentConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
  maxRetries: number;
}

const REAL_BASE_URL = "https://reqres.in";

function mockBaseUrl() {
  return process.env.MOCK_BASE_URL || "http://127.0.0.1:3001";
}

function baseFor(realBase: string) {
  return process.env.USE_MOCK === "true" ? mockBaseUrl() : realBase;
}

/**
 * Resolves the effective environment configuration from process.env at call
 * time so vars like USE_MOCK / MOCK_BASE_URL are picked up regardless of
 * import order (e.g. inside Docker or GitHub Actions where they are injected).
 */
export function getEnvironment(): EnvironmentConfig {
  return {
    baseUrl: baseFor(REAL_BASE_URL),
    apiKey: process.env.API_KEY || "",
    timeout: Number(process.env.REQUEST_TIMEOUT) || 30_000,
    maxRetries: Number(process.env.MAX_RETRIES) || 3,
  };
}