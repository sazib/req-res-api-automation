# ReqRes API Automation Framework

A senior-grade API automation framework for testing [ReqRes](https://reqres.in/) using **Playwright Test** + **TypeScript**.
Runs anywhere — locally, inside Docker, and on GitHub Actions (see [Structure](#structure), [Docker](#docker), [CI](#ci)).

## Stack

- **Playwright Test** — test runner with retries, fixtures, parallel execution, and HTML reports
- **TypeScript** — strict typing across clients, models, and schemas
- **dotenv** — environment configuration
- **Docker** — reproducible runtime (Playwright base image) plus a local mock API for offline runs

## Structure

```
.
├── Dockerfile                    # Playwright-based runtime image
├── docker-compose.yml            # mock-api + tests services (offline run)
├── fixtures.ts                   # Playwright test + fixture wiring
├── playwright.config.ts          # Runner config (baseURL, retries, reporter)
├── tests/
│   ├── users/                    # User CRUD + auth (legacy /api/users/*)
│   │   ├── list-users.spec.ts
│   │   ├── get-user.spec.ts
│   │   ├── create-user.spec.ts
│   │   ├── update-user.spec.ts
│   │   ├── delete-user.spec.ts
│   │   └── auth.spec.ts
│   ├── orders/                   # Agent order + user endpoints (/agent/v1/*)
│   │   ├── list-orders.spec.ts
│   │   └── agent-users.spec.ts
│   └── payments/                 # Payments sandbox + failure scenarios
│       ├── payments-discovery.spec.ts
│       ├── payment-intents.spec.ts
│       └── failure-scenarios.spec.ts
└── src/
    ├── clients/                  # Typed API clients (per resource + base)
    │   ├── api-client.ts
    │   ├── users-client.ts
    │   ├── orders-client.ts
    │   └── auth-client.ts
    ├── config/
    │   └── environments.ts       # Per-environment config (dev/staging/prod) + mock URL
    ├── fixtures/
    │   └── api-fixtures.ts       # Shared Playwright fixtures (clients)
    ├── mocks/                    # Local mock API server (offline/deterministic runs)
    │   ├── mock-server.ts
    │   └── start-mock-server.ts
    ├── models/                   # Typed request/response interfaces
    │   ├── user.ts
    │   ├── order.ts
    │   └── response.ts
    ├── schemas/                  # JSON-schema-style validators
    │   ├── user.schema.ts
    │   ├── auth.schema.ts
    │   └── order.schema.ts
    └── utils/
        ├── data-generator.ts     # Faker-free test data generation
        ├── retry.ts              # Exponential backoff + Retry-After support
        └── helpers.ts            # Validators and parsing helpers
```

## Setup

### Local

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

### Docker

No local Node.js or Playwright installation is needed — everything runs in a container.

```bash
# Build the image
docker build -t req-res-api-automation .

# Offline: run the whole suite against the bundled mock API (no API key needed)
docker compose up --build

# Or run just the tests container against the mock (test report written to ./playwright-report)
docker compose run --rm tests

# Against the real ReqRes API
docker run --rm -e API_KEY=your-reqres-api-key req-res-api-automation

# Individual env vars / scripts are fully supported
docker run --rm -e TEST_ENV=staging -e API_KEY=your-reqres-api-key req-res-api-automation npm run test:users
```

> The image is based on `mcr.microsoft.com/playwright` and pins `PLAYWRIGHT_VERSION` (default `1.63.0`) via a build ARG — bump both if you upgrade `@playwright/test`. The `docker-compose.yml` `tests` service writes the HTML report to `./playwright-report` on the host.

## Running tests

```bash
npm test                 # All suites (live API)
npm run test:mock        # All suites against the local mock (start it first)
npm run test:users       # Users + auth
npm run test:orders      # Orders + agent users
npm run test:payments    # Payments + failure scenarios
npm run mock             # Start the bundled mock API server on :3001
npm run test:docker      # docker compose run --rm tests
npm run test:report      # Open the HTML report
npm run lint             # ESLint
npm run typecheck        # TypeScript check
```

## CI

GitHub Actions runs the suite entirely inside the Docker image (see `.github/workflows/ci.yml`).
It works out of the box with **zero secrets**: by default tests run offline against the bundled
mock API. To hit the real ReqRes API, add an `API_KEY` repository secret (or re-run the workflow
with `run_mode: live`) and CI switches to live mode automatically.

1. **test** — builds the image once per shard using `docker/build-push-action` with the
   GitHub Actions layer cache (no registry needed; shards 2-4 reuse shard 1's cached layers).
   In mock mode it starts the mock API as a sidecar container, then runs Playwright in 4 shards,
   each as a `docker run` on a shared bridge network, with `blob-report/` and `test-results/`
   mounted back to the runner for artifact upload.
2. **report** — merges the shard blob reports into a single HTML report and uploads it as the
   `playwright-report` artifact.
3. **jekyll-gh-pages.yml** — optionally deploys the merged report to GitHub Pages after the
   CI workflow completes.

Secrets/vars: `API_KEY` toggles live mode (required for the legacy `/api/*` endpoints).
The `/agent/v1/*` and `/sim/payments/v1/*` suites pass without it in mock mode.
`TEST_ENV` and `API_BASE_URL` can also be configured as secrets to override the target
environment. `run_mode` (`auto` / `mock` / `live`) can be chosen per-run under
**Actions → Run workflow**.

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
- **Deterministic sandbox** — the bundled mock server (`src/mocks/`) mirrors the
  ReqRes endpoints and supports the `seed` parameter to assert byte-identical
  fixture data across runs; enable it with `USE_MOCK=true` for fully offline,
  API-key-free runs.