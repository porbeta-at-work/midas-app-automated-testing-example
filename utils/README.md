# Test Utilities

This directory contains all utility functions and tools for the MiDAS test automation framework, organized by purpose.

## Directory Structure

### 📹 `/recording/`
**Test Recording Utilities** - Tools for creating automated tests by recording user interactions

- `test-recorder.js` - Main recording engine that captures browser interactions  
- `start-recorder.js` - CLI interface for easy recording sessions
- `step-integrator.js` - Utility to merge recorded steps into existing test files

**Usage**: `npm run record` to start recording, then import generated code

### 🧪 `/execution/`  
**Test Execution Utilities** - Tools for running and managing automated tests

- `setup.js` - Browser configuration and test lifecycle management
- `test-data.js` - Test data constants and MiDAS application configuration
- `test-helpers.js` - Common utility functions for test automation
- `generate-html-report.js` - HTML report generation from test results

**Usage**: These are automatically loaded during test execution

## Workflow

### Creating New Tests:
1. **Record**: Use recording utilities to capture user interactions
2. **Import**: Use step-integrator to merge into test suite  
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