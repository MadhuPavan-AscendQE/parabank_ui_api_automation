import { expect } from '@playwright/test';
import { OverviewPage } from '../ui/accounts/overview-page';
import { OpenAccountPage } from '../ui/accounts/open-account-page';
import { total, account } from '../domain/ledger/account';
export async function createPair(overview: OverviewPage, opening: OpenAccountPage) { const before = await overview.snapshot(); const ids = Object.keys(before); expect(ids, 'Fresh customer has exactly one initial account').toHaveLength(1); const from = ids[0]; const to = await opening.create(from, 'SAVINGS'); const after = await overview.snapshot(); expect(Object.keys(after)).toHaveLength(2); expect(to).not.toBe(from); expect(total(after)).toBe(total(before)); expect(account(after, from).balance, 'Demo funding prerequisite').toBeGreaterThan(2000); return { from, to }; }
