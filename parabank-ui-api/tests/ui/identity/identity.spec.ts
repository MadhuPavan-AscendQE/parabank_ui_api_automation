import { test, expect } from '../../../src/fixtures/bank.fixture';
import { account } from '../../../src/domain/ledger/account';
import { customerData } from '../../../src/data/customer.factory';
test("PB-01 Required registration fields", async ({ registration }) => {
    await test.step("Required registration fields", async () => {
        await registration.open();
        await registration.submit();
        for (const t of ['First name is required.', 'Last name is required.', 'Address is required.', 'City is required.', 'State is required.', 'Zip Code is required.', 'Social Security Number is required.', 'Username is required.', 'Password is required.', 'Password confirmation is required.'])
            await expect(registration.content.getByText(t, { exact: true })).toBeVisible();
    });
});
test("PB-02 Password confirmation mismatch", async ({ registration }) => { await test.step("Password confirmation mismatch", async () => { await registration.open(); await registration.fill(customerData()); await registration.field('repeatedPassword').fill('WrongConfirmation'); await registration.submit(); await expect(registration.content.getByText('Passwords did not match.', { exact: true })).toBeVisible(); }); });
test("PB-03 Empty login validation", async ({ login, page }) => { await test.step("Empty login validation", async () => { await login.login('', ''); await expect(login.content.locator('.error')).toContainText('Please enter a username and password.'); }); });
test("PB-04 Register and reach account services", async ({ customer, registration, page }) => { await test.step("Register and reach account services", async () => { await registration.heading(`Welcome ${customer.username}`); await expect(page.locator('#leftPanel').getByRole('link', { name: 'Accounts Overview', exact: true })).toBeVisible(); }); });
test("PB-05 Logout and sign back in", async ({ customer, registration, login, overview }) => { await test.step("Logout and sign back in", async () => { await registration.logout(); await login.login(customer.username, customer.password); const ledger = await overview.snapshot(); expect(Object.keys(ledger)).toHaveLength(1); }); });
test("PB-06 Wrong password for owned customer", async ({ customer, registration, login }) => { await test.step("Wrong password for owned customer", async () => { await registration.logout(); await login.login(customer.username, 'DefinitelyWrong!'); await expect(login.content.locator('.error')).toContainText('The username and password could not be verified.'); }); });
