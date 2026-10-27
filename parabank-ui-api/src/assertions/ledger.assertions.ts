import { expect } from '@playwright/test';
import { Ledger, account, total } from '../domain/ledger/account';
import { Cents } from '../domain/money/cents';
export function assertTransfer(before: Ledger, after: Ledger, from: string, to: string, amount: Cents) {
    expect(from).not.toBe(to);
    expect(Object.keys(after).sort()).toEqual(Object.keys(before).sort());
    expect(account(after, from).balance).toBe(account(before, from).balance - amount);
    expect(account(after, to).balance).toBe(account(before, to).balance + amount);
    for (const id of Object.keys(before)) {
        if (id !== from && id !== to)
            expect(after[id]).toEqual(before[id]);
    }
    expect(total(after)).toBe(total(before));
}
export function assertDebit(before: Ledger, after: Ledger, from: string, amount: Cents) {
    expect(Object.keys(after).sort()).toEqual(Object.keys(before).sort());
    expect(account(after, from).balance).toBe(account(before, from).balance - amount);
    for (const id of Object.keys(before)) {
        if (id !== from)
            expect(after[id]).toEqual(before[id]);
    }
    expect(total(after)).toBe(total(before) - amount);
}
