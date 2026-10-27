import { expect } from '@playwright/test';
import { BankPage } from '../shared/bank-page';
import { Ledger } from '../../domain/ledger/account';
import { parseMoney } from '../../domain/money/cents';
export class OverviewPage extends BankPage {
    async open() { await this.go('overview.htm'); await this.heading('Accounts Overview'); await expect(this.content.locator('#accountTable tbody a').first()).toBeVisible(); }
    async snapshot(): Promise<Ledger> {
        await this.open();
        const rows = this.content.locator('#accountTable tbody tr').filter({ has: this.page.locator('a[href*="activity.htm"]') });
        const result: Ledger = {};
        for (const row of await rows.all()) {
            const cells = row.locator('td');
            const id = (await cells.nth(0).innerText()).trim();
            if (!/^\d+$/.test(id) || result[id])
                throw new Error('Invalid/duplicate account ID');
            result[id] = { id, balance: parseMoney(await cells.nth(1).innerText()), available: parseMoney(await cells.nth(2).innerText()) };
        }
        return result;
    }
    async displayedTotal() { return parseMoney(await this.content.locator('#accountTable tbody tr').filter({ hasText: 'Total' }).locator('td').nth(1).innerText()); }
}
