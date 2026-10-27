import { expect } from '@playwright/test';
import { BankPage } from '../shared/bank-page';
import { Cents, amountInput, parseMoney } from '../../domain/money/cents';
import { payee } from '../../data/payee.factory';
export class BillPayPage extends BankPage {
    async open() { await this.go('billpay.htm'); await this.heading('Bill Payment Service'); }
    async fill(from: string, amount: Cents) {
        const values: Record<string, string> = { 'payee.name': payee.name, 'payee.address.street': payee.street, 'payee.address.city': payee.city, 'payee.address.state': payee.state, 'payee.address.zipCode': payee.zipCode, 'payee.phoneNumber': payee.phoneNumber, 'payee.accountNumber': payee.accountNumber, verifyAccount: payee.accountNumber, amount: amountInput(amount) };
        for (const [name, value] of Object.entries(values))
            await this.field(name).fill(value);
        await this.field('fromAccountId').selectOption(from);
    }
    async submit() { await this.content.getByRole('button', { name: 'Send Payment', exact: true }).click(); }
    async pay(from: string, amount: Cents) { await this.open(); await this.fill(from, amount); await this.submit(); await this.heading('Bill Payment Complete'); const result = this.page.locator('#billpayResult'); await expect(result.locator('#payeeName')).toHaveText(payee.name); await expect(result.locator('#fromAccountId')).toHaveText(from); expect(parseMoney(await result.locator('#amount').innerText())).toBe(amount); }
}
