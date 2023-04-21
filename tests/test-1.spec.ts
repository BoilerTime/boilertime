import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.boilerti.me/');
  await page.getByRole('link', { name: 'Already a user?' }).click();
  await page.getByPlaceholder('pete@purdue.edu').click();
  await page.getByPlaceholder('pete@purdue.edu').fill('zsy@purdue.edu');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('maple');
  await page.getByLabel('Password').press('Enter');
  await page.locator('.w-1\\/4 > .flex').first().click();
  await page.getByPlaceholder('Search for classes...').first().fill('cs 252');
  await page.getByRole('listitem').click();
  await page.getByPlaceholder('Search for classes...').first().click();
  await page.getByPlaceholder('Search for classes...').first().fill('cs 307');
  await page.getByRole('listitem').click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByText('CS 30700 at 1:30 pm on Monday, Wednesday, Friday, and CS 25200 at 4:30 pm on Mon').click();
  await page.getByText('CS 30700Software Engineering IAvg Class GPA3.41Professor\'s Rating3.8 out of 5Vie').click();
});