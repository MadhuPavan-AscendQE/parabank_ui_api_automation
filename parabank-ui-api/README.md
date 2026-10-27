# Project 13 — ParaBank UI + API + end-to-end

Extends Project 12 with direct REST service adapters, runtime contracts and cross-channel reconciliation. The existing UI coverage remains separate and uses UI-only setup.

| Suite | Cases | Setup | Assertions |
|---|---:|---|---|
| UI | 24 | Synthetic registration in browser | UI controls, exact balances, transactions and profile |
| API | 16 | HTTP POST to web registration form, then REST login | HTTP responses, JSON contracts, ownership and money ledger |
| E2E | 6 | Browser registration, independent REST context | UI/API agreement after actions in either channel |

## Run
Node 22+ recommended. From this directory:
```
npm ci
npm run typecheck
npm run test:domain
npm test -- --list
npm run test:api
npx playwright install chromium
npm run test:ui
npm run test:e2e
npm test
npm run report
```
API tests do not require a browser. Use .env.example for configuration. BASE_URL is the UI context URL ending /parabank/. API_BASE_URL defaults to BASE_URL + services/bank/. Both must point to the same application/database for E2E. TEST_PROXY is optional.

Site: https://parabank.parasoft.com/parabank/
REST base: https://parabank.parasoft.com/parabank/services/bank/
Official API explorer: https://parabank.parasoft.com/parabank/api-docs/index.html

## Architecture
`src/ui/` retains business page objects. `src/api/transport/` owns HTTP status/representation checks and redacted evidence. `src/api/contracts/` validates actual runtime objects. `src/api/services/` restricts calls to fixture-owned IDs. `src/api/setup/` contains explicitly labeled HTTP web-form registration. `src/domain/` owns integer-cent arithmetic and ledger types. `src/assertions/` is shared across UI/API. `src/fixtures/` supplies isolated UI, API and hybrid lifecycles. Tests live in `tests/ui/`, `tests/api/`, `tests/e2e/` and have no order dependency.

## Data lifecycle
The public demo has no documented REST customer-registration endpoint. API provisioning posts application/x-www-form-urlencoded data to register.htm; that is a web form, not a REST API. It uses no browser. Each test that needs an identity gets a unique synthetic customer. Full execution creates 43 customers: 21 UI + 16 API + 6 E2E. Browser-blocked tests do not reach provisioning.

Only synthetic SSN/address/phone data is used. Credentials are generated within the source schema's 20-character limit. UI setup and API setup are never interchanged silently. REST login returns customer data, not a bearer token or an authenticated browser session. E2E login still uses the browser UI.

There is no scoped customer/account delete service in the documented API. Created demo records remain until operator cleanup. No cleanDB, initializeDB, shared-admin reset, JMS controls or setParameter calls are implemented. Use an owned ParaBank deployment for frequent evaluation; manage cleanup through its environment lifecycle.

One worker and zero test retries reduce accidental duplicate financial operations. APIRequestContext maxRetries is zero. API evidence records operation names, methods and statuses, not credential-bearing URLs or response bodies. Traces/screenshots/video default off. Test runner assertions may include synthetic customer/account details; treat evidence accordingly.

## Documentation
- docs/api/API_GUIDE.md — endpoints, parameters, media types, setup, authentication, examples and cleanup.
- docs/api/official-openapi-subset.json — relevant operations extracted from the official contract, downloaded 2026-10-15; not a complete API definition.
- docs/ARCHITECTURE.md — boundaries and invariants.
- docs/UI_REFERENCE.md — source-grounded controls inherited from Project 12.
- ../VALIDATION.md — actual executed results and limitations.

The sibling evaluation-pack contains 16 intentionally unimplemented requirements, Excel cases and agent scoring. Existing Project 12 remains a separate UI-only deliverable.
