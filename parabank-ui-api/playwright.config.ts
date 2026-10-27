import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { uiBase, proxy } from './src/config/environment';
export default defineConfig({ testDir: './tests', workers: 1, fullyParallel: false, retries: 0, timeout: 120000, expect: { timeout: 15000 }, forbidOnly: !!process.env.CI, reporter: [['list'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/results.xml' }]], use: { baseURL: uiBase, trace: 'off', screenshot: 'off', video: 'off', proxy }, projects: [{ name: 'api', testMatch: '**/api/**/*.spec.ts' }, { name: 'ui', testMatch: '**/ui/**/*.spec.ts', use: { ...devices['Desktop Chrome'], browserName: 'chromium' } }, { name: 'e2e', testMatch: '**/e2e/**/*.spec.ts', use: { ...devices['Desktop Chrome'], browserName: 'chromium' } }] });
