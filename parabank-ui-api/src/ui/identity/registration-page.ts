import { expect } from '@playwright/test';
import { BankPage } from '../shared/bank-page';
import { Customer } from '../../data/customer.factory';
export class RegistrationPage extends BankPage {
    async open() { await this.go('register.htm'); await this.heading('Signing up is easy!'); }
    async fill(c: Customer) {
        const fields: Record<string, string> = { 'customer.firstName': c.firstName, 'customer.lastName': c.lastName, 'customer.address.street': c.street, 'customer.address.city': c.city, 'customer.address.state': c.state, 'customer.address.zipCode': c.zipCode, 'customer.phoneNumber': c.phoneNumber, 'customer.ssn': c.ssn, 'customer.username': c.username, 'customer.password': c.password, repeatedPassword: c.password };
        for (const [name, value] of Object.entries(fields))
            await this.field(name).fill(value);
    }
    async submit() { await this.content.getByRole('button', { name: 'Register', exact: true }).click(); }
    async register(c: Customer) { await this.open(); await this.fill(c); await this.submit(); await this.heading(`Welcome ${c.username}`); await expect(this.page.locator('#leftPanel').getByRole('link', { name: 'Log Out', exact: true })).toBeVisible(); }
}
