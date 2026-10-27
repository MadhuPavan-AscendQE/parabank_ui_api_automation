# UI reference and source provenance

Live site: https://parabank.parasoft.com/parabank/
About: https://parabank.parasoft.com/parabank/about.htm
Official code: https://github.com/parasoft/parabank/tree/3789f415f7373df902feca6e5076077956f96c42
Reviewed 2026-10-14. Official source was cloned for inspection, not bundled. Public registration HTML was retrieved successfully. Authenticated runtime flows could not be inspected without an installed browser.

| Screen | Route | Verified source contract |
|---|---|---|
| Registration | register.htm | #customerForm; customer.* names; repeatedPassword; Register |
| Login | index.htm / login.htm | #loginPanel; username/password; Log In |
| Overview | overview.htm | #accountTable; Account, Balance, Available Amount; Total |
| Open account | openaccount.htm | #type, #fromAccountId, #newAccountId |
| Activity | activity.htm?id=<owned ID> | #accountId, #accountType, #balance, #transactionTable |
| Transfer | transfer.htm | #amount, #fromAccountId, #toAccountId; result ID spans |
| Bill Pay | billpay.htm | payee.* name fields; verifyAccount; named fromAccountId; validationModel-* |
| Transaction | transaction.htm?id=<owned ID> | labeled Transaction ID, Date, Description, Type, Amount rows |
| Profile | updateprofile.htm | customer.* inputs; Profile Updated confirmation |
| Loan | requestloan.htm | #amount, #downPayment, #fromAccountId; Apply for a Loan |

Source files are under src/main/webapp/WEB-INF/jsp/content/ in the official repository. Text is mapped by src/main/resources/messages.properties. Username/password size checked in src/main/resources/com/parasoft/parabank/dao/jdbc/sql/create.sql.

## Project 13 API boundary
UI-only tests retain the Project 12 interaction contract. API and E2E suites use the documented REST surface described in docs/api/API_GUIDE.md. The browser's internal services_proxy routes are not treated as the public REST API.

No public administration/reset or real-money operations are performed. Data is synthetic and IDs are fixture-owned.
