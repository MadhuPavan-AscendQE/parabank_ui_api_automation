import { test, expect } from '../../../src/fixtures/bank.fixture';
import { account, total } from '../../../src/domain/ledger/account';
test("PB-07 Overview aggregate and available balance", async ({ customer, overview }) => {
    await test.step("Overview aggregate and available balance", async () => {
        void customer;
        const s = await overview.snapshot();
        expect(await overview.displayedTotal()).toBe(total(s));
        for (const a of Object.values(s))
            expect(a.available).toBe(Math.max(0, a.balance));
    });
});
test("PB-08 Account details match overview", async ({ customer, overview, activity }) => { await test.step("Account details match overview", async () => { void customer; const s = await overview.snapshot(); const a = Object.values(s)[0]; await activity.open(a.id); expect(await activity.balance()).toBe(a.balance); }); });
test("PB-09 Open CHECKING and conserve funds", async ({ customer, overview, opening, activity, page }) => { await test.step("Open CHECKING and conserve funds", async () => { void customer; const before = await overview.snapshot(); const from = Object.keys(before)[0]; const id = await opening.create(from, 'CHECKING'); const after = await overview.snapshot(); expect(Object.keys(after)).toHaveLength(Object.keys(before).length + 1); expect(before[id]).toBeUndefined(); expect(total(after)).toBe(total(before)); expect(account(after, id).balance).toBeGreaterThan(0); expect(account(before, from).balance - account(after, from).balance).toBe(account(after, id).balance); await activity.open(id); await expect(page.locator('#accountType')).toHaveText('CHECKING'); }); });
test("PB-10 Open SAVINGS and conserve funds", async ({ customer, overview, opening, activity, page }) => { await test.step("Open SAVINGS and conserve funds", async () => { void customer; const before = await overview.snapshot(); const from = Object.keys(before)[0]; const id = await opening.create(from, 'SAVINGS'); const after = await overview.snapshot(); expect(Object.keys(after)).toHaveLength(Object.keys(before).length + 1); expect(before[id]).toBeUndefined(); expect(total(after)).toBe(total(before)); expect(account(after, id).balance).toBeGreaterThan(0); expect(account(before, from).balance - account(after, from).balance).toBe(account(after, id).balance); await activity.open(id); await expect(page.locator('#accountType')).toHaveText('SAVINGS'); }); });
