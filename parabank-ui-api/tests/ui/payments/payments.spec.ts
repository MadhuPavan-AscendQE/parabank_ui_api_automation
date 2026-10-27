import { test, expect } from '../../../src/fixtures/bank.fixture';
import { cents } from '../../../src/domain/money/cents';
import { account } from '../../../src/domain/ledger/account';
import { assertDebit } from '../../../src/assertions/ledger.assertions';
import { payee } from '../../../src/data/payee.factory';
test("PB-16 Required bill payment fields", async ({ customer, bill, page }) => {
    await test.step("Required bill payment fields", async () => {
        void customer;
        await bill.open();
        await bill.submit();
        for (const id of ['name', 'address', 'city', 'state', 'zipCode', 'phoneNumber', 'account-empty', 'verifyAccount-empty', 'amount-empty'])
            await expect(page.locator('#validationModel-' + id)).toBeVisible();
    });
});
test("PB-17 Mismatched payee account does not debit", async ({ customer, bill, overview, page }) => { await test.step("Mismatched payee account does not debit", async () => { void customer; const before = await overview.snapshot(); await bill.open(); await bill.fill(Object.keys(before)[0], cents(250)); await bill.field('verifyAccount').fill('654321'); await bill.submit(); await expect(page.locator('#validationModel-verifyAccount-mismatch')).toBeVisible(); expect(await overview.snapshot()).toEqual(before); }); });
test("PB-18 Non-numeric payment does not debit", async ({ customer, bill, overview, page }) => { await test.step("Non-numeric payment does not debit", async () => { void customer; const before = await overview.snapshot(); await bill.open(); await bill.fill(Object.keys(before)[0], cents(250)); await bill.field('amount').fill('abc'); await bill.submit(); await expect(page.locator('#validationModel-amount-invalid')).toBeVisible(); expect(await overview.snapshot()).toEqual(before); }); });
test("PB-19 Bill payment exact account debit", async ({ customer, bill, overview }) => { await test.step("Bill payment exact account debit", async () => { void customer; const before = await overview.snapshot(); const from = Object.keys(before)[0]; expect(account(before, from).balance).toBeGreaterThan(745); await bill.pay(from, cents(745)); assertDebit(before, await overview.snapshot(), from, cents(745)); }); });
test("PB-20 Bill payment transaction drill-down", async ({ customer, bill, overview, activity }) => { await test.step("Bill payment transaction drill-down", async () => { void customer; const s = await overview.snapshot(); const from = Object.keys(s)[0]; await bill.pay(from, cents(456)); await activity.open(from); await activity.details(await activity.transaction('Bill Payment to ' + payee.name, cents(456), 'Debit'), cents(456), 'Debit'); }); });
