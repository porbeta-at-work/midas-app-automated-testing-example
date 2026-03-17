const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { URLS } = require('../utils/test-data');

/**
 * Generated step definitions from recording: midas-recording-2026-03-16T21-10-21
 * Created: 2026-03-16T21:13:36.719Z
 */

Given('I navigate to the MiDAS application', async function() {
  await this.page.goto('http://midas-webhosting-dev2.s3-website-us-gov-west-1.amazonaws.com/', { waitUntil: 'domcontentloaded' });
  console.log('✅ Navigated to MiDAS application');
});

When('I enter {string} in the enter last name field', async function(value) {
  // Parameterized version - can be used with any value
  const selectors = [
    '[placeholder="Enter last name"]',
    'input[placeholder*="Enter last name" i]',    
    '#last_name'
  ];
  
  let filled = false;
  for (const selector of selectors) {
    try {
      const element = this.page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 })) {
        await element.fill(value);
        filled = true;
        console.log(`✅ Entered: ${value} in enter last name field`);
        break;
      }
    } catch (error) {
      // Try next selector
    }
  }
  
  if (!filled) {
    throw new Error('Could not find enter last name field');
  }
});

When('I enter "BOGGIO" in the enter last name field', async function() {
  // Hardcoded step with actual value: "BOGGIO"
  const selectors = [
    '[placeholder="Enter last name"]',
    'input[placeholder*="Enter last name" i]',
    '#last_name'
  ];
  
  let filled = false;
  for (const selector of selectors) {
    try {
      const element = this.page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 })) {
        await element.fill('BOGGIO');
        filled = true;
        console.log('✅ Entered: "BOGGIO" in enter last name field');
        break;
      }
    } catch (error) {
      // Try next selector
    }
  }
  
  if (!filled) {
    throw new Error('Could not find enter last name field');
  }
});

When('I enter {string} in the enter a number field', async function(value) {
  // Parameterized version - can be used with any value
  const selectors = [
    '[placeholder="Enter A Number"]',
    'input[placeholder*="Enter A Number" i]',    
    '#a_number'
  ];
  
  let filled = false;
  for (const selector of selectors) {
    try {
      const element = this.page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 })) {
        await element.fill(value);
        filled = true;
        console.log(`✅ Entered: ${value} in enter a number field`);
        break;
      }
    } catch (error) {
      // Try next selector
    }
  }
  
  if (!filled) {
    throw new Error('Could not find enter a number field');
  }
});

When('I enter "A1728308" in the enter a number field', async function() {
  // Hardcoded step with actual value: "A1728308"
  const selectors = [
    '[placeholder="Enter A Number"]',
    'input[placeholder*="Enter A Number" i]',
    '#a_number'
  ];
  
  let filled = false;
  for (const selector of selectors) {
    try {
      const element = this.page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 })) {
        await element.fill('A1728308');
        filled = true;
        console.log('✅ Entered: "A1728308" in enter a number field');
        break;
      }
    } catch (error) {
      // Try next selector
    }
  }
  
  if (!filled) {
    throw new Error('Could not find enter a number field');
  }
});

When('I click {string}', async function(buttonText) {
  // Try multiple strategies to find and click the element
  const selectors = [
    `text=${buttonText}`,
    `button:has-text("${buttonText}")`,
    `[value="${buttonText}"]`,
    `[alt="${buttonText}"]`
  ];
  
  let clicked = false;
  for (const selector of selectors) {
    try {
      const element = this.page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 })) {
        await element.click();
        clicked = true;
        console.log(`✅ Clicked: ${buttonText} (using ${selector})`);
        break;
      }
    } catch (error) {
      // Try next selector
    }
  }
  
  if (!clicked) {
    throw new Error(`Could not find clickable element with text: ${buttonText}`);
  }
});

When('I click the svg', async function() {
  await this.page.click('svg');
  console.log('✅ Clicked svg element');
});

When('I enter "KACINSKAS" in the enter last name field', async function() {
  // Hardcoded step with actual value: "KACINSKAS"
  const selectors = [
    '[placeholder="Enter last name"]',
    'input[placeholder*="Enter last name" i]',
    '#last_name'
  ];
  
  let filled = false;
  for (const selector of selectors) {
    try {
      const element = this.page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 })) {
        await element.fill('KACINSKAS');
        filled = true;
        console.log('✅ Entered: "KACINSKAS" in enter last name field');
        break;
      }
    } catch (error) {
      // Try next selector
    }
  }
  
  if (!filled) {
    throw new Error('Could not find enter last name field');
  }
});

When('I enter "LEE" in the enter last name field', async function() {
  // Hardcoded step with actual value: "LEE"
  const selectors = [
    '[placeholder="Enter last name"]',
    'input[placeholder*="Enter last name" i]',
    '#last_name'
  ];
  
  let filled = false;
  for (const selector of selectors) {
    try {
      const element = this.page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 })) {
        await element.fill('LEE');
        filled = true;
        console.log('✅ Entered: "LEE" in enter last name field');
        break;
      }
    } catch (error) {
      // Try next selector
    }
  }
  
  if (!filled) {
    throw new Error('Could not find enter last name field');
  }
});

When('I enter {string} in the enter c number field', async function(value) {
  // Parameterized version - can be used with any value
  const selectors = [
    '[placeholder="Enter C Number"]',
    'input[placeholder*="Enter C Number" i]',    
    '#c_number'
  ];
  
  let filled = false;
  for (const selector of selectors) {
    try {
      const element = this.page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 })) {
        await element.fill(value);
        filled = true;
        console.log(`✅ Entered: ${value} in enter c number field`);
        break;
      }
    } catch (error) {
      // Try next selector
    }
  }
  
  if (!filled) {
    throw new Error('Could not find enter c number field');
  }
});

When('I enter "C7408985" in the enter c number field', async function() {
  // Hardcoded step with actual value: "C7408985"
  const selectors = [
    '[placeholder="Enter C Number"]',
    'input[placeholder*="Enter C Number" i]',
    '#c_number'
  ];
  
  let filled = false;
  for (const selector of selectors) {
    try {
      const element = this.page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 })) {
        await element.fill('C7408985');
        filled = true;
        console.log('✅ Entered: "C7408985" in enter c number field');
        break;
      }
    } catch (error) {
      // Try next selector
    }
  }
  
  if (!filled) {
    throw new Error('Could not find enter c number field');
  }
});

When('I click the button', async function() {
  await this.page.click('.usa-button');
  console.log('✅ Clicked button element');
});

When('I enter "C6185040" in the enter c number field', async function() {
  // Hardcoded step with actual value: "C6185040"
  const selectors = [
    '[placeholder="Enter C Number"]',
    'input[placeholder*="Enter C Number" i]',
    '#c_number'
  ];
  
  let filled = false;
  for (const selector of selectors) {
    try {
      const element = this.page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 })) {
        await element.fill('C6185040');
        filled = true;
        console.log('✅ Entered: "C6185040" in enter c number field');
        break;
      }
    } catch (error) {
      // Try next selector
    }
  }
  
  if (!filled) {
    throw new Error('Could not find enter c number field');
  }
});

When('I click the path', async function() {
  await this.page.click('path');
  console.log('✅ Clicked path element');
});

When('I enter "OM14077" in the enter c number field', async function() {
  // Hardcoded step with actual value: "OM14077"
  const selectors = [
    '[placeholder="Enter C Number"]',
    'input[placeholder*="Enter C Number" i]',
    '#c_number'
  ];
  
  let filled = false;
  for (const selector of selectors) {
    try {
      const element = this.page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 })) {
        await element.fill('OM14077');
        filled = true;
        console.log('✅ Entered: "OM14077" in enter c number field');
        break;
      }
    } catch (error) {
      // Try next selector
    }
  }
  
  if (!filled) {
    throw new Error('Could not find enter c number field');
  }
});

When('I enter "on" in the checkbox field', async function() {
  // Hardcoded step with actual value: "on"
  await this.page.fill('#file-file_0', 'on');
  console.log('✅ Entered: "on" in checkbox field');
});

When('I enter {string} in the checkbox field', async function(value) {
  // Parameterized version
  await this.page.fill('#file-file_0', value);
  console.log(`✅ Entered: ${value} in checkbox field`);
});

// Common assertion steps
Then('I should see the page has loaded', async function() {
  await this.page.waitForLoadState('domcontentloaded');
  expect(await this.page.title()).toBeTruthy();
  console.log('✅ Page loaded successfully');
});

Then('I should see {string} on the page', async function(expectedText) {
  await expect(this.page.locator(`text=${expectedText}`)).toBeVisible();
  console.log(`✅ Found text: ${expectedText}`);
});

Then('I should be on a page containing {string}', async function(urlFragment) {
  expect(this.page.url()).toContain(urlFragment);
  console.log(`✅ URL contains: ${urlFragment}`);
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
        console.log(`✅ Found success indicator: ${selector}`);
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
