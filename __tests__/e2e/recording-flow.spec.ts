/**
 * End-to-end tests for recording flow
 */

import { test, expect } from '@playwright/test';

test.describe('Recording Flow', () => {
  test('should display the main page', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Voice Notes AI/);

    // Check main heading
    await expect(page.getByRole('heading', { name: /Voice Notes AI/i })).toBeVisible();

    // Check for recording button
    await expect(page.getByRole('button', { name: /start recording/i })).toBeVisible();
  });

  test('should navigate to history page', async ({ page }) => {
    await page.goto('/');

    // Click history link
    await page.click('a[href="/history"]');

    // Check URL
    await expect(page).toHaveURL(/.*history/);

    // Check for history heading
    await expect(page.getByRole('heading', { name: /Recording History/i })).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    await page.goto('/');

    // Check for feature cards
    await expect(page.getByText(/High-Quality Recording/i)).toBeVisible();
    await expect(page.getByText(/AI Transcription/i)).toBeVisible();
    await expect(page.getByText(/Smart Summaries/i)).toBeVisible();
  });

  test('should have search functionality on history page', async ({ page }) => {
    await page.goto('/history');

    // Check for search input
    const searchInput = page.getByPlaceholder(/Search recordings/i);
    await expect(searchInput).toBeVisible();

    // Type in search box
    await searchInput.fill('test');
    await expect(searchInput).toHaveValue('test');
  });

  test('should have responsive navigation', async ({ page }) => {
    await page.goto('/');

    // Check navigation links
    await expect(page.getByRole('link', { name: /Record/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /History/i })).toBeVisible();
  });

  test('should have footer with attribution', async ({ page }) => {
    await page.goto('/');

    // Check footer content
    await expect(page.getByText(/Powered by/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Groq Whisper/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Google Gemini/i })).toBeVisible();
  });
});
