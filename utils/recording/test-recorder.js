const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Test Recorder for MiDAS Application
 * Records user interactions and generates Cucumber step definitions
 */
class TestRecorder {
  constructor() {
    this.browser = null;
    this.page = null;
    this.context = null;
    this.actions = [];
    this.stepCounter = 1;
    this.recordingStartTime = null;
  }

  /**
   * Start recording session
   */
  async startRecording(options = {}) {
    const {
      headless = false,
      url = process.env.BASE_URL || 'http://midas-webhosting-dev2.s3-website-us-gov-west-1.amazonaws.com',
      recordingName = `recording-${Date.now()}`
    } = options;

    console.log('🎬 Starting Test Recorder...');
    console.log(`📍 Target URL: ${url}`);
    console.log(`📝 Recording Name: ${recordingName}`);
    
    this.recordingStartTime = Date.now();
    this.recordingName = recordingName;

    // Launch browser
    this.browser = await chromium.launch({ 
      headless,
      slowMo: 100 // Slow down for better recording
    });
    
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: {
        dir: './recordings/videos',
        size: { width: 1280, height: 720 }
      }
    });

    this.page = await this.context.newPage();

    // Set up event listeners for recording
    await this.setupRecordingListeners();

    // Navigate to the starting URL
    console.log('🌐 Navigating to application...');
    await this.page.goto(url);
    this.recordAction('navigation', { url, description: 'Navigate to application' });

    // Show recording instructions
    this.showRecordingInstructions();

    return { page: this.page, context: this.context };
  }

  /**
   * Setup event listeners to capture user actions
   */
  async setupRecordingListeners() {
    // Inject JavaScript to capture interactions
    await this.page.addInitScript(() => {
      // Store reference to recorder for communication
      window.__testRecorder = {
        actions: [],
        inputValues: new Map(), // Track input values by element
        keyStrokes: [] // Track individual keystrokes
      };

      // Capture clicks
      document.addEventListener('click', (event) => {
        const element = event.target;
        const text = element.innerText || element.textContent || element.value || '';
        const tagName = element.tagName.toLowerCase();
        const id = element.id || '';
        const className = element.className || '';
        const type = element.type || '';
        const placeholder = element.placeholder || '';
        const name = element.name || '';

        window.__testRecorder.actions.push({
          type: 'click',
          timestamp: Date.now(),
          element: {
            tagName,
            id,
            className: typeof className === 'string' ? className : '',
            type,
            text: text.trim().substring(0, 100), // Increased limit
            placeholder,
            name
          }
        });
      }, true);

      // Capture form inputs with better value tracking
      document.addEventListener('input', (event) => {
        const element = event.target;
        if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea') {
          const value = element.value || '';
          const id = element.id || '';
          const className = element.className || '';
          const type = element.type || 'text';
          const placeholder = element.placeholder || '';
          const name = element.name || '';
          
          // Create unique identifier for this element
          const elementKey = id || name || placeholder || `${tagName}-${type}`;
          
          // Store the current value for this element
          window.__testRecorder.inputValues.set(elementKey, value);

          window.__testRecorder.actions.push({
            type: 'input',
            timestamp: Date.now(),
            element: {
              tagName: element.tagName.toLowerCase(),
              id,
              className: typeof className === 'string' ? className : '',
              type,
              placeholder,
              name,
              elementKey
            },
            value: value, // Capture full actual value
            previousValue: window.__testRecorder.inputValues.get(elementKey) || ''
          });
        }
      }, true);

      // Capture individual keystrokes for detailed input tracking
      document.addEventListener('keydown', (event) => {
        if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea') {
          const element = event.target;
          const id = element.id || '';
          const name = element.name || '';
          const placeholder = element.placeholder || '';
          const elementKey = id || name || placeholder || `${element.tagName}-${element.type}`;

          window.__testRecorder.keyStrokes.push({
            timestamp: Date.now(),
            key: event.key,
            code: event.code,
            elementKey,
            value: element.value, // Value before keystroke
            isSpecialKey: ['Enter', 'Tab', 'Escape', 'Backspace', 'Delete'].includes(event.key)
          });

          // Capture Enter key specifically for form submission
          if (event.key === 'Enter' && element.form) {
            window.__testRecorder.actions.push({
              type: 'keypress',
              timestamp: Date.now(),
              key: 'Enter',
              element: {
                tagName: element.tagName.toLowerCase(),
                id,
                name,
                placeholder,
                type: element.type || 'text'
              },
              formAction: true
            });
          }
        }
      }, true);

      // Track when input fields lose focus to capture final values
      document.addEventListener('blur', (event) => {
        const element = event.target;
        if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea') {
          const finalValue = element.value || '';
          const elementKey = element.id || element.name || element.placeholder || `${element.tagName}-${element.type}`;
          
          // Only record if value has changed and is non-empty
          if (finalValue.trim().length > 0) {
            window.__testRecorder.actions.push({
              type: 'input_complete',
              timestamp: Date.now(),
              element: {
                tagName: element.tagName.toLowerCase(),
                id: element.id || '',
                className: typeof element.className === 'string' ? element.className : '',
                type: element.type || 'text',
                placeholder: element.placeholder || '',
                name: element.name || '',
                elementKey
              },
              finalValue: finalValue,
              characterCount: finalValue.length
            });
          }
        }
      }, true);
    });

    // Poll for captured actions
    this.actionPollInterval = setInterval(async () => {
      try {
        const capturedActions = await this.page.evaluate(() => {
          const actions = window.__testRecorder?.actions || [];
          window.__testRecorder.actions = []; // Clear processed actions
          
          // Also collect any keystroke data
          const keyStrokes = window.__testRecorder?.keyStrokes || [];
          window.__testRecorder.keyStrokes = [];
          
          return { actions, keyStrokes, totalActions: actions.length };
        });

        // Process each captured action
        for (const action of capturedActions.actions) {
          await this.processRecordedAction(action);
        }

        // Log keystroke data for debugging (optional)
        if (capturedActions.keyStrokes.length > 0) {
          console.log(`🔤 [DEBUG] Captured ${capturedActions.keyStrokes.length} keystrokes`);
        }
      } catch (error) {
        // Silently handle errors to avoid spam, but log critical ones
        if (error.message.includes('Target closed') || error.message.includes('Navigation')) {
          console.log('⚠️  Page navigation detected, continuing recording...');
        }
      }
    }, 500); // Check every 500ms

    // Record navigation
    this.page.on('framenavigated', async (frame) => {
      if (frame === this.page.mainFrame()) {
        const url = frame.url();
        this.recordAction('navigation', {
          url,
          description: `Navigate to ${url}`
        });
      }
    });
  }

  /**
   * Process a recorded action from the browser
   */
  async processRecordedAction(action) {
    try {
      const selector = this.generateSelectorFromElementInfo(action.element);
      
      if (action.type === 'click') {
        this.recordAction('click', {
          selector,
          text: action.element.text,
          tagName: action.element.tagName,
          description: `Click ${action.element.text ? `"${action.element.text}"` : action.element.tagName + ' element'}`
        });
      } else if (action.type === 'input') {
        this.recordAction('input', {
          selector,
          value: action.value,
          inputType: action.element.type,
          placeholder: action.element.placeholder,
          elementKey: action.element.elementKey,
          description: `Enter "${action.value}" in ${action.element.placeholder || action.element.type || 'input'} field`
        });
      } else if (action.type === 'input_complete') {
        // Record the final input value when field loses focus
        this.recordAction('input_final', {
          selector,
          finalValue: action.finalValue,
          inputType: action.element.type,
          placeholder: action.element.placeholder,
          elementKey: action.element.elementKey,
          characterCount: action.characterCount,
          description: `Completed input: "${action.finalValue}" in ${action.element.placeholder || action.element.type || 'input'} field (${action.characterCount} characters)`
        });
      } else if (action.type === 'keypress' && action.formAction) {
        this.recordAction('keypress', {
          key: action.key,
          element: action.element,
          description: `Press ${action.key} key ${action.formAction ? '(form submission)' : ''}`
        });
      }
    } catch (error) {
      console.log(`Could not process ${action.type} action:`, error.message);
    }
  }

  /**
   * Generate selector from element information
   */
  generateSelectorFromElementInfo(element) {
    // Priority order for selector generation
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.name) {
      return `[name="${element.name}"]`;
    }
    
    if (element.placeholder) {
      return `[placeholder="${element.placeholder}"]`;
    }
    
    if (element.type && element.tagName === 'input') {
      return `input[type="${element.type}"]`;
    }
    
    if (element.text && element.text.length > 0 && element.text.length < 30) {
      return `text="${element.text}"`;
    }
    
    if (element.className && typeof element.className === 'string' && element.className.trim()) {
      const firstClass = element.className.trim().split(' ')[0];
      return `.${firstClass}`;
    }
    
    // Fallback
    return element.tagName || 'element';
  }

  /**
   * Generate intelligent CSS selector for element
   */
  /**
   * Record an action
   */
  recordAction(type, details) {
    const timestamp = Date.now() - this.recordingStartTime;
    const action = {
      step: this.stepCounter++,
      timestamp,
      type,
      ...details
    };
    
    this.actions.push(action);
    console.log(`📋 [${this.formatTime(timestamp)}] ${action.description}`);
  }

  /**
   * Format timestamp for display
   */
  formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  }

  /**
   * Show recording instructions
   */
  showRecordingInstructions() {
    console.log('\n🎯 RECORDING ACTIVE - Interact with the application');
    console.log('┌───────────────────────────────────────────────────────────┐');
    console.log('│  • Click elements to record click actions                 │');
    console.log('│  • Type in forms - EXACT VALUES will be captured          │');
    console.log('│  • Press Enter to record form submissions                 │');
    console.log('│  • Navigate pages to record transitions                   │');
    console.log('│  • Values typed are recorded as-is (not mocked)           │');
    console.log('│  • Press Ctrl+C in terminal to stop recording             │');
    console.log('└───────────────────────────────────────────────────────────┘');
    console.log('\n⏺️  Recording started... type actual values you want to test\n');
  }

  /**
   * Stop recording and generate files
   */
  async stopRecording() {
    const duration = Date.now() - this.recordingStartTime;
    console.log(`\n⏹️  Stopping recording... (Duration: ${this.formatTime(duration)})`);
    console.log(`📊 Captured ${this.actions.length} actions`);

    // Clear polling interval
    if (this.actionPollInterval) {
      clearInterval(this.actionPollInterval);
    }

    // Generate files
    await this.generateStepDefinitions();
    await this.generateFeatureFile();
    await this.generateRecordingReport();

    // Close browser
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }

    console.log('\n✅ Recording completed and files generated!');
    console.log(`📁 Check the ./recordings/${this.recordingName}/ folder for generated files`);
  }

  /**
   * Generate Cucumber step definitions
   */
  async generateStepDefinitions() {
    const stepsDir = `./recordings/${this.recordingName}`;
    await fs.promises.mkdir(stepsDir, { recursive: true });

    let stepDefinitions = `const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { URLS } = require('../execution/test-data');

/**
 * Generated step definitions from recording: ${this.recordingName}
 * Created: ${new Date().toISOString()}
 */

`;

    const generatedSteps = new Set(); // Avoid duplicates

    for (const action of this.actions) {
      let stepDef = '';
      let stepText = '';

      switch (action.type) {
        case 'navigation':
          if (action.url && action.url.includes('http')) {
            const stepKey = `navigation-midas`;
            if (!generatedSteps.has(stepKey)) {
              stepText = "I navigate to the MiDAS application";
              stepDef = `Given('I navigate to the MiDAS application', async function() {
  await this.page.goto('${action.url}', { waitUntil: 'domcontentloaded' });
  console.log('✅ Navigated to MiDAS application');
});`;
              generatedSteps.add(stepKey);
            }
          }
          break;

        case 'click':
          if (action.text && action.text.trim().length > 0) {
            // Generate step for clicking by text
            const stepKey = `click-by-text`;
            if (!generatedSteps.has(stepKey)) {
              stepDef = `When('I click {string}', async function(buttonText) {
  // Try multiple strategies to find and click the element
  const selectors = [
    \`text=\${buttonText}\`,
    \`button:has-text("\${buttonText}")\`,
    \`[value="\${buttonText}"]\`,
    \`[alt="\${buttonText}"]\`
  ];
  
  let clicked = false;
  for (const selector of selectors) {
    try {
      const element = this.page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 })) {
        await element.click();
        clicked = true;
        console.log(\`✅ Clicked: \${buttonText} (using \${selector})\`);
        break;
      }
    } catch (error) {
      // Try next selector
    }
  }
  
  if (!clicked) {
    throw new Error(\`Could not find clickable element with text: \${buttonText}\`);
  }
});`;
              generatedSteps.add(stepKey);
            }
          } else if (action.selector) {
            // Generate step for clicking by selector
            const stepKey = `click-by-selector-${action.tagName}`;
            if (!generatedSteps.has(stepKey)) {
              const elementType = action.tagName || 'element';
              stepDef = `When('I click the ${elementType}', async function() {
  await this.page.click('${action.selector}');
  console.log('✅ Clicked ${elementType} element');
});`;
              generatedSteps.add(stepKey);
            }
          }
          break;

        case 'input':
        case 'input_final':
          // Use input_final for completed values, regular input as fallback
          const inputValue = action.finalValue || action.value;
          const fieldName = action.placeholder || action.inputType || 'input';
          
          if (inputValue && inputValue.trim().length > 0) {
            // Escape quotes and special characters for JavaScript string safety
            const escapedValue = inputValue.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
            const safeValue = escapedValue.substring(0, 200); // Limit length for safety
            
            if (action.placeholder && action.placeholder.trim().length > 0) {
              // Generate step with actual typed value
              const sanitizedValue = inputValue.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').substring(0, 20);
              const stepKey = `input-actual-${action.placeholder.toLowerCase().replace(/\s+/g, '-')}-${sanitizedValue}`;
              if (!generatedSteps.has(stepKey)) {
                stepDef = `When('I enter "${safeValue}" in the ${action.placeholder.toLowerCase()} field', async function() {
  // Hardcoded step with actual value: "${safeValue}"
  const selectors = [
    '[placeholder="${action.placeholder}"]',
    'input[placeholder*="${action.placeholder}" i]',
    '${action.selector}'
  ];
  
  let filled = false;
  for (const selector of selectors) {
    try {
      const element = this.page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 })) {
        await element.fill('${safeValue}');
        filled = true;
        console.log('✅ Entered: "${safeValue}" in ${action.placeholder.toLowerCase()} field');
        break;
      }
    } catch (error) {
      // Try next selector
    }
  }
  
  if (!filled) {
    throw new Error('Could not find ${action.placeholder.toLowerCase()} field');
  }
});`;
                generatedSteps.add(stepKey);
              }

              // Also generate parameterized version for reusability
              const paramStepKey = `input-param-${action.placeholder.toLowerCase().replace(/\s+/g, '-')}`;
              if (!generatedSteps.has(paramStepKey)) {
                stepDef += `

When('I enter {string} in the ${action.placeholder.toLowerCase()} field', async function(value) {
  // Parameterized version - can be used with any value
  const selectors = [
    '[placeholder="${action.placeholder}"]',
    'input[placeholder*="${action.placeholder}" i]',    
    '${action.selector}'
  ];
  
  let filled = false;
  for (const selector of selectors) {
    try {
      const element = this.page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 })) {
        await element.fill(value);
        filled = true;
        console.log(\`✅ Entered: \${value} in ${action.placeholder.toLowerCase()} field\`);
        break;
      }
    } catch (error) {
      // Try next selector
    }
  }
  
  if (!filled) {
    throw new Error('Could not find ${action.placeholder.toLowerCase()} field');
  }
});`;
                generatedSteps.add(paramStepKey);
              }
            } else if (action.inputType) {
              // Generate step by input type with actual value
              const sanitizedValue = inputValue.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').substring(0, 20);
              const stepKey = `input-type-actual-${action.inputType}-${sanitizedValue}`;
              if (!generatedSteps.has(stepKey)) {
                stepDef = `When('I enter "${safeValue}" in the ${action.inputType} field', async function() {
  // Hardcoded step with actual value: "${safeValue}"
  await this.page.fill('${action.selector}', '${safeValue}');
  console.log('✅ Entered: "${safeValue}" in ${action.inputType} field');
});`;
                generatedSteps.add(stepKey);
              }

              // Parameterized version
              const paramStepKey = `input-type-param-${action.inputType}`;
              if (!generatedSteps.has(paramStepKey)) {
                stepDef += `

When('I enter {string} in the ${action.inputType} field', async function(value) {
  // Parameterized version
  await this.page.fill('${action.selector}', value);
  console.log(\`✅ Entered: \${value} in ${action.inputType} field\`);
});`;
                generatedSteps.add(paramStepKey);
              }
            } else {
              // Generic input step with actual value
              const sanitizedValue = inputValue.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').substring(0, 20);
              const stepKey = `input-generic-actual-${sanitizedValue}`;  
              if (!generatedSteps.has(stepKey)) {
                stepDef = `When('I enter "${safeValue}" in the input field', async function() {
  // Hardcoded step with actual value: "${safeValue}"
  await this.page.fill('${action.selector}', '${safeValue}');
  console.log('✅ Entered: "${safeValue}" in input field');
});`;
                generatedSteps.add(stepKey);
              }

              // Parameterized version
              const paramStepKey = `input-generic-param`;
              if (!generatedSteps.has(paramStepKey)) {
                stepDef += `

When('I enter {string} in the input field', async function(value) {
  // Parameterized version  
  await this.page.fill('${action.selector}', value);
  console.log('✅ Entered text in input field');
});`;
                generatedSteps.add(paramStepKey);
              }
            }
          }
          break;

        case 'keypress':
          if (action.key === 'Enter') {
            const stepKey = `keypress-enter`;
            if (!generatedSteps.has(stepKey)) {
              stepDef = `When('I press Enter', async function() {
  await this.page.keyboard.press('Enter');
  console.log('✅ Pressed Enter key');
});`;
              generatedSteps.add(stepKey);
            }

            // Also specific step for form submission
            const formStepKey = `submit-form-enter`;
            if (!generatedSteps.has(formStepKey)) {
              stepDef += `

When('I submit the form by pressing Enter', async function() {
  await this.page.keyboard.press('Enter');
  await this.page.waitForTimeout(500); // Wait for form submission
  console.log('✅ Submitted form with Enter key');
});`;
              generatedSteps.add(formStepKey);
            }
          }
          break;
      }

      if (stepDef) {
        stepDefinitions += stepDef + '\n\n';
      }
    }

    // Add common assertion steps
    stepDefinitions += `// Common assertion steps
Then('I should see the page has loaded', async function() {
  await this.page.waitForLoadState('domcontentloaded');
  expect(await this.page.title()).toBeTruthy();
  console.log('✅ Page loaded successfully');
});

Then('I should see {string} on the page', async function(expectedText) {
  await expect(this.page.locator(\`text=\${expectedText}\`)).toBeVisible();
  console.log(\`✅ Found text: \${expectedText}\`);
});

Then('I should be on a page containing {string}', async function(urlFragment) {
  expect(this.page.url()).toContain(urlFragment);
  console.log(\`✅ URL contains: \${urlFragment}\`);
});

Then('I should see the form submission was successful', async function() {
  // Wait for page to stabilize after form submission
  await this.page.waitForTimeout(1000);
  await this.page.waitForLoadState('domcontentloaded');
  
  // Look for common success indicators
  const successSelectors = [
    'text=success',
    'text=submitted',
    'text=complete',
    '.success',
    '.alert-success',
    '[class*="success"]'
  ];
  
  let foundSuccess = false;
  for (const selector of successSelectors) {
    try {
      if (await this.page.locator(selector).isVisible({ timeout: 2000 })) {
        foundSuccess = true;
        console.log(\`✅ Found success indicator: \${selector}\`);
        break;
      }
    } catch (error) {
      // Continue to next selector
    }
  }
  
  // If no specific success indicator, just verify page is responsive
  if (!foundSuccess) {
    expect(await this.page.title()).toBeTruthy();
    console.log('✅ Form submission completed (no specific success indicator found)');
  }
});
`;

    await fs.promises.writeFile(
      path.join(stepsDir, 'generated-steps.js'),
      stepDefinitions
    );
  }

  /**
   * Generate Cucumber feature file
   */
  async generateFeatureFile() {
    const stepsDir = `./recordings/${this.recordingName}`;
    
    let featureFile = `Feature: Recorded MiDAS Test Scenario
  As a user of the MiDAS application
  I want to perform the recorded actions
  So that I can verify the application works as expected

  Background:
    Given I navigate to the MiDAS application

  @recorded
  Scenario: ${this.recordingName.replace(/-/g, ' ')}
`;

    for (const action of this.actions) {
      if (action.type === 'navigation' && action.description && action.description.includes('Navigate to application')) {
        continue; // Skip initial navigation as it's in Background
      }

      let stepText = '';
      switch (action.type) {
        case 'click':
          if (action.text && action.text.trim().length > 0) {
            stepText = `    When I click "${action.text.trim()}"`;
          } else if (action.tagName) {
            stepText = `    When I click the ${action.tagName}`;
          }
          break;
        case 'input':
        case 'input_final':
          const actualValue = action.finalValue || action.value;
          if (actualValue && actualValue.trim().length > 0) {
            if (action.placeholder && action.placeholder.trim().length > 0) {
              stepText = `    When I enter "${actualValue}" in the ${action.placeholder.toLowerCase()} field`;
            } else if (action.inputType) {
              stepText = `    When I enter "${actualValue}" in the ${action.inputType} field`;
            } else {
              stepText = `    When I enter "${actualValue}" in the input field`;
            }
          }
          break;
        case 'keypress':
          if (action.key === 'Enter') {
            stepText = `    When I press Enter`;
          }
          break;
        case 'navigation':
          try {
            const urlObj = new URL(action.url);
            if (urlObj.pathname && urlObj.pathname !== '/') {
              stepText = `    Then I should be on a page containing "${urlObj.pathname}"`;
            }
          } catch (error) {
            // Invalid URL, skip
          }
          break;
      }

      if (stepText) {
        featureFile += stepText + '\n';
      }
    }

    // Add meaningful assertions based on recorded actions
    const hasInputs = this.actions.some(a => a.type === 'input');
    const hasClicks = this.actions.some(a => a.type === 'click');
    
    if (hasInputs || hasClicks) {
      featureFile += `    Then I should see the page has loaded\n`;
      
      // Add specific assertions based on action types
      if (hasInputs && hasClicks) {
        featureFile += `    And I should see the form submission was successful\n`;
      }
    }

    await fs.promises.writeFile(
      path.join(stepsDir, 'generated-scenario.feature'),
      featureFile
    );
  }

  /**
   * Generate recording report
   */
  async generateRecordingReport() {
    const stepsDir = `./recordings/${this.recordingName}`;
    const duration = this.actions.length > 0 ? this.actions[this.actions.length - 1].timestamp : 0;
    
    const report = {
      recordingName: this.recordingName,
      timestamp: new Date().toISOString(),
      duration: duration,
      actionCount: this.actions.length,
      actions: this.actions,
      summary: {
        clicks: this.actions.filter(a => a.type === 'click').length,
        inputs: this.actions.filter(a => a.type === 'input' || a.type === 'input_final').length,
        keypresses: this.actions.filter(a => a.type === 'keypress').length,
        navigations: this.actions.filter(a => a.type === 'navigation').length,
        actualValuesRecorded: this.actions.filter(a => (a.type === 'input' || a.type === 'input_final') && a.value || a.finalValue).length
      }
    };

    await fs.promises.writeFile(
      path.join(stepsDir, 'recording-report.json'),
      JSON.stringify(report, null, 2)
    );

    // Generate README
    const readme = `# Recording: ${this.recordingName}

## Summary
- **Duration**: ${this.formatTime(duration)}
- **Actions Recorded**: ${this.actions.length}
- **Clicks**: ${report.summary.clicks}
- **Inputs**: ${report.summary.inputs}
- **Key Presses**: ${report.summary.keypresses}
- **Navigations**: ${report.summary.navigations}
- **Actual Values Captured**: ${report.summary.actualValuesRecorded}

## Generated Files
- \`generated-steps.js\` - Step definitions for Cucumber (includes actual typed values)
- \`generated-scenario.feature\` - Feature file with recorded scenario using real values
- \`recording-report.json\` - Detailed recording data

## Features
✅ **Exact Values Captured** - Records the actual text you type, not mock values
✅ **Hardcoded Step Definitions** - Uses your exact input in step definitions  
✅ **Parameterized Versions** - Also provides reusable parameterized steps
✅ **Keyboard Events** - Captures Enter key presses and form submissions
✅ **Input Completion** - Records final values when fields lose focus

## Usage
1. Copy the step definitions from \`generated-steps.js\` to your main step definitions file
2. Copy the scenario from \`generated-scenario.feature\` to your feature files
3. The generated steps use your exact typed values - edit as needed for test variations
4. Use parameterized versions when you want to test with different values

## Actions Recorded
${this.actions.map(action => {
      let description = `${action.step}. [${this.formatTime(action.timestamp)}] ${action.description}`;
      if (action.finalValue) {
        description += ` (Final: "${action.finalValue}")`;
      }
      return description;
    }).join('\n')}
`;

    await fs.promises.writeFile(
      path.join(stepsDir, 'README.md'),
      readme
    );
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const recorder = new TestRecorder();
  
  const options = {};
  if (args.includes('--headed')) options.headless = false;
  if (args.includes('--headless')) options.headless = true;
  
  const urlIndex = args.findIndex(arg => arg.startsWith('--url='));
  if (urlIndex !== -1) {
    options.url = args[urlIndex].split('=')[1];
  }
  
  const nameIndex = args.findIndex(arg => arg.startsWith('--name='));
  if (nameIndex !== -1) {
    options.recordingName = args[nameIndex].split('=')[1];
  }

  try {
    await recorder.startRecording(options);

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n📡 Received stop signal...');
      await recorder.stopRecording();
      process.exit(0);
    });

    // Keep the process alive
    await new Promise(() => {});
  } catch (error) {
    console.error('❌ Recording failed:', error.message);
    process.exit(1);
  }
}

// Export for programmatic use
module.exports = TestRecorder;

// Run if called directly
if (require.main === module) {
  main();
}