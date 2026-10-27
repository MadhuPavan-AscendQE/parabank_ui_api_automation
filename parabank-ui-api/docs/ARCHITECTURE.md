# Workflow and oracle boundaries

Fixtures create customers through RegistrationPage, then createPair combines OverviewPage and OpenAccountPage. Tests compose page actions and ledger assertions. UI adapters own selectors and wait for rendered values; domain helpers do not know about browser or HTTP. No test depends on a previously executed case. These UI boundaries are retained in Project 13; API and hybrid fixtures are separate.

Account ID is the identity boundary. Discover it from the customer overview; create a distinct target through the UI; confirm both IDs in the transfer result. Rows are scoped to #accountTable and transaction links to #transactionTable. Numeric cell positions are deliberate: they reflect verified fixed table columns (Account/Balance/Available and Date/Transaction/Debit/Credit). They are not global nth-element guesses.

Use role/name for links and buttons. Registration/profile inputs lack programmatically associated labels, so stable name attributes are used. Bill-pay phone has a random ID and CSS class in official source; use name="payee.phoneNumber". Dotted IDs are selected by attribute/name rather than unescaped CSS IDs.

In UI-only tests, wait for populated account options and rendered balance strings; never use arbitrary sleeps or service-response payloads. Read-only evaluateAll is limited to actual option DOM values. Application AJAX is normal browser behavior; the UI-only tests never call APIs. API and E2E projects explicitly use src/api adapters.

Money comparisons use integer cents. parseMoney rejects malformed precision and grouping. Funds are measured immediately before and after actions, so fixed starting balance assumptions are avoided. New accounts are checked for unique IDs, type and internally funded balance.

Failure categories: browser install/environment, registration/setup, public-demo reset, selector drift, client validation, business invariant. Inspect assertions before any healing. Never heal a financial delta or change a rejected negative-amount requirement into an acceptance test.


## Project 13 API extension
BankHttp handles transport and sanitized operation/status evidence. OwnedBank accepts only IDs discovered under the fixture customer; transaction drill-down requires an ID returned by owned account history. This guard prevents accidental tests against shared default users. Runtime contracts validate source types before monetary conversion. apiCents accepts finite numeric values with at most two decimal digits and safe integer cents; it never rounds an invalid amount into validity.

API fixtures provision via HTTP web form. Hybrid fixtures depend on the browser-created customer and use a separate request context. UI snapshots and API snapshots are independently read into the same Ledger shape, allowing shared assertTransfer/assertDebit oracles. No browser storage injection or API login-as-browser shortcut is used.

IDs and monetary values may appear in assertion output; generated credentials and raw HTTP bodies are excluded from the custom API summary. Login and update endpoints carry credentials in path/query by service design. Disable verbose request logs for those operations.
