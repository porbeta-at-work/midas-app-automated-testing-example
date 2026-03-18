# Node.js Playwright + Cucumber Test Automation Framework

A simplified test automation framework using **Playwright** for browser automation and **Cucumber** for Behavior-Driven Development (BDD) testing.

## 🚀 Features

- **Cross-browser testing** with Playwright
- **BDD with Cucumber** - Write tests in natural language  
- **Page Object Model** - Organized and maintainable code structure
- **HTML reporting** - Automatic report generation on every test run
- **Simple recording** - Use Playwright codegen for recording interactions

## 📁 Project Structure

```
midas-app-automated-testing/
├── features/                   # Cucumber feature files (.feature)
├── step-definitions/          # JavaScript step definitions  
├── pages/                     # Page Object Model classes
├── utils/                     # Test utilities and configuration
│   ├── execution/            # Test execution utilities & reporting
│   └── recording/            # Simple recording tools  
├── reports/                   # HTML test reports (auto-generated)
├── screenshots/              # Screenshots (auto-generated)  
├── package.json              # Dependencies and scripts
├── playwright.config.js      # Playwright configuration
├── cucumber.config.js        # Cucumber configuration  
└── README.md                 # This file
```

## 🛠️ Prerequisites

- **Node.js** (version 16 or higher)
- **npm** (Node Package Manager)

## ⚙️ Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install Playwright browsers**:
   ```bash
   npx playwright install
   ```

## 🚦 Running Tests

### Available Scripts

```bash
# Run all tests with HTML reports  
npm test

# Run all tests in headed mode (slow, browser visible) with reports
npm run test:headed  

# Run smoke tests only with reports
npm run test:smoke

# Run smoke tests in headed mode (slow) with reports  
npm run test:smoke:headed

# Launch Playwright codegen for recording new test interactions
npm run record
```

### 📊 Reports

All test scripts automatically generate HTML reports in the `reports/` directory:
- `cucumber-report.html` - Main test report with results and screenshots
- `cucumber-report.json` - Raw test data in JSON format

Reports are **overwritten** on each test run.

### 🎬 Recording New Tests

Use the built-in recording functionality:

```bash
npm run record
```

This launches Playwright's codegen tool where you can:
1. Interact with the application in the browser
2. Copy the generated code manually as needed
3. Integrate into your existing test files

## 🏷️ Tags

Tests can be tagged for selective execution:
- `@smoke` - Quick smoke tests
- `@search` - Search functionality tests

## ⚙️ Configuration

- **Playwright config**: `playwright.config.js` - Browser and execution settings
- **Cucumber config**: `cucumber.config.js` - BDD framework settings
- **Test data**: `utils/execution/test-data.js` - Centralized test data
- **Setup**: `utils/execution/setup.js` - Test environment initialization

## 🔧 Environment Variables

```bash
# Run in headed mode
HEADED=true npm test

# Slow motion (milliseconds)  
SLOW_MO=500 npm test

# Base URL for testing
BASE_URL=https://your-app.com npm test
```
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