import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.boilerti.me/');
  await page.getByRole('link', { name: 'Already a user?' }).click();
  await page.getByPlaceholder('pete@purdue.edu').click();
  await page.getByPlaceholder('pete@purdue.edu').fill('zsy@purdue.edu');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('maple');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByPlaceholder('Search').click();
  await page.getByPlaceholder('Search').fill('inseok');
  await page.getByRole('listitem').click();
  await page.goto('https://www.boilerti.me/app?verified=undefined');
});