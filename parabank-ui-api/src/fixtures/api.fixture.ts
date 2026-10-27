import { test as base, expect, request } from '@playwright/test';
import { apiBase, proxy } from '../config/environment';
import { customerData, Customer } from '../data/customer.factory';
import { BankHttp } from '../api/transport/bank-http';
import { OwnedBank } from '../api/services/owned-bank';
import { registerHttp } from '../api/setup/register-http';
type Fixtures = {
    apiCustomer: Customer;
    bank: OwnedBank;
};
export const test = base.extend<Fixtures>({ apiCustomer: async ({}, use) => { await use(customerData()); }, bank: async ({ apiCustomer }, use, info) => { const context = await request.newContext({ baseURL: apiBase, proxy }); const http = new BankHttp(context); try {
        await info.attach('synthetic-owner', { body: JSON.stringify({ username: apiCustomer.username, cleanup: 'No per-customer delete endpoint' }), contentType: 'application/json' });
        await registerHttp(context, apiCustomer);
        const bank = await OwnedBank.login(http, apiCustomer);
        await use(bank);
    }
    finally {
        await info.attach('api-summary', { body: JSON.stringify({ calls: http.evidence, cleanup: 'No per-customer delete endpoint; no global reset used.' }), contentType: 'application/json' });
        await context.dispose();
    } } });
export { expect };
