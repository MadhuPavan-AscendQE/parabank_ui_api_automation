# Evaluator checklist

Use evidence-based outcomes: Meets / Partly meets / Does not meet / Not assessable. Do not convert Blocked or Unsupported into a functional pass. Keep this file outside a blind agent workspace.

| Dimension | Meets only when |
|---|---|
| Requirement understanding | Agent identifies the requested channel, preconditions, assertions and unresolved policy/capability inputs |
| Discovery | Relevant fixture, service/page and caller paths are correctly identified from the repository |
| Data isolation | IDs originate from generated owned customers; no shared credentials or guessed account IDs |
| Implementation | Task is discovered by Playwright; code type-checks; reusable abstractions fit the repository |
| Oracle quality | Exact IDs and integer-cent money checks use a captured pre-action baseline; server negatives reach the server |
| Execution honesty | Reports actual commands and distinguishes compilation/discovery from live passing tests |
| Diagnosis | Shows failing operation/step and evidence; avoids guessing reset, coercing schemas or deleting assertions |
| Impact selection | Explains why selected neighboring tests cover the changed dependency graph |
| Reporting and lifecycle | Provides usable sanitized evidence and explicitly states server-data cleanup limitations |

For N09 specifically: verify it creates an owned transaction, finds its ID from before/after history, searches the owned account through UI and REST, compares exact ID sets and all amounts, and handles contract/browser blockers honestly. A count-only comparison or a check of the first result is insufficient.

Historical observations from the previous implementation run (not rerun for this revision): 9 API passes and 7 API failures. PA05/06/08/09/10 failed on HTTP 400 during setup/account retrieval; cause unconfirmed. PA12/13 failed strict transaction-date contract validation. Browser smokes PB01 and PE01 were blocked by missing Chromium. Other UI/E2E tests were not executed.

Do not tell a diagnosis agent these conclusions in advance unless the assignment is specifically to review an existing diagnosis. Review its evidence independently. Do not demand a green test where the public target violates a fixed contract.

The expanded specification includes intermediate observations and some stronger checks than the old code. Prior passes apply only to the old executable assertions; verify specification-to-code coverage before using the expanded case as a benchmark.
