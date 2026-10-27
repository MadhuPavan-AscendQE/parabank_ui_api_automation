export const uiBase = (process.env.BASE_URL || 'https://parabank.parasoft.com/parabank/').replace(/\/?$/, '/');
export const apiBase = (process.env.API_BASE_URL || new URL('services/bank/', uiBase).href).replace(/\/?$/, '/');
export const proxy = process.env.TEST_PROXY ? { server: process.env.TEST_PROXY } : undefined;
