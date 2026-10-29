import { expect, Locator } from '@playwright/test';
import { BankPage } from '../shared/bank-page';
import { Customer } from '../../data/customer.factory';
export class RegistrationPage extends BankPage {
    readonly registerButton = this.content.getByRole('button', { name: 'Register', exact: true }).describe('Register button that submits the new customer registration form');
    field(name: string) { return super.field(name).describe(`Registration form field ${name}`); }
    async open() { await this.go('register.htm'); await this.expectRegistrationForm(); }
    registrationFields() {
        return {
            firstName: this.field('customer.firstName'),
            lastName: this.field('customer.lastName'),
            address: this.field('customer.address.street'),
            city: this.field('customer.address.city'),
            state: this.field('customer.address.state'),
            zipCode: this.field('customer.address.zipCode'),
            phoneNumber: this.field('customer.phoneNumber'),
            ssn: this.field('customer.ssn'),
            username: this.field('customer.username'),
            password: this.field('customer.password'),
            confirm: this.field('repeatedPassword')
        };
    }
    async expectRegistrationForm() {
        await this.heading('Signing up is easy!');
        await expect(this.page).toHaveTitle('ParaBank | Register for Free Online Account Access');
        await expect(this.page).toHaveURL(/register\.htm/);
        for (const input of Object.values(this.registrationFields()))
            await expect(input).toBeVisible();
        await expect(this.registerButton).toBeVisible();
    }
    async fill(c: Customer) {
        const fields: Record<string, string> = { 'customer.firstName': c.firstName, 'customer.lastName': c.lastName, 'customer.address.street': c.street, 'customer.address.city': c.city, 'customer.address.state': c.state, 'customer.address.zipCode': c.zipCode, 'customer.phoneNumber': c.phoneNumber, 'customer.ssn': c.ssn, 'customer.username': c.username, 'customer.password': c.password, repeatedPassword: c.password };
        for (const [name, value] of Object.entries(fields))
            await this.field(name).fill(value);
    }
    async expectFilledValues(c: Customer) {
        const fields = this.registrationFields();
        await expect(fields.firstName).toHaveValue(c.firstName);
        await expect(fields.lastName).toHaveValue(c.lastName);
        await expect(fields.address).toHaveValue(c.street);
        await expect(fields.city).toHaveValue(c.city);
        await expect(fields.state).toHaveValue(c.state);
        await expect(fields.zipCode).toHaveValue(c.zipCode);
        await expect(fields.phoneNumber).toHaveValue(c.phoneNumber);
        await expect(fields.ssn).toHaveValue(c.ssn);
        await expect(fields.username).toHaveValue(c.username);
        await this.expectMaskedValue(fields.password, c.password);
        await this.expectMaskedValue(fields.confirm, c.password);
    }
    async expectMaskedValue(field: Locator, value: string) {
        await expect(field).toHaveAttribute('type', 'password');
        await expect(field).toHaveValue(value);
    }
    async submit() { await this.registerButton.click(); }
    async expectRegistrationSuccess(c: Customer) {
        await this.heading(`Welcome ${c.username}`);
        await expect(this.page).toHaveTitle('ParaBank | Customer Created');
        await expect(this.page).toHaveURL(/register\.htm/);
        await expect(this.content.getByText('Your account was created successfully. You are now logged in.', { exact: true })).toBeVisible();
        await this.expectAccountServicesMenu();
    }
    async expectAccountServicesMenu() {
        for (const service of ['Open New Account', 'Accounts Overview', 'Transfer Funds', 'Bill Pay', 'Find Transactions', 'Update Contact Info', 'Request Loan', 'Log Out'])
            await expect(this.page.locator('#leftPanel').getByRole('link', { name: service, exact: true }).describe(`Account Services link for ${service}`)).toBeVisible();
    }
    async register(c: Customer) { await this.open(); await this.fill(c); await this.submit(); await this.expectRegistrationSuccess(c); }
}
