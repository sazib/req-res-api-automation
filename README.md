# ReqRes API Automation Framework

A senior-grade API automation framework for testing [ReqRes](https://reqres.in/) using **Playwright Test** + **TypeScript**.

## Stack

- **Playwright Test** — test runner with retries, fixtures, parallel execution, and HTML reports
- **TypeScript** — strict typing across clients, models, and schemas
- **dotenv** — environment configuration

## Structure

```
.
├── fixtures.ts                    # Playwright test + fixture wiring
├── playwright.config.ts           # Runner config (baseURL, retries, reporter)
├── tests/
│   ├── users/                     # User CRUD + auth (legacy /api/users/*)
│   │   ├── list-users.spec.ts
│   │   ├── get-user.spec.ts
│   │   ├── create-user.spec.ts
│   │   ├── update-user.spec.ts
│   │   ├── delete-user.spec.ts
│   │   └── auth.spec.ts
│   ├── orders/                    # Agent order + user endpoints (/agent/v1/*)
│   │   ├── list-orders.spec.ts
│   │   └── agent-users.spec.ts
│   └── payments/                  # Payments sandbox + failure scenarios
│       ├── payments-discovery.spec.ts
│       ├── payment-intents.spec.ts
│       └── failure-scenarios.spec.ts
└── src/
    ├── clients/                   # Typed API clients (per resource + base)
    │   ├── api-client.ts
    │   ├── users-client.ts
    │   ├── orders-client.ts
    │   └── auth-client.ts
    ├── config/
    │   └── environments.ts        # Per-environment config (dev/staging/prod)
    ├── fixtures/
    │   └── api-fixtures.ts        # Shared Playwright fixtures (clients)
    ├── models/                    # Typed request/response interfaces
    │   ├── user.ts
    │   ├── order.ts
    │   └── response.ts
    ├── schemas/                   # JSON-schema-style validators
    │   ├── user.schema.ts
    │   ├── auth.schema.ts
    │   └── order.schema.ts
    └── utils/
        ├── data-generator.ts      # Faker-free test data generation
        ├── retry.ts               # Exponential backoff + Retry-After support
        └── helpers.ts             # Validators and parsing helpers
```

## Setup

```bash
npm install
cp .env.example .env
```

Set a valid API key in `.env`:

```
API_KEY=your-reqres-api-key
```

> The legacy `/api/*` endpoints on ReqRes now require an `x-api-key` header
> (get one at app.reqres.in/api-keys). The `/agent/v1/*` and `/sim/payments/v1/*`
> endpoints work without a key (free tier, 100 req/day/IP).

## Running tests

```bash
npm test                 # All suites
npm run test:users       # Users + auth
npm run test:orders      # Orders + agent users
npm run test:payments    # Payments + failure scenarios
npm run test:report      # Open the HTML report
npm run lint             # ESLint
npm run typecheck        # TypeScript check
```

## Design notes

- **Typed clients** — every endpoint returns typed models; mutation endpoints also
  expose `*Raw` variants for asserting raw HTTP status codes.
- **Retry with backoff** — `src/utils/retry.ts` retries on retryable status codes
  (429/5xx), honoring the `Retry-After` header and exponential backoff, so tests are
  resilient to rate limits in CI.
- **Shared fixtures** — clients are injected via Playwright fixtures
  (`usersClient`, `ordersClient`, `agentUsersClient`, `authClient`).
- **Environment management** — `src/config/environments.ts` centralizes base URL,
  API key, timeout and retry config per environment (`TEST_ENV=staging`).
- **Deterministic sandbox** — uses `seed` parameter to assert byte-identical
  fixture data across runs.
