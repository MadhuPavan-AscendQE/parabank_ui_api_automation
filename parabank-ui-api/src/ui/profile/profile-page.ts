import { expect } from '@playwright/test';
import { BankPage } from '../shared/bank-page';
export class ProfilePage extends BankPage {
    async open(firstName: string) { await this.go('updateprofile.htm'); await this.heading('Update Profile'); await expect(this.field('customer.firstName')).toHaveValue(firstName); }
    async save() { await this.content.getByRole('button', { name: 'Update Profile', exact: true }).click(); }
}
