import { Cents } from '../money/cents';
export interface AccountSnapshot {
    id: string;
    balance: Cents;
    available: Cents;
}
export type Ledger = Record<string, AccountSnapshot>;
export function total(ledger: Ledger): number { return Object.values(ledger).reduce((n, a) => n + a.balance, 0); }
export function account(ledger: Ledger, id: string): AccountSnapshot {
    const result = ledger[id];
    if (!result)
        throw new Error(`Owned account ${id} missing from overview`);
    return result;
}
