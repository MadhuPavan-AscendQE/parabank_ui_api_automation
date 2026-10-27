# Importing Project 13 test cases

Use `Project13_ParaBank_Import.xlsx` for the myDiya/mySDET import form.

- Sheet: Test Cases; exact 13 template columns.
- 62 cases and 612 ordered step rows, including setup and teardown.
- Case metadata appears on the first row only; continuation rows retain step/data/expected result.
- Requirement contains the primary module name for every case: Identity, Accounts, Transfers, Bill Payments, Profile, Lending or Transactions.
- Test Case ID retains PB, PA, PE and P13-N identifiers. Assignees are blank.
- Cross-module cases are assigned to a primary module; their steps retain the complete journey.
- The 16 new requirement cases remain unimplemented.

`ParaBank_UI_API_Test_Cases.xlsx` is the detailed multi-sheet reference workbook, not the import file. Use the import workbook above when uploading test cases.

This packaging revision does not change executable source code or claim a new test run. The import workbook was structurally verified; an actual application import has not been tested.
