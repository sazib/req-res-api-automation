import { APIRequestContext } from "@playwright/test";
import { ApiClient } from "./api-client";

export interface Scenario {
  name: string;
  url: string;
  status_code: number;
  description: string;
  requires_paid_tier: boolean;
}

export class AgentSandboxClient extends ApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async listScenarios(): Promise<{ data: Scenario[] }> {
    const response = await this.get("/agent/v1/scenarios");
    return (await response.json()) as { data: Scenario[] };
  }

  async triggerScenario(scenario: string) {
    return this.get(`/agent/v1/scenarios/${scenario}`);
  }

  async health(): Promise<{ data: { status: string; version: string } }> {
    const response = await this.get("/agent/v1/health");
    return (await response.json()) as { data: { status: string; version: string } };
  }
}
