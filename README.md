# Project 13 — ParaBank UI + API + E2E

`parabank-ui-api/` is the standalone client repository. `evaluation-pack/` is the separate evaluator material.

Start with `evaluation-pack/SANDBOX_GUIDE.md`. The revised Excel contains 62 cases and 612 step rows, with explicit setup, actions, expected results and evidence requirements. `agent-input/` provides selected task prompts and case JSON; keep `evaluator-only/` and historical evidence outside blind agent workspaces.

The 16 new tasks remain deliberately unimplemented. Public ParaBank is an external integration target, not a controlled resettable server. See VALIDATION.md for historical execution results and revision limits.

## Import-ready test cases — 27 October 2026

Import `evaluation-pack/Project13_ParaBank_Import.xlsx`. Its Requirement column contains module names for all 62 cases. See `evaluation-pack/IMPORT_README.md`. The multi-sheet workbook remains available as reference documentation.
