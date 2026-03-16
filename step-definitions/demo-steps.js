const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { URLS } = require('../utils/test-data');

/**
 * Demo step definitions for MiDAS application
 */

Given('I navigate to the MiDAS application', async function() {
  await this.page.goto(URLS.base, { 
    waitUntil: 'domcontentloaded' 
  });
  console.log('✅ Navigated to MiDAS application');
});

When('I check the page title', async function() {
  this.pageTitle = await this.page.title();
  console.log(`📄 Page title: "${this.pageTitle}"`);
});

Then('I should see a valid page title', async function() {
  // Check that the page has loaded with some title (not empty)
  expect(this.pageTitle).toBeTruthy();
  expect(this.pageTitle.length).toBeGreaterThan(0);
  console.log('✅ Page title verification passed!');
});