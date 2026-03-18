# Test Utilities

This directory contains utility functions and tools for the MiDAS test automation framework.

## Directory Structure

### 📹 `/recording/`
**Test Recording** - Simple tool for recording user interactions

- `start-recorder.js` - CLI interface that launches Playwright codegen for recording sessions

**Usage**: `npm run record` to start recording, then manually copy generated code as needed

### 🧪 `/execution/`  
**Test Execution Utilities** - Tools for running and managing automated tests

- `setup.js` - Browser configuration and test lifecycle management
- `test-data.js` - Test data constants and MiDAS application configuration
- `test-helpers.js` - Common utility functions for test automation
- `generate-html-report.js` - HTML report generation from test results

**Usage**: These are automatically loaded during test execution and report generation

## Simplified Workflow

### Available Scripts:
- `npm test` - Run all tests with reports
- `npm run test:headed` - Run all tests in headed mode (slow) with reports  
- `npm run test:smoke` - Run smoke tests with reports
- `npm run test:smoke:headed` - Run smoke tests in headed mode (slow) with reports
- `npm run record` - Launch Playwright codegen for recording new interactions

All test scripts automatically generate HTML reports in the `reports/` directory.  
3. **Execute**: Use execution utilities to run tests
4. **Report**: Generate HTML reports for results

### Development:
- **Recording utilities** are used during test development/creation phase
- **Execution utilities** are used during test running and CI/CD phases

## Quick Commands

```bash
# Recording
npm run record              # Start recording session
npm run recordings          # List available recordings  
npm run import:steps        # Import recorded step definitions

# Execution  
npm test                    # Run all tests
npm run test:smoke          # Run smoke tests only
npm run test:report         # Run tests + generate HTML report
```