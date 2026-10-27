import { expect } from '@playwright/test';
import { BankPage } from '../shared/bank-page';
export class OpenAccountPage extends BankPage {
    async create(from: string, type: 'CHECKING' | 'SAVINGS') { await this.go('openaccount.htm'); await this.heading('Open New Account'); await expect(this.page.locator('#fromAccountId option[value="' + from + '"]')).toHaveCount(1); await this.page.locator('#type').selectOption({ label: type }); await this.page.locator('#fromAccountId').selectOption(from); await this.content.getByRole('button', { name: 'Open New Account', exact: true }).click(); await this.heading('Account Opened!'); await expect(this.page.locator('#newAccountId')).toHaveText(/^\d+$/); return (await this.page.locator('#newAccountId').innerText()).trim(); }
}
