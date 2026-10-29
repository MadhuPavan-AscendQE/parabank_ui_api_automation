import { expect } from '@playwright/test';
import { BankPage } from '../shared/bank-page';
export class LoginPage extends BankPage {
    readonly panel = this.page.locator('#loginPanel').describe('Customer Login panel on the ParaBank home page');
    readonly loginButton = this.panel.getByRole('button', { name: 'Log In', exact: true }).describe('Log In button in the Customer Login panel');
    readonly forgotLoginInfoLink = this.panel.getByRole('link', { name: 'Forgot login info?', exact: true }).describe('Forgot login info link in the Customer Login panel');
    readonly registerLink = this.panel.getByRole('link', { name: 'Register', exact: true }).describe('Register link in the Customer Login panel');
    async open() { await this.go('index.htm'); }
    async expectHomePage() {
        await expect(this.page).toHaveTitle('ParaBank | Welcome | Online Banking');
        await expect(this.page).toHaveURL(/index\.htm$/);
        await expect(this.panel).toBeVisible();
        await expect(this.panel.locator('[name="username"]').describe('Username input in the Customer Login panel')).toBeVisible();
        await expect(this.panel.locator('[name="password"]').describe('Password input in the Customer Login panel')).toBeVisible();
        await expect(this.loginButton).toBeVisible();
        await expect(this.forgotLoginInfoLink).toBeVisible();
        await expect(this.registerLink).toBeVisible();
    }
    async goToRegistration() { await this.registerLink.click(); }
    async login(username: string, password: string) { await this.open(); await this.panel.locator('[name="username"]').describe('Username input in the Customer Login panel').fill(username); await this.panel.locator('[name="password"]').describe('Password input in the Customer Login panel').fill(password); await this.loginButton.click(); }
}
