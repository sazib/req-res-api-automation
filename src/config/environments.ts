export interface EnvironmentConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
  maxRetries: number;
}

const MOCK_BASE_URL = "http://127.0.0.1:3001";

function baseFor(realBase: string) {
  return process.env.USE_MOCK === "true" ? MOCK_BASE_URL : realBase;
}

const environments: Record<string, EnvironmentConfig> = {
  dev: {
    baseUrl: baseFor("https://reqres.in"),
    apiKey: process.env.API_KEY || "",
    timeout: Number(process.env.REQUEST_TIMEOUT) || 30_000,
    maxRetries: Number(process.env.MAX_RETRIES) || 3,
  },
  staging: {
    baseUrl: baseFor("https://reqres.in"),
    apiKey: process.env.API_KEY || "",
    timeout: Number(process.env.REQUEST_TIMEOUT) || 30_000,
    maxRetries: Number(process.env.MAX_RETRIES) || 3,
  },
  production: {
    baseUrl: baseFor("https://reqres.in"),
    apiKey: process.env.API_KEY || "",
    timeout: Number(process.env.REQUEST_TIMEOUT) || 30_000,
    maxRetries: Number(process.env.MAX_RETRIES) || 3,
  },
};

export function getEnvironment(): EnvironmentConfig {
  const env = process.env.TEST_ENV || "dev";
  return environments[env] || environments.dev;
}
