# Project 13: running an agent evaluation

Revision: 22 October 2026. This revision expands the specifications; it does not claim a new live test execution or implement the 16 new tasks.

The original workbook compressed setup, action and verification into one or two rows. The replacement contains 62 cases and 612 individually numbered steps, including setup, prerequisite gates and teardown. Read TestCases with TestSteps and DataSetup. RequirementTasks states what a new implementation must deliver and which inputs are still required.

## What this sandbox measures

The client repository is a real automation codebase for discovery, extension, execution and failure analysis. Public ParaBank is an external demo target. It is not a resettable, deterministic application sandbox: another user or an environment reset may change the service, and you cannot deploy product fixes to it.

Use public-demo runs to evaluate framework discovery, isolated synthetic data, API/UI integration, sensible assertions and honest diagnosis. Use a separately controlled ParaBank deployment when you need repeatable loan policies, dated seed transactions, application fault injection or product behavior changes. A local server or idempotency implementation is not included in this delivery.

## Three evaluation modes

1. **Regression and diagnosis:** give the agent the pure client repo and selected existing case specifications. Ask it to execute a bounded selection and distinguish environment, setup, contract, product and test-code failures. Give historical logs only when log analysis is the intended task.
2. **New automation:** give the pure repo plus one of `agent-input/tasks/P13-N09.md`, N10, N11, N14 or N15. These tasks add coverage that the existing code does not implement. Keep the rest of the evaluation pack out of the agent workspace.
3. **Requirement reasoning:** use N01–08, N12–13 or N16 as appropriate. Some need pinned policy, controlled data or a documented capability. Correctly identifying a missing prerequisite is a successful reasoning outcome, but it is not a passing functional test or completed implementation.

Negative tests must reach the server through an ownership-preserving negative-test adapter. The existing `OwnedBank.transfer` helper deliberately rejects nonpositive amounts. Catching that local exception does not test ParaBank’s API validation. Preserve the normal helper’s safeguards.

## Give agents the right material

Copy `parabank-ui-api/` into a fresh disposable workspace. Add only the selected task Markdown, its case JSON, `agent-input/data-contracts.json` and `agent-input/HANDOFF.md`. The task files point to their matching JSON specs. Do not expose `evaluator-only/`, the complete Excel historical-results column, old execution logs or another agent’s patch during a blind evaluation.

The machine-readable cases contain actions and expected results but no solution code or historical execution result. For a baseline **generation** test, the evaluator must remove the corresponding existing test from the disposable copy before giving it to the agent; otherwise it is maintenance/reuse, not blind generation. Do not remove it from the master delivery. Record the exact starting commit/hash and case exclusions. Existing page objects and API services may intentionally remain reusable.

## Suggested first assignment

Start with **P13-N09: UI transaction search matches REST**. It requires the agent to discover the framework, generate an owned customer and transaction, add a search page abstraction, compare transaction IDs across channels and report execution evidence. Browser unavailability or the existing transaction-date contract mismatch may block live verification; the agent should still produce a reviewable implementation and identify the exact blocker without weakening the contract.

Example instruction:

> Implement P13-N09 using the supplied requirement and data contracts. First map relevant fixtures, pages, API services and assertions. Add the new search abstraction and test with the case ID. Reuse existing architecture. Compare exact owned transaction ID sets and amounts, including the transaction created during this test. Validate types and discovery, then run only the selected test when prerequisites are available. Return changed files, requirement-to-assertion mapping, commands with observed results, and any blocker. Do not change assertions merely to match unexpected application behavior.

## Expected handoffs in mySDET

myHelm routes the request; the mySDET orchestrator owns the workflow. These are evaluation expectations, not an executed agent integration:

| Stage | Agent | Required output |
|---|---|---|
| Discover | myNova | Routes/endpoints, fixture dependency map, relevant files and observed uncertainties |
| Prepare data | myNexa | Synthetic data plan, generated ownership references, pre-action ledger and lifecycle limits |
| Implement | myGenie | Minimal changes and case-to-assertion mapping, with existing architecture reused |
| Execute | myVega | Actual commands, result per case/step, sanitized evidence and prerequisite blockers |
| Diagnose | myAstra | Failure category, supporting evidence and proposed fix; no unsupported root-cause claim |
| Assess impact | myDelta | Affected callers/tests and a justified bounded regression selection |

## Execution recipe

From the disposable `parabank-ui-api` root:

```sh
npm install
npx playwright install chromium
npm run typecheck
npm run test:domain
npx playwright test --list
npx playwright test --project=api --grep 'PA-01 '
# After implementing and discovering the new case:
npx playwright test --project=e2e --grep 'P13-N09 '
```

Use the supplied lockfile with `npm ci` if one exists in your copy. Use `TEST_PROXY` only when your execution environment requires it. Both base URLs must target the same deployment. Use one worker and zero automatic retries for mutations. Do not run the entire public suite merely to diagnose one case.

`--list` proves discovery only. Type checking proves compilation only. A successful patch or generated test does not prove live behavior. Keep the new case in the right configured test directory; ensure it is discovered before calling it implemented.

## Status rules

- **Passed:** all applicable assertions actually ran and succeeded.
- **Failed:** an executed assertion or product contract was violated; preserve expected and actual.
- **Blocked:** a prerequisite prevented the intended assertion, such as missing browser, failed registration or an unresolved policy. Record which later steps were not executed.
- **Unsupported:** a documented target capability needed by the task is absent. This is not a pass.
- **Not executed:** no execution evidence exists for that step.

An unexpected HTTP 400 during login does not establish a server reset as its root cause. A numeric `Transaction.date` against a pinned `date-time` string schema is a concrete contract discrepancy; do not silently coerce it. A response-contract failure can block a downstream journey while remaining a failure of the contract check itself. Record both levels.

## Evidence and completion

Each run must return the task ID, starting revision, changes, requirement-to-assertion mapping, actual commands/results, per-step evidence references, resource lifecycle note and remaining limitations. Redact passwords and credential-bearing request URLs. Preserve pre-action balances independently of final actual values.

Closing browser/API contexts is local teardown, not deletion of ParaBank customer records. No global database reset is permitted on the public demo. Synthetic customers and transactions persist because scoped deletion is unavailable.

The evaluator should use `evaluator-only/REVIEW_CHECKLIST.md` after the agent completes. Keep historical results separate from fresh execution results. This revision did not rerun any live mutations and does not turn previously blocked UI tests into passes.
