import { expect } from '@playwright/test';
import { ApiAccount, ApiCustomer, ApiTransaction, ApiBill } from './models';
import { cents, Cents } from '../../domain/money/cents';
export function apiCents(value: number): Cents { if (typeof value !== 'number' || !Number.isFinite(value))
    throw new Error('API money must be finite number'); const m = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(String(value)); if (!m)
    throw new Error('API money has unsupported precision or magnitude'); return cents((m[1] ? -1 : 1) * (Number(m[2]) * 100 + Number((m[3] || '').padEnd(2, '0')))); }
function id(value: unknown) { expect(Number.isSafeInteger(value)).toBe(true); expect(value).toBeGreaterThan(0); }
export function customer(v: any): ApiCustomer { id(v.id); for (const k of ['firstName', 'lastName', 'phoneNumber', 'ssn'])
    expect(typeof v[k]).toBe('string'); for (const k of ['street', 'city', 'state', 'zipCode'])
    expect(typeof v.address?.[k]).toBe('string'); expect(v.password).toBeUndefined(); expect(v.username).toBeUndefined(); return v; }
export function account(v: any): ApiAccount { id(v.id); id(v.customerId); expect(['CHECKING', 'SAVINGS', 'LOAN']).toContain(v.type); apiCents(v.balance); return v; }
export function transaction(v: any): ApiTransaction { id(v.id); id(v.accountId); expect(['Debit', 'Credit']).toContain(v.type); expect(['string', 'number']).toContain(typeof v.description); expect(typeof v.date).toBe('string'); expect(v.date).toMatch(/^\d{4}-\d{2}-\d{2}T/); expect(Number.isFinite(Date.parse(v.date))).toBe(true); apiCents(v.amount); return { ...v, description: String(v.description) }; }
export function bill(v: any): ApiBill { id(v.accountId); apiCents(v.amount); expect(typeof v.payeeName).toBe('string'); return v; }
