const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

/**
 * Login Page Object Model
 * Contains all elements and methods related to the login page
 */
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Define page selectors
    this.selectors = {
      usernameInput: '#username',
      passwordInput: '#password',
      loginButton: '#login-button',
      errorMessage: '.error-message',
      validationMessage: '.validation-message',
      forgotPasswordLink: '#forgot-password',
      rememberMeCheckbox: '#remember-me'
    };
  }

  /**
   * Navigate to the login page
   */
  async navigate() {
    await this.navigateTo('/login');
    await this.waitForPageLoad();
  }

  /**
   * Enter username
   * @param {string} username - Username to enter
   */
  async enterUsername(username) {
    await this.fillText(this.selectors.usernameInput, username);
  }

  /**
   * Enter password
   * @param {string} password - Password to enter
   */
  async enterPassword(password) {
    await this.fillText(this.selectors.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLoginButton() {
    await this.clickElement(this.selectors.loginButton);
  }

  /**
   * Perform complete login flow
   * @param {string} username - Username
   * @param {string} password - Password
   */
  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message
   */
  async getErrorMessage() {
    if (await this.isElementVisible(this.selectors.errorMessage)) {
      return await this.getTextContent(this.selectors.errorMessage);
    }
    return '';
  }

  /**
   * Get validation message text
   * @returns {Promise<string>} Validation message
   */
  async getValidationMessage() {
    if (await this.isElementVisible(this.selectors.validationMessage)) {
      return await this.getTextContent(this.selectors.validationMessage);
    }
    return '';
  }

  /**
   * Check if error message is displayed
   * @returns {Promise<boolean>} True if error message is visible
   */
  async isErrorMessageDisplayed() {
    return await this.isElementVisible(this.selectors.errorMessage);
  }

  /**
   * Check if validation message is displayed
   * @returns {Promise<boolean>} True if validation message is visible
   */
  async isValidationMessageDisplayed() {
    return await this.isElementVisible(this.selectors.validationMessage);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword() {
    await this.clickElement(this.selectors.forgotPasswordLink);
  }

  /**
   * Check/uncheck remember me checkbox
   * @param {boolean} check - True to check, false to uncheck
   */
  async toggleRememberMe(check = true) {
    const checkbox = this.page.locator(this.selectors.rememberMeCheckbox);
    const isChecked = await checkbox.isChecked();
    
    if (check && !isChecked) {
      await checkbox.check();
    } else if (!check && isChecked) {
      await checkbox.uncheck();
    }
  }

  /**
   * Verify login page is loaded
   */
  async verifyPageLoaded() {
    await expect(this.page).toHaveTitle(/login/i);
    await expect(this.page.locator(this.selectors.usernameInput)).toBeVisible();
    await expect(this.page.locator(this.selectors.passwordInput)).toBeVisible();
    await expect(this.page.locator(this.selectors.loginButton)).toBeVisible();
  }
}

module.exports = LoginPage;