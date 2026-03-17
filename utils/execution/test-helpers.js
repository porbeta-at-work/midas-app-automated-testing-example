const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Common utility functions for MiDAS test automation
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