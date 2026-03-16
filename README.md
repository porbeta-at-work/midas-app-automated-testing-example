# Node.js Playwright + Cucumber Test Automation Framework

A comprehensive test automation framework using **Playwright** for browser automation and **Cucumber** for Behavior-Driven Development (BDD) testing.

## 🚀 Features

- **Cross-browser testing** - Chrome, Firefox, Safari support
- **BDD with Cucumber** - Write tests in natural language
- **Page Object Model** - Organized and maintainable code structure
- **Parallel execution** - Run tests concurrently for faster feedback
- **Rich reporting** - HTML and JSON reports with screenshots
- **Multiple environments** - Easy configuration for different test environments
- **Debug mode** - Step-by-step debugging capabilities

## 📁 Project Structure

```
midas-app-automated-testing/
├── features/                    # Cucumber feature files
│   ├── login.feature           # Login functionality tests
│   └── search.feature          # Search functionality tests
├── step-definitions/           # Step definition implementations
│   ├── login-steps.js          # Login step definitions
│   └── search-steps.js         # Search step definitions
├── pages/                      # Page Object Model classes
│   ├── BasePage.js            # Base page with common functionality
│   ├── LoginPage.js           # Login page object
│   ├── SearchPage.js          # Search page object
│   └── DashboardPage.js       # Dashboard page object
├── utils/                      # Utility functions and setup
│   ├── setup.js               # Test setup and world configuration
│   ├── test-data.js           # Test data and constants
│   ├── test-helpers.js        # Common helper functions
│   └── generate-html-report.js # HTML report generator
├── reports/                    # Test execution reports
├── screenshots/               # Screenshots of failed tests
├── test-results/              # Playwright test artifacts
├── .github/
│   └── copilot-instructions.md # Project documentation
├── package.json               # Dependencies and scripts
├── playwright.config.js       # Playwright configuration
├── cucumber.config.js         # Cucumber configuration
└── README.md                  # This file
```

## 🛠️ Prerequisites

- **Node.js** (version 16 or higher)
- **npm** (Node Package Manager)
- **Git** (for version control)

## ⚙️ Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd midas-app-automated-testing
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers**:
   ```bash
   npx playwright install
   ```

## 🚦 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in headed mode (browser visible)
npm run test:headed

# Run tests in debug mode (slow execution with console logs)
npm run test:debug

# Generate detailed HTML report
npm run test:report
```

### Environment Variables

Configure test execution using environment variables:

```bash
# Browser selection
BROWSER=chromium npm test  # chromium, firefox, or webkit

# Headless mode
HEADED=true npm test       # Show browser during test execution

# Debug mode
DEBUG=true npm test        # Enable detailed logging

# Base URL
BASE_URL=https://your-app.com npm test

# Tags (run specific scenarios)
TAGS="@smoke" npm test     # Run only smoke tests
TAGS="not @skip" npm test  # Skip tests marked with @skip
```

### Running Specific Tests

```bash
# Run specific feature file
npx cucumber-js features/login.feature

# Run tests with specific tags
npx cucumber-js --tags "@smoke"

# Run tests in parallel
npx cucumber-js --parallel 2
```

## 📝 Writing Tests

### Feature Files

Feature files are written in Gherkin syntax and stored in the `features/` directory:

```gherkin
Feature: Login functionality
  As a user
  I want to be able to login to the application
  So that I can access my account

  @smoke
  Scenario: Successful login with valid credentials
    Given I navigate to the login page
    And I enter valid username "testuser@example.com"
    And I enter valid password "password123"
    When I click the login button
    Then I should be redirected to the dashboard
    And I should see welcome message "Welcome, Test User!"
```

### Step Definitions

Step definitions connect Gherkin steps to JavaScript code:

```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const LoginPage = require('../pages/LoginPage');

Given('I navigate to the login page', async function() {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.navigate();
});
```

### Page Objects

Page objects encapsulate page interactions:

```javascript
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      usernameInput: '#username',
      passwordInput: '#password',
      loginButton: '#login-button'
    };
  }

  async login(username, password) {
    await this.fillText(this.selectors.usernameInput, username);
    await this.fillText(this.selectors.passwordInput, password);
    await this.clickElement(this.selectors.loginButton);
  }
}
```

## 🏷️ Test Tags

Use tags to organize and filter tests:

- `@smoke` - Critical functionality tests
- `@regression` - Full regression suite
- `@negative` - Negative test scenarios
- `@skip` - Tests to skip during execution

## 📊 Reporting

### HTML Reports

Generate comprehensive HTML reports with:

```bash
npm run test:report
```

Reports include:
- Test execution summary
- Step-by-step results
- Screenshots of failures
- Browser and environment information

### JSON Reports

JSON reports are automatically generated at `reports/cucumber-report.json` for integration with CI/CD systems.

## 🔧 Configuration

### Playwright Configuration

Customize browser behavior in [`playwright.config.js`](playwright.config.js):

```javascript
module.exports = defineConfig({
  timeout: 30 * 1000,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

### Cucumber Configuration

Configure test execution in [`cucumber.config.js`](cucumber.config.js):

```javascript
module.exports = {
  default: {
    require: ['step-definitions/**/*.js', 'utils/setup.js'],
    format: ['@cucumber/pretty-formatter', ['json', 'reports/cucumber-report.json']],
    parallel: 2,
    tags: process.env.TAGS || 'not @skip'
  }
};
```

## 🐛 Debugging

### Debug Mode

Enable debug mode for detailed logging:

```bash
DEBUG=true npm test
```

### Screenshots

Failed tests automatically capture screenshots saved to `screenshots/` directory.

### Browser DevTools

Run in headed mode to use browser developer tools:

```bash
HEADED=true npm test
```

### VS Code Debugging

Add this configuration to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Cucumber Tests",
  "program": "${workspaceFolder}/node_modules/@cucumber/cucumber/bin/cucumber-js",
  "args": [
    "features",
    "--require", "step-definitions",
    "--require", "utils/setup.js"
  ],
  "env": {
    "DEBUG": "true",
    "HEADED": "true"
  }
}
```

## 🔄 CI/CD Integration

### GitHub Actions

Example workflow:

```yaml
name: Test Automation
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: reports/
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Write tests following the existing patterns
4. Ensure all tests pass: `npm test`
5. Submit a pull request

## 📚 Best Practices

### Test Organization

- Keep scenarios focused on a single behavior
- Use descriptive scenario names
- Group related scenarios in the same feature file
- Use tags consistently across the project

### Page Objects

- Follow the Page Object Model pattern
- Keep selectors organized in objects
- Add meaningful method names
- Include verification methods

### Data Management

- Store test data in `utils/test-data.js`
- Use environment variables for configuration
- Avoid hardcoding values in step definitions

### Error Handling

- Always include proper assertions
- Handle element wait conditions
- Take screenshots on failures
- Log meaningful error messages

## 🆘 Troubleshooting

### Common Issues

1. **Browser not launching**:
   ```bash
   npx playwright install
   ```

2. **Tests timing out**:
   - Increase timeout in configuration
   - Check network connectivity
   - Verify application availability

3. **Element not found**:
   - Verify selectors are correct
   - Add proper wait conditions
   - Check if element is in viewport

4. **Parallel execution issues**:
   - Reduce parallel workers
   - Ensure tests are independent
   - Check for shared resources

## 📞 Support

For questions and support:

- Create an issue in the repository
- Check existing documentation
- Review example tests for reference

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Testing! 🎉**