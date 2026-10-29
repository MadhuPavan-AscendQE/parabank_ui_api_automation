import { test, expect } from '../../../src/fixtures/bank.fixture';
import { account } from '../../../src/domain/ledger/account';
import { customerData } from '../../../src/data/customer.factory';

test.describe('ParaBank Identity', () => {
    test("PB-01 Required registration fields", async ({ registration }) => {
        await test.step("Required registration fields", async () => {
            await registration.open();
            await registration.submit();
            for (const t of ['First name is required.', 'Last name is required.', 'Address is required.', 'City is required.', 'State is required.', 'Zip Code is required.', 'Social Security Number is required.', 'Username is required.', 'Password is required.', 'Password confirmation is required.'])
                await expect(registration.content.getByText(t, { exact: true })).toBeVisible();
        });
    });

    test("PB-02 Password confirmation mismatch", async ({ registration }) => {
        await test.step("Password confirmation mismatch", async () => {
            await registration.open();
            await registration.fill(customerData());
            await registration.field('repeatedPassword').fill('WrongConfirmation');
            await registration.submit();
            await expect(registration.content.getByText('Passwords did not match.', { exact: true })).toBeVisible();
        });
    });

    test("PB-03 Empty login validation", async ({ login }) => {
        await test.step("Empty login validation", async () => {
            await login.login('', '');
            await expect(login.content.locator('.error')).toContainText('Please enter a username and password.');
        });
    });

    test("PB-04 Register and reach account services", async ({ customer, registration }) => {
        await test.step("Register and reach account services", async () => {
            await registration.heading(`Welcome ${customer.username}`);
            await registration.expectAccountServicesMenu();
        });
    });

    test("PB-05 Logout and sign back in", async ({ customer, registration, login, overview }) => {
        await test.step("Logout and sign back in", async () => {
            await registration.logout();
            await login.login(customer.username, customer.password);
            const ledger = await overview.snapshot();
            expect(Object.keys(ledger)).toHaveLength(1);
        });
    });

    test("PB-06 Wrong password for owned customer", async ({ customer, registration, login }) => {
        await test.step("Wrong password for owned customer", async () => {
            await registration.logout();
            await login.login(customer.username, 'DefinitelyWrong!');
            await expect(login.content.locator('.error')).toContainText('The username and password could not be verified.');
        });
    });

    test('PB-07 Validate the user registration (sign-up) flow', async ({ login, registration }) => {
        const unique = customerData();
        const customer = {
            ...unique,
            firstName: 'Kevin',
            lastName: 'Master',
            street: 'Tarus Tower',
            city: 'Hyderabad',
            state: 'Telangana',
            zipCode: '500079',
            phoneNumber: '9876789876',
            ssn: '12345',
            username: `Kevin_M_${unique.username.slice(-6)}`,
            password: 'Kevin@M123'
        };

        await test.step('Open ParaBank home page', async () => {
            await login.open();
            await login.expectHomePage();
        });

        await test.step('Open the registration form from the Customer Login panel', async () => {
            await login.goToRegistration();
            await registration.expectRegistrationForm();
        });

        await test.step('Enter the registration details and verify the form values', async () => {
            await registration.fill(customer);
            await registration.expectFilledValues(customer);
        });

        await test.step('Submit the registration form and verify automatic login', async () => {
            await registration.submit();
            await registration.expectRegistrationSuccess(customer);
        });
    });
});
