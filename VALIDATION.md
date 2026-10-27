# Specification revision — 22 October 2026

The workbook now contains 62 cases and 612 numbered steps, including setup, gates and teardown; 16 requirement task definitions; data contracts; UI/API references; and editable step results. Machine-readable case files and selected task prompts are included. Historical results remain separate from fresh results.

This revision changes documentation and evaluation inputs only. It does not implement the 16 tasks or rerun live tests. The client source is unchanged. Some expanded observations strengthen the old executable checks; agents must map and close those gaps rather than treating historical passes as proof. Spreadsheet structure, references and rendered sheets were reviewed.

---

# Validation — 2026-10-15

- TypeScript strict compilation: passed.
- Test discovery: 46 tests (24 UI, 16 API, 6 E2E) in 8 files.
- Offline domain/data checks: 19 passed.
- Live API execution: 9 passed; 7 failed. PA-01 ran as a separate smoke; completed PA-02–10 results were recovered from the interrupted run log; PA-11–16 were run in a resumed batch with fresh fixtures. No automatic retries. The interrupted run may have partially provisioned PA-11; no result is claimed for that attempt.
- Browser smoke PB-01 and PE-01: blocked before page actions because Chromium is missing. Other 23 UI and 5 E2E tests not executed.
- Original Excel: 62 cases and 109 compressed steps. Superseded by the 22 October specification revision described above.

## Live API results

| Case | Result |
|---|---|
| PA-01 | Passed |
| PA-02 | Passed |
| PA-03 | Passed |
| PA-04 | Passed |
| PA-05 | Failed — HTTP 400 during login/account retrieval |
| PA-06 | Failed — HTTP 400 during login/account retrieval |
| PA-07 | Passed |
| PA-08 | Failed — HTTP 400 during login/account retrieval |
| PA-09 | Failed — HTTP 400 during login/account retrieval |
| PA-10 | Failed — HTTP 400 during login/account retrieval |
| PA-11 | Passed |
| PA-12 | Failed — Transaction.date contract mismatch |
| PA-13 | Failed — Transaction.date contract mismatch |
| PA-14 | Passed |
| PA-15 | Passed |
| PA-16 | Passed |

## Failure details

### PA-05

```text
Error: customer-accounts HTTP status

expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

### PA-06

```text
Error: login HTTP status

expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

### PA-08

```text
Error: customer-accounts HTTP status

expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

### PA-09

```text
Error: customer-accounts HTTP status

expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

### PA-10

```text
Error: customer-accounts HTTP status

expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

### PA-12

```text
[api] › api/banking.spec.ts:17:5 › PA-12 Transaction detail matches history › Transaction detail matches history
Error: expect(received).toBe(expected) // Object.is equality
Expected: "string"
Received: "number"
at ../src/api/contracts/validate.ts:12
10 |     expect(typeof v.address?.[k]).toBe('string'); expect(v.password).toBeUndefined(); expect(v.username).toBeUndefined(); return v; }
11 | export function account(v: any): ApiAccount { id(v.id); id(v.customerId); expect(['CHECKING', 'SAVINGS', 'LOAN']).toContain(v.type); apiCents(v.balance); return v; }
> 12 | export function transaction(v: any): ApiTransaction { id(v.id); id(v.accountId); expect(['Debit', 'Credit']).toContain(v.type); expect(typeof v.description).toBe('string'); expect(typeof v.date).toBe('string'); expect(v.date).toMatch(/^\d{4}-\d{2}-\d{2}T/); expect(Number.isFinite(Date.parse(v.date))).toBe(true); apiCents(v.amount); return v; }
|                                                                                                                                                                                                    ^
13 | export function bill(v: any): ApiBill { id(v.accountId); apiCents(v.amount); expect(typeof v.payeeName).toBe('string'); return v; }
14 |
at map (/workspace/scratch/f02f81fd3bd0/delivery/project-13/parabank-ui-api/src/api/contracts/validate.ts:12:196)
at OwnedBank.transactions (/workspace/scratch/f02f81fd3bd0/delivery/project-13/parabank-ui-api/src/api/services/owned-bank.ts:32:310)
at /workspace/scratch/f02f81fd3bd0/delivery/project-13/parabank-ui-api/tests/api/banking.spec.ts:17:303
at /workspace/scratch/f02f81fd3bd0/delivery/project-13/parabank-ui-api/tests/api/banking.spec.ts:17:72
```

### PA-13

```text
[api] › api/banking.spec.ts:18:5 › PA-13 Amount search includes created transaction › Amount search includes created transaction
Error: expect(received).toBe(expected) // Object.is equality
Expected: "string"
Received: "number"
at ../src/api/contracts/validate.ts:12
10 |     expect(typeof v.address?.[k]).toBe('string'); expect(v.password).toBeUndefined(); expect(v.username).toBeUndefined(); return v; }
11 | export function account(v: any): ApiAccount { id(v.id); id(v.customerId); expect(['CHECKING', 'SAVINGS', 'LOAN']).toContain(v.type); apiCents(v.balance); return v; }
> 12 | export function transaction(v: any): ApiTransaction { id(v.id); id(v.accountId); expect(['Debit', 'Credit']).toContain(v.type); expect(typeof v.description).toBe('string'); expect(typeof v.date).toBe('string'); expect(v.date).toMatch(/^\d{4}-\d{2}-\d{2}T/); expect(Number.isFinite(Date.parse(v.date))).toBe(true); apiCents(v.amount); return v; }
|                                                                                                                                                                                                    ^
13 | export function bill(v: any): ApiBill { id(v.accountId); apiCents(v.amount); expect(typeof v.payeeName).toBe('string'); return v; }
14 |
at map (/workspace/scratch/f02f81fd3bd0/delivery/project-13/parabank-ui-api/src/api/contracts/validate.ts:12:196)
at OwnedBank.transactions (/workspace/scratch/f02f81fd3bd0/delivery/project-13/parabank-ui-api/src/api/services/owned-bank.ts:32:310)
at /workspace/scratch/f02f81fd3bd0/delivery/project-13/parabank-ui-api/tests/api/banking.spec.ts:23:24
at /workspace/scratch/f02f81fd3bd0/delivery/project-13/parabank-ui-api/tests/api/banking.spec.ts:19:5
```

The service returns a numeric transaction date where its published OpenAPI specifies a date-time string. The strict contract validator preserves this mismatch; affected transaction scenarios fail before their later assertions.

HTTP 400 failures during login/account retrieval are recorded as failures. Public-demo resets or service instability are possible explanations, not confirmed root causes. The framework did not weaken assertions, retry mutations or reset the shared database.

## Evidence and limits

Official OpenAPI JSON was fetched successfully on 2026-10-15. UI contracts come from Project 12 source review and live registration HTML. Runtime API findings do not prove browser behavior. API fixtures post the web registration form over HTTP and use synthetic data only. Created customers/accounts/transactions persist because no per-customer delete endpoint exists; request-context disposal only releases connections. No public admin reset was called.

JUnit reports, redacted operation summaries in reports where available, and execution logs accompany this evaluation pack. No browser screenshots or traces are bundled.
