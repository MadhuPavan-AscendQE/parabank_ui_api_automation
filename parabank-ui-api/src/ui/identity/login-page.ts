import { BankPage } from '../shared/bank-page';
export class LoginPage extends BankPage {
    async login(username: string, password: string) { await this.go('index.htm'); const panel = this.page.locator('#loginPanel'); await panel.locator('[name="username"]').fill(username); await panel.locator('[name="password"]').fill(password); await panel.getByRole('button', { name: 'Log In', exact: true }).click(); }
}
