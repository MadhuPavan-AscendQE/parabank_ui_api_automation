import { randomUUID } from 'node:crypto';
import { test, expect } from '../../../src/fixtures/bank.fixture';
import { account } from '../../../src/domain/ledger/account';
import { customerData, Customer } from '../../../src/data/customer.factory';

function tc01Customer(): Customer {
    const suffix = randomUUID().replace(/-/g, '').slice(0, 8);
    return {
        firstName: 'Kevin',
        lastName: 'Master',
        street: 'Tarus Tower',
        city: 'Hyderabad',
        state: 'Telangana',
        zipCode: '500079',
        phoneNumber: '9876789876',
        ssn: '12345',
        username: `Kevin_M_${suffix}`,
        password: 'Kevin@M123'
    };
}

test.describe('Identity', () => {
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
    test('PB-07 Register a new user from the login panel and log in automatically', async ({ page, registration }) => {
        const customer = tc01Customer();
        const loginPanel = page.locator('#loginPanel').describe('Customer Login panel on the ParaBank home page');
        const registerLink = loginPanel.getByRole('link', { name: 'Register', exact: true }).describe('Register link in the Customer Login panel');
        const servicesPanel = page.locator('#leftPanel').describe('Account Services navigation panel after registration');

        await test.step('Open the ParaBank home page', async () => {
            const loginHeading = loginPanel.getByRole('heading', { name: 'Customer Login', exact: true }).describe('Customer Login heading on the home page');
            const usernameField = loginPanel.locator('[name="username"]').describe('Username textbox in the Customer Login panel');
            const passwordField = loginPanel.locator('[name="password"]').describe('Password textbox in the Customer Login panel');
            const loginButton = loginPanel.getByRole('button', { name: 'Log In', exact: true }).describe('Log In button in the Customer Login panel');
            const forgotLoginInfoLink = loginPanel.getByRole('link', { name: 'Forgot login info?', exact: true }).describe('Forgot login info link in the Customer Login panel');

            await page.goto('index.htm', { waitUntil: 'domcontentloaded' });
            await expect(page).toHaveTitle('ParaBank | Welcome | Online Banking');
            await expect(loginHeading).toBeVisible();
            await expect(usernameField).toBeVisible();
            await expect(passwordField).toBeVisible();
            await expect(loginButton).toBeVisible();
            await expect(forgotLoginInfoLink).toBeVisible();
            await expect(registerLink).toBeVisible();
        });

        await test.step('Open the registration page from the login panel', async () => {
            const firstNameField = registration.field('customer.firstName').describe('First Name textbox in the registration form');
            const lastNameField = registration.field('customer.lastName').describe('Last Name textbox in the registration form');
            const addressField = registration.field('customer.address.street').describe('Address textbox in the registration form');
            const cityField = registration.field('customer.address.city').describe('City textbox in the registration form');
            const stateField = registration.field('customer.address.state').describe('State textbox in the registration form');
            const zipCodeField = registration.field('customer.address.zipCode').describe('Zip Code textbox in the registration form');
            const phoneNumberField = registration.field('customer.phoneNumber').describe('Phone Number textbox in the registration form');
            const ssnField = registration.field('customer.ssn').describe('SSN textbox in the registration form');
            const registrationUsernameField = registration.field('customer.username').describe('Username textbox in the registration form');
            const registrationPasswordField = registration.field('customer.password').describe('Password textbox in the registration form');
            const confirmPasswordField = registration.field('repeatedPassword').describe('Confirm password textbox in the registration form');
            const registerButton = registration.content.getByRole('button', { name: 'Register', exact: true }).describe('Register button in the registration form');

            await registerLink.click();
            await expect(page).toHaveTitle('ParaBank | Register for Free Online Account Access');
            await registration.heading('Signing up is easy!');
            await expect(firstNameField).toBeVisible();
            await expect(lastNameField).toBeVisible();
            await expect(addressField).toBeVisible();
            await expect(cityField).toBeVisible();
            await expect(stateField).toBeVisible();
            await expect(zipCodeField).toBeVisible();
            await expect(phoneNumberField).toBeVisible();
            await expect(ssnField).toBeVisible();
            await expect(registrationUsernameField).toBeVisible();
            await expect(registrationPasswordField).toBeVisible();
            await expect(confirmPasswordField).toBeVisible();
            await expect(registerButton).toBeVisible();
        });

        await test.step('Fill the registration form with valid details', async () => {
            await registration.fill(customer);
            await expect(registration.field('customer.firstName')).toHaveValue(customer.firstName);
            await expect(registration.field('customer.lastName')).toHaveValue(customer.lastName);
            await expect(registration.field('customer.address.street')).toHaveValue(customer.street);
            await expect(registration.field('customer.address.city')).toHaveValue(customer.city);
            await expect(registration.field('customer.address.state')).toHaveValue(customer.state);
            await expect(registration.field('customer.address.zipCode')).toHaveValue(customer.zipCode);
            await expect(registration.field('customer.phoneNumber')).toHaveValue(customer.phoneNumber);
            await expect(registration.field('customer.ssn')).toHaveValue(customer.ssn);
            await expect(registration.field('customer.username')).toHaveValue(customer.username);
            await expect(registration.field('customer.password')).toHaveValue(customer.password);
            await expect(registration.field('repeatedPassword')).toHaveValue(customer.password);
            await expect(registration.field('customer.password')).toHaveAttribute('type', 'password');
            await expect(registration.field('repeatedPassword')).toHaveAttribute('type', 'password');
        });

        await test.step('Submit the registration form', async () => {
            await registration.submit();
            await registration.heading(`Welcome ${customer.username}`);
            await expect(registration.content.getByText('Your account was created successfully. You are now logged in.', { exact: true }).describe('Registration success message after account creation')).toBeVisible();
            await expect(registration.content.getByText(`Welcome ${customer.firstName} ${customer.lastName}`, { exact: true }).describe('Personalized welcome text after registration')).toBeVisible();
            for (const service of ['Open New Account', 'Accounts Overview', 'Transfer Funds', 'Bill Pay', 'Find Transactions', 'Update Contact Info', 'Request Loan', 'Log Out'])
                await expect(servicesPanel.getByRole('link', { name: service, exact: true }).describe(`${service} link in the Account Services menu`)).toBeVisible();
        });
    });
});
