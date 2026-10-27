import { test as base, expect } from '@playwright/test';
import { customerData, Customer } from '../data/customer.factory';
import { RegistrationPage } from '../ui/identity/registration-page';
import { LoginPage } from '../ui/identity/login-page';
import { OverviewPage } from '../ui/accounts/overview-page';
import { OpenAccountPage } from '../ui/accounts/open-account-page';
import { ActivityPage } from '../ui/accounts/activity-page';
import { TransferPage } from '../ui/transfers/transfer-page';
import { BillPayPage } from '../ui/payments/bill-pay-page';
import { ProfilePage } from '../ui/profile/profile-page';
import { createPair } from '../workflows/owned-accounts';
type Fixtures = {
    registration: RegistrationPage;
    login: LoginPage;
    overview: OverviewPage;
    opening: OpenAccountPage;
    activity: ActivityPage;
    transfer: TransferPage;
    bill: BillPayPage;
    profile: ProfilePage;
    customer: Customer;
    pair: {
        from: string;
        to: string;
    };
};
export const test = base.extend<Fixtures>({ registration: async ({ page }, use) => use(new RegistrationPage(page)), login: async ({ page }, use) => use(new LoginPage(page)), overview: async ({ page }, use) => use(new OverviewPage(page)), opening: async ({ page }, use) => use(new OpenAccountPage(page)), activity: async ({ page }, use) => use(new ActivityPage(page)), transfer: async ({ page }, use) => use(new TransferPage(page)), bill: async ({ page }, use) => use(new BillPayPage(page)), profile: async ({ page }, use) => use(new ProfilePage(page)), customer: async ({ registration }, use, testInfo) => { const c = customerData(); await test.step('Register unique synthetic customer through UI', () => registration.register(c)); await testInfo.attach('owned-customer', { body: JSON.stringify({ username: c.username, cleanup: 'No customer-delete UI; no shared reset attempted.' }), contentType: 'application/json' }); await use(c); }, pair: async ({ customer, overview, opening }, use) => { void customer; await use(await test.step('Create owned account pair through UI', () => createPair(overview, opening))); } });
export { expect };
