const { expect } = require('@playwright/test');

/**
 * Base Page class that other page classes will extend
 * Contains common functionality shared across all pages
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param {string} url - The URL to navigate to
   */
  async navigateTo(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for an element to be visible
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElement(selector, timeout = 10000) {
    await this.page.waitForSelector(selector, { 
      state: 'visible', 
      timeout 
    });
  }

  /**
   * Click on an element
   * @param {string} selector - Element selector
   */
  async clickElement(selector) {
    await this.waitForElement(selector);
    await this.page.click(selector);
  }

  /**
   * Fill text in an input field
   * @param {string} selector - Input field selector
   * @param {string} text - Text to fill
   */
  async fillText(selector, text) {
    await this.waitForElement(selector);
    await this.page.fill(selector, text);
  }

  /**
   * Get text content of an element
   * @param {string} selector - Element selector
   * @returns {Promise<string>} Text content
   */
  async getTextContent(selector) {
    await this.waitForElement(selector);
    return await this.page.textContent(selector);
  }

  /**
   * Check if an element is visible
   * @param {string} selector - Element selector
   * @returns {Promise<boolean>} True if visible, false otherwise
   */
  async isElementVisible(selector) {
    try {
      await this.page.waitForSelector(selector, { 
        state: 'visible', 
        timeout: 5000 
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current page title
   * @returns {Promise<string>} Page title
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Get current page URL
   * @returns {string} Current URL
   */
  getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Take a screenshot
   * @param {string} name - Screenshot name
   */
  async takeScreenshot(name) {
    await this.page.screenshot({ 
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true
    });
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Scroll to an element
   * @param {string} selector - Element selector
   */
  async scrollToElement(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }
}

module.exports = BasePage;