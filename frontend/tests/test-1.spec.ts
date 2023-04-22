import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.boilerti.me/');
  await page.getByRole('link', { name: 'Already a user?' }).click();
  await page.getByPlaceholder('pete@purdue.edu').click();
  await page.getByPlaceholder('pete@purdue.edu').fill('zsy@purdue.edu');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('maple');
  await page.getByLabel('Password').press('Enter');
  await page.locator('section').filter({ hasText: 'Spring 2023CS 30700 - LectureCS 25200 - LectureCS 25200 - LaboratoryFri Apr 21 2' }).getByRole('button').click();
  await page.getByPlaceholder('Search for classes...').first().click();
  await page.getByPlaceholder('Search for classes...').first().fill('cs 307');
  await page.getByRole('listitem').click();
  await page.getByPlaceholder('Search for classes...').first().click();
  await page.getByPlaceholder('Search for classes...').first().fill('cs 252');
  await page.locator('span').first().click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.locator('.bg-white > div > .flex > div > div > div').first().click();
  await page.getByRole('heading', { name: 'CS 30700' }).getByText('CS').click();
});