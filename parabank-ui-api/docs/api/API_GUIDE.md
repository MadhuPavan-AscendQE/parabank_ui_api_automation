# ParaBank API documentation — Project 13

## Sources and scope
Official explorer: https://parabank.parasoft.com/parabank/api-docs/index.html
Official OpenAPI JSON: https://parabank.parasoft.com/parabank/services/bank/openapi.json
Official OpenAPI YAML: https://parabank.parasoft.com/parabank/services/bank/openapi.yaml
Retrieved JSON: 2026-10-15; service definition title The ParaBank REST API, OpenAPI 3.0.1.
Source implementation inspected at https://github.com/parasoft/parabank/tree/3789f415f7373df902feca6e5076077956f96c42 .

Base URL: https://parabank.parasoft.com/parabank/services/bank/
All paths below are relative to that base. This is Parasoft's simulated bank.

## Authentication and ownership
GET login/{username}/{password} returns a Customer object. This API does not issue an OAuth/JWT token. The inspected service definition does not declare a security scheme for these operations. Do not infer production authorization guarantees. The project enforces a client-side ownership boundary; it is not a substitute for server authorization.

Credentials are URL path parameters for this legacy login endpoint; URL-encode each segment and use only generated demo credentials. Do not log the URL. The browser session remains separate: use the UI login for browser access. Updating a customer requires username/password query parameters as well as profile fields, so avoid verbose request logging.

## Provisioning
No REST /register endpoint is advertised. The API fixture GETs the UI register.htm form then POSTs form fields to that same web URL. Content-Type is application/x-www-form-urlencoded. Fields: customer.firstName, customer.lastName, customer.address.street, customer.address.city, customer.address.state, customer.address.zipCode, customer.phoneNumber, customer.ssn, customer.username, customer.password, repeatedPassword. Verify welcome HTML, then call REST login to discover the customer ID. This setup does not count as UI coverage.

## Endpoint matrix
| Method | Relative path | Inputs | Successful body |
|---|---|---|---|
| GET | login/{username}/{password} | Encoded path credentials | Customer |
| GET | customers/{customerId} | Owned customer ID | Customer |
| GET | customers/{customerId}/accounts | Owned customer ID | Account[] |
| GET | accounts/{accountId} | Owned account ID | Account |
| POST | createAccount | Query customerId, newAccountType, fromAccountId | Account |
| POST | deposit | Query accountId, amount | Acknowledgement string |
| POST | withdraw | Query accountId, amount | Acknowledgement string |
| POST | transfer | Query fromAccountId, toAccountId, amount | Acknowledgement string |
| POST | billpay | Query accountId, amount; JSON Payee body | BillPayResult |
| GET | accounts/{accountId}/transactions | Owned account ID | Transaction[] |
| GET | transactions/{transactionId} | ID previously seen in owned history | Transaction |
| GET | accounts/{accountId}/transactions/amount/{amount} | Owned ID and decimal amount | Transaction[] |
| POST | customers/update/{customerId} | Query firstName, lastName, street, city, state, zipCode, phoneNumber, ssn, username, password | Acknowledgement string |

All mutations above use POST. Account type 0 = CHECKING, 1 = SAVINGS; source also defines LOAN = 2, which this framework does not create directly. Loan requests are a new requirement.

## Headers, statuses and schema expectations
Default Accept: application/json. For billpay, send Content-Type: application/json. Query-only mutations do not send a JSON body. The XML check explicitly sends Accept: application/xml. Numeric amount strings use two decimal places.

Positive tests require HTTP 200. The downloaded OpenAPI uses default response entries instead of explicit success/error status maps; 200 is this suite's positive-path assertion, not a claim that the spec promises all error codes. Negative validation/error contracts remain new requirements and must be observed/documented before asserting exact status codes.

Object/array responses require application/json and JSON parsing. Scalar mutation acknowledgements are read as response text and checked for the operation-specific success message; their wire serialization may differ from object JSON. Financial success is then established by a fresh ledger read, never by the message alone.

Account: id, customerId, type, numeric balance. Customer: id, firstName, lastName, address, phoneNumber, ssn; username/password must not be returned. Transaction: id, accountId, type (Debit/Credit), date, numeric amount, description. The pinned OpenAPI describes date as a date-time string; the runtime validator checks that contract. BillPayResult: accountId, amount, payeeName. See actual execution findings in VALIDATION.md if the service differs.

## Example: transfer an owned amount
```ts
const before = await bank.snapshot();
await bank.transfer(sourceId, targetId, cents(1234));
assertTransfer(before, await bank.snapshot(), String(sourceId), String(targetId), cents(1234));
```
The transport submits POST transfer with query fromAccountId=<owned>, toAccountId=<owned>, amount=12.34. No real account numbers or shared default demo IDs are hard-coded.

## Example: billpay JSON
```json
{
  "name": "MySDET Test Utility",
  "address": {"street": "200 Sample Road", "city": "Testville", "state": "CA", "zipCode": "90210"},
  "phoneNumber": "2025550182",
  "accountNumber": 123456
}
```
POST billpay?accountId=<owned>&amount=7.45. The payee is synthetic. Verify response fields, source-account delta, total delta and transaction history as applicable.

## Cross-channel scenarios
UI register → API identity/ledger; API create account → UI account/type; API transfer → UI balances; UI transfer → API debit/credit evidence; UI bill payment → API posting; API profile change → UI relogin/persistence.

## Data retention and excluded administration
No per-customer delete endpoint is exposed in the inspected service. Dispose of the request context to release connections; this does not delete server data. Never call cleanDB or initializeDB on the public shared demo. No automatic cleanup is claimed. For repeated runs use an owned deployment with separately managed reset/retention.

The subset OpenAPI retains official metadata and schema definitions. See UPSTREAM_LICENSE.txt and NOTICE.md for provenance. Treat it as a pinned reference, not a promise of current runtime behavior.
