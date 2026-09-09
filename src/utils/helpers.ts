import type { APIResponse } from "@playwright/test";

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidAvatarUrl(url: string): boolean {
  return isValidUrl(url) && /\.(png|jpg|jpeg|gif)$/i.test(url);
}

export function isValidTimestamp(ts: string): boolean {
  return !isNaN(Date.parse(ts));
}

export function isValidULID(id: string): boolean {
  return /^usr_[0-9A-HJKMNP-TV-Z]{26}$/.test(id);
}

export async function parseResponse<T>(response: APIResponse): Promise<T> {
  return (await response.json()) as T;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
