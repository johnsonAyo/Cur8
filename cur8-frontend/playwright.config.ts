import { defineConfig } from '@playwright/test';

const FRONTEND_PORT = 3001;
const FRONTEND_BASE_URL = `http://localhost:${FRONTEND_PORT}`;

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    retries: 1,
    timeout: 30_000,
    use: {
        baseURL: FRONTEND_BASE_URL,
        headless: true,
    },
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' },
        },
    ],
    webServer: {
        command: `npm run dev`,
        url: FRONTEND_BASE_URL,
        reuseExistingServer: true,
        timeout: 15_000,
    },
});
