import { expect } from '@playwright/test';
import { BankPage } from '../shared/bank-page';
import { Cents, amountInput, parseMoney } from '../../domain/money/cents';
export class TransferPage extends BankPage {
    async open() { await this.go('transfer.htm'); await this.heading('Transfer Funds'); await expect(this.page.locator('#fromAccountId option').first()).toHaveAttribute('value', /^\d+$/); }
    async send(from: string, to: string, amount: Cents) {
        if (from === to || amount <= 0)
            throw new Error('Use distinct owned accounts and positive amount');
        await this.open();
        await this.page.locator('#amount').fill(amountInput(amount));
        await this.page.locator('#fromAccountId').selectOption(from);
        await this.page.locator('#toAccountId').selectOption(to);
        await this.content.getByRole('button', { name: 'Transfer', exact: true }).click();
        await this.heading('Transfer Complete!');
        await expect(this.page.locator('#fromAccountIdResult')).toHaveText(from);
        await expect(this.page.locator('#toAccountIdResult')).toHaveText(to);
        expect(parseMoney(await this.page.locator('#amountResult').innerText())).toBe(amount);
    }
}
