# Test Recorder for MiDAS Application

The Test Recorder automatically captures your interactions with the MiDAS application and generates corresponding Cucumber step definitions and feature files.

## Quick Start

### 1. Start Recording
```bash
npm run record
```

### 2. Interact with MiDAS
- The browser will open automatically to the MiDAS application
- Perform the actions you want to test:
  - Click buttons, links, and other elements  
  - Fill out forms and input fields
  - Navigate through different pages
  - Any interaction will be captured

### 3. Stop Recording
- Press `Ctrl+C` in the terminal when you're done
- The recorder will automatically generate:
  - **Step definitions** (`.js` files)
  - **Feature scenarios** (`.feature` files) 
  - **Recording report** (summary and details)

## Generated Files

After recording, check the `./recordings/` folder for:

```
recordings/
└── midas-recording-2026-03-16T10-30-00/
    ├── generated-steps.js          # Cucumber step definitions
    ├── generated-scenario.feature  # Feature file with scenario
    ├── recording-report.json       # Raw recording data
    └── README.md                   # Recording summary
```

## Using Generated Code

### Step Definitions
Copy the generated step definitions from `generated-steps.js` into your existing step definition files:

```javascript
// From: ./recordings/your-recording/generated-steps.js
// To: ./step-definitions/search-steps.js (or create new file)

When('I click {string}', async function(buttonText) {
  await this.page.click(`text=${buttonText}`);
  console.log(`✅ Clicked: ${buttonText}`);
});
```

### Feature Scenarios  
Copy scenarios from `generated-scenario.feature` into your feature files:

```gherkin
# From: ./recordings/your-recording/generated-scenario.feature  
# To: ./features/search.feature

@recorded
Scenario: Search for research data
  When I enter "research data" in the search field
  And I click "Search"
  Then I should see search results displayed
```

## Advanced Usage

### Custom Recording Options
```bash
# Record with custom name
node utils/test-recorder.js --name=my-custom-test

# Record different URL  
node utils/test-recorder.js --url=https://other-site.com

# Headless recording (no browser window)
node utils/test-recorder.js --headless
```

## Best Practices

### 🎯 Recording Tips
- **Plan your scenario** - Know what you want to test before recording
- **Go slow** - Take your time to ensure actions are captured properly
- **Use meaningful interactions** - Click buttons with clear text, use form labels
- **Test one scenario at a time** - Keep recordings focused and manageable
- **⭐ Complete typing in fields** - Make sure to finish entering text before clicking away (for exact value capture)

### 🔥 New: Exact Value Capture
The recorder now captures the **exact text you type** instead of placeholder values:

**What this means:**
- ✅ **Exact values recorded**: If you type "john.doe@agency.gov", that exact email appears in generated steps
- ✅ **Two step types generated**: Both hardcoded steps (with your exact values) and parameterized steps (reusable) 
- ✅ **Smart completion tracking**: Waits for you to finish typing before capturing the final value
- ✅ **Safe code generation**: Automatically escapes quotes and special characters

**Example:**
```javascript
// Generated with your exact input
When('I enter "john.doe@agency.gov" in the email field', async function() {
  // Uses the actual email you typed during recording
});

// Also generates parameterized version
When('I enter {string} in the email field', async function(value) {
  // Can be used with any email value in future tests
});
```

### 📝 Step Definition Tips  
- **Review generated code** - Always check and refine the generated step definitions
- **Merge similar steps** - Combine duplicate or very similar step definitions
- **Add assertions** - Enhance with appropriate validations and expectations
- **Parameterize values** - Replace hardcoded values with Cucumber parameters

### 🧪 Integration Tips
- **Start with recording** - Use recorder to quickly create initial test structure
- **Refine manually** - Polish the generated code for production use
- **Combine recordings** - Merge multiple recordings into comprehensive test suites
- **Update selectors** - Improve element selectors for better reliability

## Example Workflow

1. **Plan**: "I want to test the MiDAS search functionality"

2. **Record**: 
   ```bash
   npm run record
   ```
   
3. **Interact**: 
   - Navigate to search page
   - Enter search term "research data"  
   - Click search button
   - Verify results appear
   
4. **Stop**: Press `Ctrl+C`

5. **Review**: Check `./recordings/` folder

6. **Integrate**: Copy useful step definitions to your test files

7. **Refine**: Edit and improve the generated code

8. **Test**: Run your new test scenario
   ```bash
   npm test
   ```

## Troubleshooting

### Recording doesn't capture clicks
- Ensure elements have visible text or clear attributes
- Try clicking more slowly
- Check console output for error messages

### Generated selectors don't work
- Update selectors in the generated step definitions
- Use browser dev tools to find better selectors
- Consider using `data-testid` attributes in the application

### Browser doesn't open
- Check that Playwright is properly installed
- Try running with `--headed` flag explicitly
- Verify MiDAS URL is accessible

## Support

The test recorder integrates seamlessly with your existing Cucumber + Playwright test suite. Generated code follows the same patterns and conventions as your manually written tests.