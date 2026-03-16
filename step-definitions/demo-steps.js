const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

/**
 * Demo step definitions to showcase the framework
 */

Given('I navigate to the example website', async function() {
  await this.page.goto('https://example.com', { 
    waitUntil: 'domcontentloaded' 
  });
  console.log('✅ Navigated to example.com');
});

When('I check the page title', async function() {
  this.pageTitle = await this.page.title();
  console.log(`📄 Page title: "${this.pageTitle}"`);
});

Then('I should see the correct example title', async function() {
  expect(this.pageTitle).toContain('Example');
  console.log('✅ Title verification passed!');
});