import { APIRequestContext, expect } from '@playwright/test';
export type CallRecord = {
    operation: string;
    method: string;
    status: number;
};
export class BankHttp {
    readonly evidence: CallRecord[] = [];
    constructor(private readonly context: APIRequestContext) { }
    async response(operation: string, path: string, method: 'GET' | 'POST' = 'GET', params?: Record<string, string | number>, data?: unknown, accept = 'application/json') { let response; try {
        response = await this.context.fetch(path, { method, params, data, timeout: 20000, maxRetries: 0, headers: { Accept: accept } });
    }
    catch {
        throw new Error(`Transport failed for ${operation}; inspect network/environment (URL and credentials redacted)`);
    } this.evidence.push({ operation, method, status: response.status() }); return response; }
    async json(operation: string, path: string, method: 'GET' | 'POST' = 'GET', params?: Record<string, string | number>, data?: unknown): Promise<any> { const r = await this.response(operation, path, method, params, data); expect(r.status(), operation + ' HTTP status').toBe(200); expect(r.headers()['content-type'], operation + ' content type').toMatch(/application\/json/i); return r.json(); }
    async message(operation: string, path: string, params: Record<string, string | number>, expected: RegExp) { const r = await this.response(operation, path, 'POST', params); expect(r.status(), operation + ' HTTP status').toBe(200); expect(await r.text(), operation + ' acknowledgement').toMatch(expected); }
}
