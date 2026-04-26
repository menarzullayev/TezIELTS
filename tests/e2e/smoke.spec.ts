import { expect, test } from '@playwright/test';

test('tests catalogue page loads', async ({ page }) => {
  await page.goto('/tests');
  await expect(page).toHaveURL(/\/tests/);
});
