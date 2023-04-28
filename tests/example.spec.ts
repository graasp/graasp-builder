import { test, expect } from '@playwright/test';

test('has title', async ({ browser }) => {
  const context = await browser.newContext();
  await context.addCookies([{ name: 'session', value: 'value', url: 'http://localhost:3111' }]);
  const page = await context.newPage();


  await context.route('http://localhost:3000/members/current', async route => {
    const json = {
      id: 'any'
    };
    await route.fulfill({ json });
  });





  await page.goto('http://localhost:3111');

  await page.waitForTimeout(30000)

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});
