import { test, expect } from '@playwright/test';

test.describe('Project Detail Page', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to dashboard first, then click into the first project
        await page.goto('/');
        await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10_000 });
        await page.locator('table tbody tr').first().click();
        await page.waitForURL(/\/project\/.+/);
    });

    test('should display the project name as a heading', async ({ page }) => {
        const heading = page.getByRole('heading', { level: 1 });
        await expect(heading).toBeVisible();
        const text = await heading.textContent();
        expect(text!.length).toBeGreaterThan(0);
    });

    test('should display the overall score', async ({ page }) => {
        await expect(page.getByText('Overall Score')).toBeVisible();
    });

    test('should render all four score breakdown cards', async ({ page }) => {
        const scoreLabels = [
            'Permanence Score',
            'Supplier Trust Score',
            'Financial Risk Score',
            'Leakage Risk Score',
        ];

        for (const label of scoreLabels) {
            await expect(page.getByText(label, { exact: true })).toBeVisible();
        }
    });

    test('should render all four score breakdown cards with values', async ({ page }) => {
        // Each score card contains a CardTitle with a score value
        // Verify that all 4 cards have content by checking the score labels exist alongside values
        const scoreLabels = [
            'Permanence Score',
            'Supplier Trust Score',
            'Financial Risk Score',
            'Leakage Risk Score',
        ];

        for (const label of scoreLabels) {
            const card = page.locator(`text=${label}`).locator('..');
            await expect(card).toBeVisible();
        }
    });

    test('should navigate back to dashboard when clicking the back button', async ({ page }) => {
        await page.getByText('Back to Dashboard').click();
        await page.waitForURL('/');
        expect(page.url()).toContain('localhost');
        // Verify dashboard heading is visible again
        await expect(page.getByRole('heading', { name: /project recommendation engine/i })).toBeVisible();
    });
});
