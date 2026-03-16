const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');

/**
 * Step definitions for Login functionality
 */

// Initialize page objects
let loginPage;
let dashboardPage;

Given('I navigate to the login page', async function() {
  loginPage = new LoginPage(this.page);
  await loginPage.navigate();
  await loginPage.verifyPageLoaded();
});

Given('I enter valid username {string}', async function(username) {
  await loginPage.enterUsername(username);
});

Given('I enter invalid username {string}', async function(username) {
  await loginPage.enterUsername(username);
});

Given('I enter username {string}', async function(username) {
  if (username) {
    await loginPage.enterUsername(username);
  }
  // If empty string, don't enter anything (for validation tests)
});

Given('I enter valid password {string}', async function(password) {
  await loginPage.enterPassword(password);
});

Given('I enter invalid password {string}', async function(password) {
  await loginPage.enterPassword(password);
});

Given('I enter password {string}', async function(password) {
  if (password) {
    await loginPage.enterPassword(password);
  }
  // If empty string, don't enter anything (for validation tests)
});

When('I click the login button', async function() {
  await loginPage.clickLoginButton();
  // Wait a moment for the response
  await this.page.waitForTimeout(1000);
});

Then('I should be redirected to the dashboard', async function() {
  dashboardPage = new DashboardPage(this.page);
  
  // Check if we're on the dashboard page
  // This could be by URL, title, or specific elements
  await this.page.waitForTimeout(2000); // Wait for redirect
  
  const currentUrl = this.page.url();
  expect(currentUrl).toMatch(/dashboard|home/i);
});

Then('I should see welcome message {string}', async function(expectedMessage) {
  if (!dashboardPage) {
    dashboardPage = new DashboardPage(this.page);
  }
  
  await dashboardPage.verifySuccessfulLogin(expectedMessage);
});

Then('I should see error message {string}', async function(expectedErrorMessage) {
  const actualErrorMessage = await loginPage.getErrorMessage();
  expect(actualErrorMessage).toContain(expectedErrorMessage);
});

Then('I should remain on the login page', async function() {
  const currentUrl = this.page.url();
  expect(currentUrl).toMatch(/login/i);
  
  // Verify login form is still visible
  await loginPage.verifyPageLoaded();
});

Then('I should see validation message {string}', async function(expectedValidationMessage) {
  // Check both error and validation message selectors
  const errorMessage = await loginPage.getErrorMessage();
  const validationMessage = await loginPage.getValidationMessage();
  
  const actualMessage = errorMessage || validationMessage;
  expect(actualMessage).toContain(expectedValidationMessage);
});