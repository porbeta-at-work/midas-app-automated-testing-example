const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

/**
 * Search Page Object Model
 * Contains all elements and methods related to the search functionality
 */
class SearchPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Define page selectors
    this.selectors = {
      searchInput: '#search-input',
      searchButton: '#search-button',
      searchResults: '.search-results',
      resultItems: '.result-item',
      resultsCount: '.results-count',
      noResultsMessage: '.no-results',
      suggestions: '.search-suggestions',
      categoryFilter: '#category-filter',
      dateRangeFilter: '#date-range-filter',
      sortBy: '#sort-by',
      pagination: '.pagination',
      nextPageButton: '.pagination .next',
      previousPageButton: '.pagination .previous',
      currentPageNumber: '.pagination .current-page',
      resultsPerPage: '#results-per-page'
    };
  }

  /**
   * Navigate to the search page
   */
  async navigate() {
    await this.navigateTo('/search');
    await this.waitForPageLoad();
  }

  /**
   * Enter search term
   * @param {string} searchTerm - Term to search for
   */
  async enterSearchTerm(searchTerm) {
    await this.fillText(this.selectors.searchInput, searchTerm);
  }

  /**
   * Click search button
   */
  async clickSearchButton() {
    await this.clickElement(this.selectors.searchButton);
    await this.waitForSearchResults();
  }

  /**
   * Perform complete search
   * @param {string} searchTerm - Term to search for
   */
  async performSearch(searchTerm) {
    await this.enterSearchTerm(searchTerm);
    await this.clickSearchButton();
  }

  /**
   * Wait for search results to load
   */
  async waitForSearchResults() {
    await this.page.waitForSelector(
      `${this.selectors.searchResults}, ${this.selectors.noResultsMessage}`,
      { timeout: 10000 }
    );
  }

  /**
   * Get search results count
   * @returns {Promise<number>} Number of search results
   */
  async getResultsCount() {
    if (await this.isElementVisible(this.selectors.resultsCount)) {
      const countText = await this.getTextContent(this.selectors.resultsCount);
      const match = countText.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  }

  /**
   * Get all result items
   * @returns {Promise<Array>} Array of result elements
   */
  async getResultItems() {
    await this.waitForElement(this.selectors.resultItems);
    return await this.page.locator(this.selectors.resultItems).all();
  }

  /**
   * Check if search results are displayed
   * @returns {Promise<boolean>} True if results are visible
   */
  async areResultsDisplayed() {
    return await this.isElementVisible(this.selectors.searchResults);
  }

  /**
   * Get "no results" message
   * @returns {Promise<string>} No results message text
   */
  async getNoResultsMessage() {
    if (await this.isElementVisible(this.selectors.noResultsMessage)) {
      return await this.getTextContent(this.selectors.noResultsMessage);
    }
    return '';
  }

  /**
   * Check if "no results" message is displayed
   * @returns {Promise<boolean>} True if no results message is visible
   */
  async isNoResultsMessageDisplayed() {
    return await this.isElementVisible(this.selectors.noResultsMessage);
  }

  /**
   * Select category filter
   * @param {string} category - Category to filter by
   */
  async selectCategoryFilter(category) {
    await this.page.selectOption(this.selectors.categoryFilter, category);
  }

  /**
   * Select date range filter
   * @param {string} dateRange - Date range to filter by
   */
  async selectDateRangeFilter(dateRange) {
    await this.page.selectOption(this.selectors.dateRangeFilter, dateRange);
  }

  /**
   * Check if keyword exists in results
   * @param {string} keyword - Keyword to search for
   * @returns {Promise<boolean>} True if keyword found in results
   */
  async doesResultsContainKeyword(keyword) {
    const results = await this.getResultItems();
    
    for (const result of results) {
      const text = await result.textContent();
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  /**
   * Click next page button
   */
  async clickNextPage() {
    await this.clickElement(this.selectors.nextPageButton);
    await this.waitForSearchResults();
  }

  /**
   * Click previous page button
   */
  async clickPreviousPage() {
    await this.clickElement(this.selectors.previousPageButton);
    await this.waitForSearchResults();
  }

  /**
   * Get current page number
   * @returns {Promise<number>} Current page number
   */
  async getCurrentPageNumber() {
    const pageText = await this.getTextContent(this.selectors.currentPageNumber);
    return parseInt(pageText) || 1;
  }

  /**
   * Check if pagination is displayed
   * @returns {Promise<boolean>} True if pagination is visible
   */
  async isPaginationDisplayed() {
    return await this.isElementVisible(this.selectors.pagination);
  }

  /**
   * Get search suggestions
   * @returns {Promise<Array<string>>} Array of suggestion texts
   */
  async getSearchSuggestions() {
    if (await this.isElementVisible(this.selectors.suggestions)) {
      const suggestions = await this.page.locator(`${this.selectors.suggestions} li`).all();
      const suggestionTexts = [];
      for (const suggestion of suggestions) {
        suggestionTexts.push(await suggestion.textContent());
      }
      return suggestionTexts;
    }
    return [];
  }

  /**
   * Verify search page is loaded
   */
  async verifyPageLoaded() {
    await expect(this.page).toHaveTitle(/search/i);
    await expect(this.page.locator(this.selectors.searchInput)).toBeVisible();
    await expect(this.page.locator(this.selectors.searchButton)).toBeVisible();
  }
}

module.exports = SearchPage;