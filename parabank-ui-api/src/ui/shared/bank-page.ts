import { Page, expect } from '@playwright/test';
export class BankPage {
    constructor(readonly page: Page) { }
    get content() { return this.page.locator('#rightPanel'); }
    field(name: string) { return this.content.locator(`[name="${name}"]`); }
    async go(route: string) { await this.page.goto(route, { waitUntil: 'domcontentloaded' }); }
    async heading(name: string) { await expect(this.content.getByRole('heading', { name, exact: true })).toBeVisible(); }
    async service(name: string) { await this.page.locator('#leftPanel').getByRole('link', { name, exact: true }).click(); }
    async logout() { await this.service('Log Out'); await expect(this.page.locator('#loginPanel input[name="username"]')).toBeVisible(); }
}
