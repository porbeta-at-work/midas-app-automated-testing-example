const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

/**
 * Dashboard Page Object Model
 * Contains all elements and methods related to the dashboard/home page
 */
class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Define page selectors
    this.selectors = {
      welcomeMessage: '.welcome-message',
      userProfile: '.user-profile',
      navigationMenu: '.nav-menu',
      logoutButton: '#logout-button',
      searchLink: 'a[href="/search"]',
      dashboardTitle: 'h1.dashboard-title',
      quickStats: '.quick-stats',
      recentActivity: '.recent-activity',
      notifications: '.notifications',
      settingsLink: 'a[href="/settings"]'
    };
  }

  /**
   * Navigate to the dashboard page
   */
  async navigate() {
    await this.navigateTo('/dashboard');
    await this.waitForPageLoad();
  }

  /**
   * Get welcome message
   * @returns {Promise<string>} Welcome message text
   */
  async getWelcomeMessage() {
    await this.waitForElement(this.selectors.welcomeMessage);
    return await this.getTextContent(this.selectors.welcomeMessage);
  }

  /**
   * Check if welcome message is displayed
   * @returns {Promise<boolean>} True if welcome message is visible
   */
  async isWelcomeMessageDisplayed() {
    return await this.isElementVisible(this.selectors.welcomeMessage);
  }

  /**
   * Check if user is logged in (by checking for user profile or logout button)
   * @returns {Promise<boolean>} True if user appears to be logged in
   */
  async isUserLoggedIn() {
    const profileVisible = await this.isElementVisible(this.selectors.userProfile);
    const logoutVisible = await this.isElementVisible(this.selectors.logoutButton);
    return profileVisible || logoutVisible;
  }

  /**
   * Click logout button
   */
  async logout() {
    await this.clickElement(this.selectors.logoutButton);
  }

  /**
   * Navigate to search page
   */
  async goToSearch() {
    await this.clickElement(this.selectors.searchLink);
  }

  /**
   * Navigate to settings page
   */
  async goToSettings() {
    await this.clickElement(this.selectors.settingsLink);
  }

  /**
   * Get dashboard title
   * @returns {Promise<string>} Dashboard title text
   */
  async getDashboardTitle() {
    await this.waitForElement(this.selectors.dashboardTitle);
    return await this.getTextContent(this.selectors.dashboardTitle);
  }

  /**
   * Check if navigation menu is displayed
   * @returns {Promise<boolean>} True if navigation menu is visible
   */
  async isNavigationMenuDisplayed() {
    return await this.isElementVisible(this.selectors.navigationMenu);
  }

  /**
   * Get quick stats data
   * @returns {Promise<Object>} Object containing stats data
   */
  async getQuickStats() {
    if (await this.isElementVisible(this.selectors.quickStats)) {
      const statsElements = await this.page.locator(`${this.selectors.quickStats} .stat-item`).all();
      const stats = {};
      
      for (const element of statsElements) {
        const label = await element.locator('.stat-label').textContent();
        const value = await element.locator('.stat-value').textContent();
        stats[label.toLowerCase().replace(/\s+/g, '_')] = value;
      }
      
      return stats;
    }
    return {};
  }

  /**
   * Get recent activity items
   * @returns {Promise<Array<string>>} Array of recent activity texts
   */
  async getRecentActivity() {
    if (await this.isElementVisible(this.selectors.recentActivity)) {
      const activityItems = await this.page.locator(`${this.selectors.recentActivity} .activity-item`).all();
      const activities = [];
      
      for (const item of activityItems) {
        activities.push(await item.textContent());
      }
      
      return activities;
    }
    return [];
  }

  /**
   * Get notification count
   * @returns {Promise<number>} Number of notifications
   */
  async getNotificationCount() {
    if (await this.isElementVisible(this.selectors.notifications)) {
      const notificationBadge = this.page.locator(`${this.selectors.notifications} .notification-count`);
      if (await notificationBadge.isVisible()) {
        const countText = await notificationBadge.textContent();
        return parseInt(countText) || 0;
      }
    }
    return 0;
  }

  /**
   * Check if notifications are present
   * @returns {Promise<boolean>} True if notifications are visible
   */
  async hasNotifications() {
    const count = await this.getNotificationCount();
    return count > 0;
  }

  /**
   * Verify dashboard page is loaded and user is logged in
   */
  async verifyPageLoaded() {
    await expect(this.page).toHaveTitle(/dashboard|home/i);
    await expect(this.page.locator(this.selectors.welcomeMessage)).toBeVisible();
    
    // Verify user is logged in
    const isLoggedIn = await this.isUserLoggedIn();
    expect(isLoggedIn).toBe(true);
  }

  /**
   * Verify successful login by checking welcome message
   * @param {string} expectedMessage - Expected welcome message
   */
  async verifySuccessfulLogin(expectedMessage) {
    await this.verifyPageLoaded();
    
    if (expectedMessage) {
      const actualMessage = await this.getWelcomeMessage();
      expect(actualMessage).toContain(expectedMessage);
    }
  }
}

module.exports = DashboardPage;