# Test Execution Utilities

This directory contains utilities for running and managing automated tests.

## Files:

### `setup.js`
- **Purpose**: Browser setup and test environment configuration
- **Function**: Initializes Playwright browsers, manages test lifecycle
- **Key Features**:
  - Cross-browser support (Chromium, Firefox, WebKit)
  - Headed/headless mode switching via environment variables
  - Custom World class for Cucumber integration
  - Screenshot capture for failed tests

### `test-data.js`  
- **Purpose**: Test data constants and configuration
- **Function**: Centralized test data management for MiDAS application
- **Contents**:
  - MiDAS form data (last names, A numbers)
  - Edge case test scenarios
  - URL configurations
  - Timeout settings
  - Error/success message templates

### `test-helpers.js`
- **Purpose**: Common utility functions for test automation  
- **Function**: Reusable helper methods for test scripts
- **Utilities**:
  - Wait functions and timing utilities
  - Random data generation
  - Screenshot capture with timestamps
  - Element existence checking
  - Test report generation

### `generate-html-report.js`
- **Purpose**: HTML report generation from test results
- **Function**: Converts Cucumber JSON output to formatted HTML reports
- **Usage**: Automatically runs after `npm run test:report`
- **Features**:
  - Bootstrap-themed reports
  - Test metadata and environment info
  - Failed test summaries
  - Scenario timing information

## Usage in Tests:

### Import in Step Definitions:
```javascript
const { URLS, TEST_DATA } = require('../utils/execution/test-data');
const TestHelpers = require('../utils/execution/test-helpers');
```

### Environment Configuration:
- `HEADED=true` - Run tests in visible browser
- `DEBUG=true` - Enable debug mode with slow motion
- `BASE_URL` - Override default MiDAS application URL

### Generate Reports:
```bash
npm run test:report  # Runs tests + generates HTML report
```

## Integration:

These utilities are automatically loaded by the test framework:
- `setup.js` is required by all test commands via `--require` flag  
- Test data and helpers are imported as needed by step definitions
- Report generation runs post-test via npm hooks