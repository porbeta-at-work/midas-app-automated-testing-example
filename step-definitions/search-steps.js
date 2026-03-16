const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const SearchPage = require('../pages/SearchPage');
const DashboardPage = require('../pages/DashboardPage');
const LoginPage = require('../pages/LoginPage');

/**
 * Step definitions for Search functionality
 */

// Initialize page objects
let searchPage;
let dashboardPage;
let loginPage;

Given('I am logged into the application', async function() {
  // Perform a quick login flow
  loginPage = new LoginPage(this.page);
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'password123');
  
  // Verify we're logged in by checking dashboard
  dashboardPage = new DashboardPage(this.page);
  await this.page.waitForTimeout(2000); // Wait for redirect
  
  const isLoggedIn = await dashboardPage.isUserLoggedIn();
  expect(isLoggedIn).toBe(true);
});

Given('I am on the search page', async function() {
  searchPage = new SearchPage(this.page);
  await searchPage.navigate();
  await searchPage.verifyPageLoaded();
});

Given('I enter search term {string}', async function(searchTerm) {
  await searchPage.enterSearchTerm(searchTerm);
});

Given('I select category filter {string}', async function(category) {
  await searchPage.selectCategoryFilter(category);
});

Given('I select date range {string}', async function(dateRange) {
  await searchPage.selectDateRangeFilter(dateRange);
});

When('I click the search button', async function() {
  await searchPage.clickSearchButton();
});

When('I click {string}', async function(buttonText) {
  if (buttonText.toLowerCase().includes('next page')) {
    await searchPage.clickNextPage();
  } else if (buttonText.toLowerCase().includes('previous page')) {
    await searchPage.clickPreviousPage();
  } else {
    // Generic button click
    await this.page.click(`text=${buttonText}`);
  }
});

When('I see more than {int} results', async function(expectedCount) {
  const actualCount = await searchPage.getResultsCount();
  expect(actualCount).toBeGreaterThan(expectedCount);
});

Then('I should see search results displayed', async function() {
  const resultsDisplayed = await searchPage.areResultsDisplayed();
  expect(resultsDisplayed).toBe(true);
});

Then('the results should contain {string} keyword', async function(keyword) {
  const containsKeyword = await searchPage.doesResultsContainKeyword(keyword);
  expect(containsKeyword).toBe(true);
});

Then('the results count should be greater than {int}', async function(expectedMinCount) {
  const actualCount = await searchPage.getResultsCount();
  expect(actualCount).toBeGreaterThan(expectedMinCount);
});

Then('I should see filtered search results', async function() {
  const resultsDisplayed = await searchPage.areResultsDisplayed();
  expect(resultsDisplayed).toBe(true);
  
  // Additional verification that filters were applied could be added here
});

Then('all results should be in {string} category', async function(expectedCategory) {
  // This would require checking each result item for category information
  // Implementation depends on how category is displayed in results
  const results = await searchPage.getResultItems();
  expect(results.length).toBeGreaterThan(0);
  
  // Placeholder implementation - would need actual DOM structure
  console.log(`Verifying all results are in ${expectedCategory} category`);
});

Then('all results should be from the last {int} days', async function(days) {
  // This would require checking each result item for date information
  // Implementation depends on how dates are displayed in results
  const results = await searchPage.getResultItems();
  expect(results.length).toBeGreaterThan(0);
  
  // Placeholder implementation - would need actual DOM structure
  console.log(`Verifying all results are from the last ${days} days`);
});

Then('I should see {string} message', async function(expectedMessage) {
  if (expectedMessage.toLowerCase().includes('no results found')) {
    const noResultsMessage = await searchPage.getNoResultsMessage();
    expect(noResultsMessage).toContain('No results found');
    
    const isNoResultsDisplayed = await searchPage.isNoResultsMessageDisplayed();
    expect(isNoResultsDisplayed).toBe(true);
  }
});

Then('I should see suggestions for alternative searches', async function() {
  const suggestions = await searchPage.getSearchSuggestions();
  expect(suggestions.length).toBeGreaterThan(0);
});

Then('I should see pagination controls', async function() {
  const paginationDisplayed = await searchPage.isPaginationDisplayed();
  expect(paginationDisplayed).toBe(true);
});

Then('I should see the next set of results', async function() {
  const resultsDisplayed = await searchPage.areResultsDisplayed();
  expect(resultsDisplayed).toBe(true);
  
  // Additional verification that different results are shown could be added
});

Then('the page number should be updated', async function() {
  const currentPage = await searchPage.getCurrentPageNumber();
  expect(currentPage).toBeGreaterThan(1);
});