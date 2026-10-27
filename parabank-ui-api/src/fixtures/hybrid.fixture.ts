import { request } from '@playwright/test';
import { test as ui, expect } from './bank.fixture';
import { BankHttp } from '../api/transport/bank-http';
import { OwnedBank } from '../api/services/owned-bank';
import { apiBase, proxy } from '../config/environment';
export const test = ui.extend<{
    bank: OwnedBank;
}>({ bank: async ({ customer }, use, info) => { const context = await request.newContext({ baseURL: apiBase, proxy }); const http = new BankHttp(context); try {
        await use(await OwnedBank.login(http, customer));
    }
    finally {
        await info.attach('api-summary', { body: JSON.stringify(http.evidence), contentType: 'application/json' });
        await context.dispose();
    } } });
export { expect };
