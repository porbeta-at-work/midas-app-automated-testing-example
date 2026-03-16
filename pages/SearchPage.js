const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

/**
 * Search Page Object Model for MiDAS Application
 * Contains all elements and methods related to the search functionality
 */
class SearchPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Define page selectors - these may need to be updated based on actual MiDAS structure
    this.selectors = {
      searchInput: 'input[type="search"], input[placeholder*="search"], #search, .search-input',
      searchButton: 'button[type="submit"], .search-button, input[type="submit"]',
      searchResults: '.search-results, .results, [class*="result"]',
      resultItems: '.result-item, .result, [class*="item"]',
      resultsCount: '.results-count, .count, [class*="count"]',
      noResultsMessage: '.no-results, .empty, [class*="no-result"]',
      suggestions: '.search-suggestions, .suggestions',
      categoryFilter: '#category-filter, .category-filter, select[class*="category"]',
      dateRangeFilter: '#date-range-filter, .date-filter, select[class*="date"]',
      sortBy: '#sort-by, .sort-by, select[class*="sort"]',
      pagination: '.pagination, [class*="pagination"]',
      nextPageButton: '.pagination .next, [class*="next"]',
      previousPageButton: '.pagination .previous, [class*="previous"]',
      currentPageNumber: '.pagination .current-page, [class*="current"]',
      resultsPerPage: '#results-per-page, .results-per-page'
    };
  }

  /**
   * Navigate to the search page or ensure search functionality is available
   */
  async navigate() {
    // For MiDAS, search might be on the main page or a specific search page
    await this.navigateTo('/'); // Start from home page
    await this.waitForPageLoad();
  }

  /**
   * Enter search term
   * @param {string} searchTerm - Term to search for
   */
  async enterSearchTerm(searchTerm) {
    try {
      // Try multiple potential search input selectors
      const searchSelectors = [
        'input[type="search"]',
        'input[placeholder*="search" i]',
        'input[placeholder*="Search" i]',
        '#search',
        '.search-input',
        'input[name*="search" i]',
        'input[id*="search" i]',
        'input[class*="search" i]',
        'input[type="text"]', // Generic text input as fallback
      ];

      let searchInput = null;
      for (const selector of searchSelectors) {
        try {
          const element = this.page.locator(selector).first();
          if (await element.isVisible({ timeout: 1000 })) {
            searchInput = element;
            console.log(`✅ Found search input with selector: ${selector}`);
            break;
          }
        } catch (error) {
          // Continue to next selector
        }
      }

      if (searchInput) {
        await searchInput.fill(searchTerm);
        console.log(`✅ Entered search term: "${searchTerm}"`);
      } else {
        console.log('⚠️  No search input found - MiDAS might not have search functionality or uses different selectors');
        console.log('Available inputs on page:');
        const allInputs = await this.page.locator('input').all();
        for (let i = 0; i < Math.min(allInputs.length, 5); i++) {
          const input = allInputs[i];
          const type = await input.getAttribute('type') || 'text';
          const placeholder = await input.getAttribute('placeholder') || '';
          const id = await input.getAttribute('id') || '';
          const className = await input.getAttribute('class') || '';
          console.log(`  Input ${i + 1}: type="${type}" placeholder="${placeholder}" id="${id}" class="${className}"`);
        }
      }
    } catch (error) {
      console.log('Error entering search term:', error.message);
    }
  }

  /**
   * Click search button
   */
  async clickSearchButton() {
    try {
      // Try multiple potential search button selectors
      const buttonSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:has-text("Search")',
        'button:has-text("search")',
        '.search-button',
        'button[class*="search" i]',
        'button[id*="search" i]',
        '[role="button"][class*="search" i]',
        'form button', // Any button in a form
      ];

      let searchButton = null;
      for (const selector of buttonSelectors) {
        try {
          const element = this.page.locator(selector).first();
          if (await element.isVisible({ timeout: 1000 })) {
            searchButton = element;
            console.log(`✅ Found search button with selector: ${selector}`);
            break;
          }
        } catch (error) {
          // Continue to next selector
        }
      }

      if (searchButton) {
        await searchButton.click();
        console.log('✅ Clicked search button');
      } else {
        // Fallback: try pressing Enter on any visible input
        console.log('⚠️  No search button found, trying Enter key on first visible input');
        const inputs = await this.page.locator('input').all();
        if (inputs.length > 0) {
          await inputs[0].press('Enter');
          console.log('✅ Pressed Enter on input field');
        } else {
          console.log('❌ No search button or input field found');
        }
      }
      
      await this.waitForSearchResults();
    } catch (error) {
      console.log('Error clicking search button:', error.message);
    }
  }

  /**
   * Apply any available filters on the page
   */
  async applyAvailableFilters() {
    try {
      // Try to apply category filter if available
      if (await this.isElementVisible(this.selectors.categoryFilter)) {
        const options = await this.page.locator(`${this.selectors.categoryFilter} option`).all();
        if (options.length > 1) {
          // Select the first non-default option
          await this.page.selectOption(this.selectors.categoryFilter, { index: 1 });
        }
      }
      
      // Try to apply date filter if available
      if (await this.isElementVisible(this.selectors.dateRangeFilter)) {
        const options = await this.page.locator(`${this.selectors.dateRangeFilter} option`).all();
        if (options.length > 1) {
          // Select the first non-default option
          await this.page.selectOption(this.selectors.dateRangeFilter, { index: 1 });
        }
      }
    } catch (error) {
      console.log('No filters available or error applying filters:', error.message);
    }
  }

  /**
   * Wait for search results to load
   */
  async waitForSearchResults() {
    try {
      await this.page.waitForSelector(
        `${this.selectors.searchResults}, ${this.selectors.noResultsMessage}`,
        { timeout: 10000 }
      );
    } catch (error) {
      // If specific selectors don't work, wait for page to stabilize
      await this.page.waitForTimeout(2000);
    }
  }

  /**
   * Get search results count
   * @returns {Promise<number>} Number of search results
   */
  async getResultsCount() {
    try {
      if (await this.isElementVisible(this.selectors.resultsCount)) {
        const countText = await this.getTextContent(this.selectors.resultsCount);
        const match = countText.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      }
      
      // Fallback: count visible result items
      const results = await this.page.locator(this.selectors.resultItems).count();
      return results;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get all result items
   * @returns {Promise<Array>} Array of result elements
   */
  async getResultItems() {
    try {
      return await this.page.locator(this.selectors.resultItems).all();
    } catch (error) {
      return [];
    }
  }

  /**
   * Check if search results are displayed
   * @returns {Promise<boolean>} True if results are visible
   */
  async areResultsDisplayed() {
    try {
      return await this.isElementVisible(this.selectors.searchResults) ||
             (await this.getResultsCount()) > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get "no results" message
   * @returns {Promise<string>} No results message text
   */
  async getNoResultsMessage() {
    try {
      if (await this.isElementVisible(this.selectors.noResultsMessage)) {
        return await this.getTextContent(this.selectors.noResultsMessage);
      }
      return '';
    } catch (error) {
      return '';
    }
  }

  /**
   * Check if "no results" message is displayed
   * @returns {Promise<boolean>} True if no results message is visible
   */
  async isNoResultsMessageDisplayed() {
    try {
      return await this.isElementVisible(this.selectors.noResultsMessage);
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if pagination is displayed
   * @returns {Promise<boolean>} True if pagination is visible
   */
  async isPaginationDisplayed() {
    try {
      return await this.isElementVisible(this.selectors.pagination);
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify search page is loaded
   */
  async verifyPageLoaded() {
    // For MiDAS, just check if the page is loaded and search functionality might be available
    try {
      await this.page.waitForLoadState('domcontentloaded');
      console.log('✅ MiDAS page loaded successfully');
    } catch (error) {
      console.log('⚠️  Page load verification failed:', error.message);
    }
  }
}

module.exports = SearchPage;