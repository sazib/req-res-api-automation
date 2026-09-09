import type { APIResponse } from "@playwright/test";

interface RetryOptions {
  maxRetries: number;
  delayMs: number;
  backoffMultiplier: number;
  retryableStatuses: number[];
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxRetries: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
  retryableStatuses: [429, 500, 502, 503, 504],
};

export async function withRetry(
  fn: () => Promise<APIResponse>,
  options: Partial<RetryOptions> = {},
): Promise<APIResponse> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      const response = await fn();

      if (
        opts.retryableStatuses.includes(response.status()) &&
        attempt < opts.maxRetries
      ) {
        const delay = opts.delayMs * Math.pow(opts.backoffMultiplier, attempt);
        const retryAfter = response.headers()["retry-after"];
        const waitTime = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : delay;

        await sleep(waitTime);
        continue;
      }

      return response;
    } catch (error) {
      lastError = error as Error;
      if (attempt < opts.maxRetries) {
        const delay = opts.delayMs * Math.pow(opts.backoffMultiplier, attempt);
        await sleep(delay);
      }
    }
  }

  throw lastError || new Error("Retry failed");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
