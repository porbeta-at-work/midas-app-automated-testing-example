const { chromium, firefox, webkit } = require('@playwright/test');
const { Before, After, setWorldConstructor, setDefaultTimeout } = require('@cucumber/cucumber');

// Set default timeout for steps
setDefaultTimeout(30 * 1000);

/**
 * Custom World class that extends Cucumber's World
 * This will hold our browser, page, and other context
 */
class CustomWorld {
  constructor({ attach, parameters }) {
    this.attach = attach;
    this.parameters = parameters;
    this.browser = null;
    this.page = null;
    this.context = null;
  }

  /**
   * Launch browser based on environment or default to chromium
   */
  async launchBrowser() {
    const browserType = process.env.BROWSER || 'chromium';
    const headless = this.parameters.headless !== false;
    const slowMo = this.parameters.slowMo || 0;
    
    const launchOptions = {
      headless,
      slowMo,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    };

    switch (browserType.toLowerCase()) {
      case 'firefox':
        this.browser = await firefox.launch(launchOptions);
        break;
      case 'webkit':
      case 'safari':
        this.browser = await webkit.launch(launchOptions);
        break;
      case 'chromium':
      case 'chrome':
      default:
        this.browser = await chromium.launch(launchOptions);
        break;
    }

    // Create a new browser context
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
      // Enable trace collection for debugging
      trace: process.env.TRACE === 'on' ? 'on' : 'retain-on-failure'
    });

    // Create a new page
    this.page = await this.context.newPage();

    // Set up console logging in debug mode
    if (this.parameters.debug) {
      this.page.on('console', msg => {
        console.log(`Browser Console [${msg.type()}]:`, msg.text());
      });

      this.page.on('pageerror', error => {
        console.log('Page Error:', error.message);
      });
    }
  }

  /**
   * Close browser and cleanup
   */
  async closeBrowser() {
    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }

  /**
   * Take screenshot for failed scenarios
   */
  async takeScreenshot(scenarioName) {
    if (this.page) {
      const screenshot = await this.page.screenshot({
        path: `screenshots/failed-${scenarioName.replace(/\s+/g, '-')}-${Date.now()}.png`,
        fullPage: true
      });
      
      // Attach screenshot to Cucumber report
      this.attach(screenshot, 'image/png');
    }
  }
}

// Set our custom world constructor
setWorldConstructor(CustomWorld);

/**
 * Before each scenario hook
 */
Before(async function() {
  console.log('🚀 Starting new scenario...');
  await this.launchBrowser();
});

/**
 * After each scenario hook
 */
After(async function(scenario) {
  // Take screenshot if scenario failed
  if (scenario.result.status === 'failed') {
    console.log('❌ Scenario failed, taking screenshot...');
    await this.takeScreenshot(scenario.pickle.name);
  } else {
    console.log('✅ Scenario passed');
  }

  // Always close browser after scenario
  await this.closeBrowser();
});

/**
 * Export utility functions for step definitions
 */
module.exports = {
  CustomWorld
};