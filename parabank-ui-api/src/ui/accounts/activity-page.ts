import { expect, Locator } from '@playwright/test';
import { BankPage } from '../shared/bank-page';
import { parseMoney, Cents } from '../../domain/money/cents';
export class ActivityPage extends BankPage {
    async open(id: string) { await this.go(`activity.htm?id=${encodeURIComponent(id)}`); await expect(this.page.locator('#accountId')).toHaveText(id); await expect(this.page.locator('#balance')).toHaveText(/\$.*\d/); }
    async balance() { return parseMoney(await this.page.locator('#balance').innerText()); }
    async transaction(description: string, amount: Cents, type: 'Debit' | 'Credit'): Promise<Locator> {
        const rows = this.page.locator('#transactionTable tbody tr').filter({ hasText: description });
        await expect.poll(async () => rows.count()).toBeGreaterThan(0);
        const column = type === 'Debit' ? 2 : 3;
        const matches: Locator[] = [];
        for (const row of await rows.all()) {
            const text = (await row.locator('td').nth(column).innerText()).trim();
            if (text && parseMoney(text) === amount)
                matches.push(row);
        }
        expect(matches, 'Unique owned transaction with matching amount').toHaveLength(1);
        return matches[0];
    }
    async details(row: Locator, amount: Cents, type: 'Debit' | 'Credit') {
        const link = row.getByRole('link');
        const href = await link.getAttribute('href');
        if (!href)
            throw new Error('Transaction link missing');
        const id = new URL(href, this.page.url()).searchParams.get('id');
        await link.click();
        await this.heading('Transaction Details');
        const table = this.content.locator('table');
        await expect(table.locator('tr').filter({ hasText: 'Transaction ID:' }).locator('td').nth(1)).toHaveText(id!);
        await expect(table.locator('tr').filter({ hasText: 'Type:' }).locator('td').nth(1)).toHaveText(type);
        expect(parseMoney(await table.locator('tr').filter({ hasText: 'Amount:' }).locator('td').nth(1).innerText())).toBe(amount);
    }
}
