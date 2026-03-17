# Test Recording Utilities

This directory contains utilities for recording user interactions and generating test automation code.

## Files:

### `test-recorder.js`
- **Purpose**: Main test recorder engine
- **Function**: Captures user interactions (clicks, typing, navigation) from browser sessions
- **Output**: Generates Cucumber step definitions and feature scenarios
- **Key Features**: 
  - Records exact text values entered in forms
  - Creates both hardcoded and parameterized step definitions  
  - Generates intelligent element selectors

### `start-recorder.js`
- **Purpose**: CLI interface for the test recorder
- **Function**: Easy-to-use command line tool to start recording sessions
- **Usage**: `npm run record` or `node utils/recording/start-recorder.js`
- **Features**: Automatically opens browser, navigates to MiDAS application

### `step-integrator.js`  
- **Purpose**: Integration utility for recorded test steps
- **Function**: Merges generated step definitions into existing test files
- **Usage**: 
  - `npm run recordings` - List available recordings
  - `npm run import:steps` - Import step definitions
  - `npm run import:feature` - Import feature scenarios
- **Features**: Avoids duplicates, maintains file structure

## Workflow:

1. **Record**: `npm run record` → Interact with application → Generated files in `./recordings/`
2. **Review**: Check generated step definitions and scenarios  
3. **Import**: Use step-integrator to merge into your test suite
4. **Refine**: Edit and customize the imported code as needed

## Generated Output:

Recording sessions create files in `./recordings/<session-name>/`:
- `generated-steps.js` - Cucumber step definitions
- `generated-scenario.feature` - Feature file with scenarios
- `recording-report.json` - Session details and metrics
- `README.md` - Session summary