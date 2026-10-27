# Agent handoff

Use the supplied case JSON plus data-contracts.json as the specification. Each step has a phase, action, expected result and required evidence. Setup is part of the case; run teardown even on failure. Do not hardcode account IDs or starting balances.

For an extension task, return: discovery notes; data plan; code patch; case-to-assertion mapping; actual command results; step-level evidence; diagnosis/remaining blocker; impact-based regression selection.

Use Passed, Failed, Blocked, Unsupported or Not executed accurately. Missing environment or policy does not authorize inventing an expected outcome. Proposed product requirements are not verified behavior of the public demo. Never change public admin settings.

Existing code can have fewer intermediate checks than this expanded specification. Treat a gap as work to map or extend; do not assume a historical pass proves the expanded requirement. No previous execution result is included in these case files.
