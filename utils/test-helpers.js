const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Common utility functions for test automation
 */
class TestHelpers {
  /**
   * Wait for a specific amount of time
   * @param {number} ms - Milliseconds to wait
   */
  static async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate a random string
   * @param {number} length - Length of the string
   * @returns {string} Random string
   */
  static generateRandomString(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * Generate a random email
   * @param {string} domain - Email domain (default: example.com)
   * @returns {string} Random email
   */
  static generateRandomEmail(domain = 'example.com') {
    const username = this.generateRandomString(8);
    return `${username}@${domain}`;
  }

  /**
   * Get current timestamp as string
   * @returns {string} Timestamp string
   */
  static getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
  }

  /**
   * Create directory if it doesn't exist
   * @param {string} dirPath - Directory path
   */
  static ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Save text to file
   * @param {string} filePath - File path
   * @param {string} content - Content to save
   */
  static saveToFile(filePath, content) {
    const dir = path.dirname(filePath);
    this.ensureDirectoryExists(dir);
    fs.writeFileSync(filePath, content, 'utf8');
  }

  /**
   * Take a screenshot with timestamp
   * @param {Page} page - Playwright page object
   * @param {string} name - Screenshot name
   * @returns {string} Screenshot path
   */
  static async takeScreenshot(page, name) {
    const timestamp = this.getTimestamp();
    const screenshotDir = 'screenshots';
    this.ensureDirectoryExists(screenshotDir);
    
    const screenshotPath = path.join(screenshotDir, `${name}-${timestamp}.png`);
    await page.screenshot({ 
      path: screenshotPath, 
      fullPage: true 
    });
    
    return screenshotPath;
  }

  /**
   * Wait for element to be stable (not moving/changing)
   * @param {Page} page - Playwright page object
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds
   */
  static async waitForElementToBeStable(page, selector, timeout = 5000) {
    await page.waitForSelector(selector, { state: 'visible', timeout });
    
    let previousBoundingBox = await page.locator(selector).boundingBox();
    let stableCount = 0;
    const requiredStableCount = 3;
    
    while (stableCount < requiredStableCount && timeout > 0) {
      await this.wait(100);
      timeout -= 100;
      
      const currentBoundingBox = await page.locator(selector).boundingBox();
      
      if (JSON.stringify(previousBoundingBox) === JSON.stringify(currentBoundingBox)) {
        stableCount++;
      } else {
        stableCount = 0;
      }
      
      previousBoundingBox = currentBoundingBox;
    }
  }

  /**
   * Scroll element into view
   * @param {Page} page - Playwright page object
   * @param {string} selector - Element selector
   */
  static async scrollIntoView(page, selector) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await this.wait(500); // Wait for scroll to complete
  }

  /**
   * Clear browser data (cookies, local storage, session storage)
   * @param {Page} page - Playwright page object
   */
  static async clearBrowserData(page) {
    // Clear local storage
    await page.evaluate(() => {
      window.localStorage.clear();
    });

    // Clear session storage
    await page.evaluate(() => {
      window.sessionStorage.clear();
    });

    // Clear cookies
    const context = page.context();
    await context.clearCookies();
  }

  /**
   * Get browser and OS information
   * @param {Page} page - Playwright page object
   * @returns {Object} Browser and OS info
   */
  static async getBrowserInfo(page) {
    const userAgent = await page.evaluate(() => navigator.userAgent);
    const viewport = page.viewportSize();
    
    return {
      userAgent,
      viewport,
      url: page.url(),
      title: await page.title()
    };
  }

  /**
   * Wait for network to be idle
   * @param {Page} page - Playwright page object
   * @param {number} timeout - Timeout in milliseconds
   */
  static async waitForNetworkIdle(page, timeout = 10000) {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Check if element exists (without throwing error)
   * @param {Page} page - Playwright page object
   * @param {string} selector - Element selector
   * @returns {boolean} True if element exists
   */
  static async elementExists(page, selector) {
    try {
      await page.waitForSelector(selector, { timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Retry a function multiple times
   * @param {Function} fn - Function to retry
   * @param {number} maxRetries - Maximum retry attempts
   * @param {number} delay - Delay between retries (ms)
   * @returns {Promise} Result of function execution
   */
  static async retry(fn, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        console.log(`Attempt ${i + 1} failed:`, error.message);
        
        if (i < maxRetries - 1) {
          await this.wait(delay);
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Get all console messages from page
   * @param {Page} page - Playwright page object
   * @returns {Array} Array of console messages
   */
  static setupConsoleCapture(page) {
    const consoleMessages = [];
    
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date().toISOString()
      });
    });

    page.on('pageerror', error => {
      consoleMessages.push({
        type: 'error',
        text: error.message,
        timestamp: new Date().toISOString()
      });
    });

    return consoleMessages;
  }

  /**
   * Generate test report summary
   * @param {Object} results - Test results object
   * @returns {string} Report summary
   */
  static generateReportSummary(results) {
    const { total, passed, failed, skipped } = results;
    const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : 0;
    
    return `
Test Results Summary:
=====================================
Total Tests: ${total}
Passed: ${passed}
Failed: ${failed}
Skipped: ${skipped}
Pass Rate: ${passRate}%
Executed: ${new Date().toISOString()}
=====================================
    `.trim();
  }
}

module.exports = TestHelpers;