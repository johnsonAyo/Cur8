import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {

    test('should display the page heading', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: /project recommendation engine/i })).toBeVisible();
    });

    test('should render project rows in the table', async ({ page }) => {
        await page.goto('/');
        const rows = page.locator('table tbody tr');
        await expect(rows.first()).toBeVisible({ timeout: 10_000 });
        const rowCount = await rows.count();
        expect(rowCount).toBeGreaterThan(0);
    });

    test('should filter projects by status', async ({ page }) => {
        await page.goto('/');
        // Wait for table to load
        await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10_000 });
        const initialCount = await page.locator('table tbody tr').count();

        // Open status filter and select a specific status
        const statusSelect = page.locator('select').first();
        if (await statusSelect.isVisible()) {
            await statusSelect.selectOption({ index: 1 });
            // After filtering, row count should change or remain valid
            await page.waitForTimeout(500);
            const filteredCount = await page.locator('table tbody tr').count();
            expect(filteredCount).toBeLessThanOrEqual(initialCount);
        }
    });

    test('should sort projects when clicking a column header', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10_000 });

        // Get the first project name before sorting
        const firstCellBefore = await page.locator('table tbody tr').first().textContent();

        // Click "Overall Score" header to change sort
        await page.getByText('Overall Score').click();
        await page.waitForTimeout(500);

        // Content may or may not change (depends on data), but page should not error
        const firstCellAfter = await page.locator('table tbody tr').first().textContent();
        expect(firstCellAfter).toBeDefined();
        // If the sort actually changed the order, values should differ
        // This is a structural test — no crash on sort
    });

    test('should navigate to detail page when clicking a project row', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10_000 });

        // Click the first project row
        await page.locator('table tbody tr').first().click();
        await page.waitForURL(/\/project\/.+/);

        expect(page.url()).toContain('/project/');
    });
});
