import { expect } from '@playwright/test';
import { BankHttp } from '../transport/bank-http';
import * as validate from '../contracts/validate';
import { ApiCustomer } from '../contracts/models';
import { Customer } from '../../data/customer.factory';
import { Cents, amountInput, cents } from '../../domain/money/cents';
import { Ledger } from '../../domain/ledger/account';
import { payee } from '../../data/payee.factory';
export class OwnedBank {
    private readonly accountsOwned = new Set<number>();
    private readonly transactionsOwned = new Set<number>();
    constructor(readonly http: BankHttp, readonly owner: ApiCustomer) { }
    static async login(http: BankHttp, c: Customer) { const value = validate.customer(await http.json('login', 'login/' + encodeURIComponent(c.username) + '/' + encodeURIComponent(c.password))); expect(value.firstName).toBe(c.firstName); expect(value.lastName).toBe(c.lastName); const bank = new OwnedBank(http, value); await bank.accounts(); return bank; }
    private own(id: number) { if (!this.accountsOwned.has(id))
        throw new Error('Refusing account outside this fixture ownership'); }
    async customer() { return validate.customer(await this.http.json('customer-details', `customers/${this.owner.id}`)); }
    async accounts() { const raw = await this.http.json('customer-accounts', `customers/${this.owner.id}/accounts`); expect(Array.isArray(raw)).toBe(true); const result = (raw as any[]).map(validate.account); expect(new Set(result.map(a => a.id)).size).toBe(result.length); for (const a of result) {
        expect(a.customerId).toBe(this.owner.id);
        this.accountsOwned.add(a.id);
    } return result; }
    async snapshot(): Promise<Ledger> { const result: Ledger = {}; for (const a of await this.accounts()) {
        const balance = validate.apiCents(a.balance);
        result[String(a.id)] = { id: String(a.id), balance, available: cents(Math.max(0, balance)) };
    } return result; }
    async account(id: number) { this.own(id); const a = validate.account(await this.http.json('account-details', `accounts/${id}`)); expect(a.id).toBe(id); expect(a.customerId).toBe(this.owner.id); return a; }
    async create(from: number, type: 0 | 1) { this.own(from); const a = validate.account(await this.http.json('create-account', 'createAccount', 'POST', { customerId: this.owner.id, newAccountType: type, fromAccountId: from })); expect(a.customerId).toBe(this.owner.id); expect(this.accountsOwned.has(a.id)).toBe(false); this.accountsOwned.add(a.id); return a; }
    async deposit(id: number, amount: Cents) { this.own(id); await this.http.message('deposit', 'deposit', { accountId: id, amount: amountInput(amount) }, /Successfully deposited/); }
    async withdraw(id: number, amount: Cents) { this.own(id); await this.http.message('withdraw', 'withdraw', { accountId: id, amount: amountInput(amount) }, /Successfully withdrew/); }
    async transfer(from: number, to: number, amount: Cents) { this.own(from); this.own(to); if (from === to || amount <= 0)
        throw new Error('Baseline transfer requires distinct accounts and positive money'); await this.http.message('transfer', 'transfer', { fromAccountId: from, toAccountId: to, amount: amountInput(amount) }, /Successfully transferred/); }
    async billPay(id: number, amount: Cents) { this.own(id); const result = validate.bill(await this.http.json('bill-payment', 'billpay', 'POST', { accountId: id, amount: amountInput(amount) }, { name: payee.name, address: { street: payee.street, city: payee.city, state: payee.state, zipCode: payee.zipCode }, phoneNumber: payee.phoneNumber, accountNumber: Number(payee.accountNumber) })); expect(result.accountId).toBe(id); expect(result.payeeName).toBe(payee.name); expect(validate.apiCents(result.amount)).toBe(amount); return result; }
    async transactions(id: number, amount?: Cents) { this.own(id); const path = `accounts/${id}/transactions` + (amount === undefined ? '' : `/amount/${amountInput(amount)}`); const raw = await this.http.json('account-transactions', path); expect(Array.isArray(raw)).toBe(true); const result = (raw as any[]).map(validate.transaction); for (const t of result) {
        expect(t.accountId).toBe(id);
        this.transactionsOwned.add(t.id);
    } return result; }
    async transaction(id: number) { if (!this.transactionsOwned.has(id))
        throw new Error('Transaction must originate from owned account history'); const t = validate.transaction(await this.http.json('transaction-details', `transactions/${id}`)); expect(t.id).toBe(id); this.own(t.accountId); return t; }
    async update(c: Customer) { await this.http.message('update-profile', `customers/update/${this.owner.id}`, { firstName: c.firstName, lastName: c.lastName, street: c.street, city: c.city, state: c.state, zipCode: c.zipCode, phoneNumber: c.phoneNumber, ssn: c.ssn, username: c.username, password: c.password }, /Successfully updated customer profile/); }
}
