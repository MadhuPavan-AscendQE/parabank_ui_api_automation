import { test, expect } from '../../../src/fixtures/bank.fixture';
import { cents } from '../../../src/domain/money/cents';
import { assertTransfer } from '../../../src/assertions/ledger.assertions';
test("PB-11 Transfer options contain only owned accounts", async ({ pair, overview, transfer, page }) => {
    await test.step("Transfer options contain only owned accounts", async () => {
        const ids = Object.keys(await overview.snapshot()).sort();
        await transfer.open();
        for (const selector of ['#fromAccountId', '#toAccountId'])
            expect((await page.locator(selector + ' option').evaluateAll(opts => opts.map(o => (o as HTMLOptionElement).value))).sort()).toEqual(ids);
        expect(ids).toContain(pair.to);
    });
});
test("PB-12 Transfer 12.34 with ledger conservation", async ({ pair, overview, transfer }) => { await test.step("Transfer 12.34 with ledger conservation", async () => { const before = await overview.snapshot(); await transfer.send(pair.from, pair.to, cents(1234)); assertTransfer(before, await overview.snapshot(), pair.from, pair.to, cents(1234)); }); });
test("PB-13 Transfer one cent precisely", async ({ pair, overview, transfer }) => { await test.step("Transfer one cent precisely", async () => { const before = await overview.snapshot(); await transfer.send(pair.from, pair.to, cents(1)); assertTransfer(before, await overview.snapshot(), pair.from, pair.to, cents(1)); }); });
test("PB-14 Transfer and reverse to original balances", async ({ pair, overview, transfer }) => { await test.step("Transfer and reverse to original balances", async () => { const before = await overview.snapshot(); await transfer.send(pair.from, pair.to, cents(123)); const middle = await overview.snapshot(); assertTransfer(before, middle, pair.from, pair.to, cents(123)); await transfer.send(pair.to, pair.from, cents(123)); const after = await overview.snapshot(); assertTransfer(middle, after, pair.to, pair.from, cents(123)); expect(after).toEqual(before); }); });
test("PB-15 Transfer debit and credit transaction details", async ({ pair, transfer, activity }) => { await test.step("Transfer debit and credit transaction details", async () => { await transfer.send(pair.from, pair.to, cents(321)); await activity.open(pair.from); await activity.details(await activity.transaction('Funds Transfer Sent', cents(321), 'Debit'), cents(321), 'Debit'); await activity.open(pair.to); await activity.details(await activity.transaction('Funds Transfer Received', cents(321), 'Credit'), cents(321), 'Credit'); }); });
