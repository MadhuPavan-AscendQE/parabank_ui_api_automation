import { APIRequestContext, expect } from '@playwright/test';
import { Customer } from '../../data/customer.factory';
import { uiBase } from '../../config/environment';
// Web form HTTP setup, not a REST registration endpoint and not a browser test.
export async function registerHttp(context: APIRequestContext, c: Customer) { const url = new URL('register.htm', uiBase).href; let r; try {
    await context.get(url, { timeout: 20000 });
    r = await context.post(url, { timeout: 20000, maxRetries: 0, form: { 'customer.firstName': c.firstName, 'customer.lastName': c.lastName, 'customer.address.street': c.street, 'customer.address.city': c.city, 'customer.address.state': c.state, 'customer.address.zipCode': c.zipCode, 'customer.phoneNumber': c.phoneNumber, 'customer.ssn': c.ssn, 'customer.username': c.username, 'customer.password': c.password, repeatedPassword: c.password } });
}
catch {
    throw new Error('Synthetic web-form setup failed (request details redacted)');
} expect(r.status(), 'registration HTTP status').toBe(200); expect(await r.text(), 'registration welcome').toContain(`Welcome ${c.username}`); }
