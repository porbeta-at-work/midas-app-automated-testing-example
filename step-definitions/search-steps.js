const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { URLS } = require('../utils/execution/test-data');

Given('I navigate to the MiDAS application', async function() {
  await this.page.goto(URLS.base, { waitUntil: 'domcontentloaded' });
  console.log('✅ Navigated to MiDAS application');
});

When('I enter {string} in the Last Name field', async function(value) {
  const inputXPath = '//*[@id="last_name"]';
  let filled = false;
  
  try {
      const element = this.page.locator(`xpath=${inputXPath}`).first();
      if (await element.isVisible({ timeout: 1000 })) {
        await element.fill(value);
        filled = true;
        console.log(`✅ Entered: ${value} in Last Name field`);
        // Small pause to see the action
        if (process.env.SLOW_MO || process.env.HEADED === 'true') {
          await this.page.waitForTimeout(300);
        }
      }
    } catch (error) {
      // Try next selector
    }
  
  if (!filled) {
    throw new Error('Could not find Last Name field');
  }
});

When('I enter {string} in the A Number field', async function(value) {
  const inputXPath = '//*[@id="a_number"]';
  let filled = false;
  
  try {
      const element = this.page.locator(`xpath=${inputXPath}`).first();
      if (await element.isVisible({ timeout: 1000 })) {
        await element.fill(value);
        filled = true;
        console.log(`✅ Entered: ${value} in A Number field`);
        // Small pause to see the action
        if (process.env.SLOW_MO || process.env.HEADED === 'true') {
          await this.page.waitForTimeout(300);
        }
      }
    } catch (error) {
      // Try next selector
    }
  
  if (!filled) {
    throw new Error('Could not find A Number field');
  }
});

When('I enter {string} in the C Number field', async function(value) {
  const inputXPath = '//*[@id="c_number"]';
  let filled = false;
  
  try {
      const element = this.page.locator(`xpath=${inputXPath}`).first();
      if (await element.isVisible({ timeout: 1000 })) {
        await element.fill(value);
        filled = true;
        console.log(`✅ Entered: ${value} in C Number field`);
        // Small pause to see the action
        if (process.env.SLOW_MO || process.env.HEADED === 'true') {
          await this.page.waitForTimeout(300);
        }
      }
    } catch (error) {
      // Try next selector
    }
  
  if (!filled) {
    throw new Error('Could not find C Number field');
  }
});

When('I click the "Search records" button', async function() {
  // Use specific XPath for MiDAS Search records button
  const searchButtonXPath = '//*[@id="accordion-content-search"]/div/div[11]/button';
  const resultsTableXPath = '//*[@id="accordion-content-results"]/div/div/div[2]/div[1]/div[2]/table';
  
  try {
    console.log(`🎯 Clicking search button using XPath: ${searchButtonXPath}`);
    await this.page.locator(`xpath=${searchButtonXPath}`).click();
    console.log('✅ Clicked search button');
    
    // Dynamic waiting for results table with loading indicators
    console.log('⏳ Waiting for results table to load...');
    const resultsTable = this.page.locator(`xpath=${resultsTableXPath}`);
    
    // Step 1: Wait for table to be visible (with longer timeout for slow responses)
    console.log('⏳ Waiting for results table to appear...');
    await resultsTable.waitFor({ state: 'visible', timeout: 60000 });
    console.log('👁️  Results table is now visible');
    
    // Step 2: Dynamically wait for table to have data with polling feedback
    console.log('⏳ Waiting for table data to populate...');
    
    const hasTableData = await this.page.waitForFunction(
      (tableXPath) => {
        const table = document.evaluate(tableXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (!table) return false;
        
        // Check if table has tbody with rows containing actual data
        const tbody = table.querySelector('tbody');
        if (!tbody) return false;
        
        const rows = tbody.querySelectorAll('tr');
        
        // Check for "no results" or "loading" messages
        if (rows.length === 1) {
          const firstRowText = rows[0].textContent.toLowerCase();
          if (firstRowText.includes('no results') || firstRowText.includes('no records') || firstRowText.includes('loading')) {
            return firstRowText.includes('no results') || firstRowText.includes('no records'); // Return true for "no results" as that's valid completion
          }
        }
        
        // Check for actual data rows
        return rows.length > 0 && rows[0].children.length > 0 && rows[0].textContent.trim() !== '';
      },
      resultsTableXPath,
      { 
        timeout: 60000, // 60-second max timeout
        polling: 1000   // Check every second
      }
    );
    
    if (hasTableData) {
      console.log('✅ Results table loaded successfully with data');
    } else {
      console.log('ℹ️  Search completed (may have no results)');
    }
    
    // Small pause to see the results
    if (process.env.SLOW_MO || process.env.HEADED === 'true') {
      await this.page.waitForTimeout(1000);
    }
    
  } catch (error) {
    console.error('❌ Failed to click search button or load results:', error.message);
    throw new Error(`Could not click search button or load results table: ${error.message}`);
  }
});

When('I click on the Compare button on row {int}', async function(rowNumber) {
  // Use specific XPath pattern for Compare button on a given row
  const compareButtonXPath = `//*[@id="accordion-content-results"]/div/div/div[2]/div[1]/div[2]/table/tbody/tr[${rowNumber}]/td[2]/div/div[5]/button`;
  
  try {
    console.log(`🎯 Clicking Compare button on row ${rowNumber} using XPath: ${compareButtonXPath}`);
    
    // Wait for the button to be visible and clickable
    const compareButton = this.page.locator(`xpath=${compareButtonXPath}`);
    await compareButton.waitFor({ state: 'visible', timeout: 10000 });
    
    // Click the Compare button
    await compareButton.click();
    console.log(`✅ Clicked Compare button on row ${rowNumber}`);
    
    // Small pause to see the action
    if (process.env.SLOW_MO || process.env.HEADED === 'true') {
      await this.page.waitForTimeout(500);
    }
    
  } catch (error) {
    console.error(`❌ Failed to click Compare button on row ${rowNumber}:`, error.message);
    throw new Error(`Could not click Compare button on row ${rowNumber}: ${error.message}`);
  }
});

When('I open the Details for row {int}', async function(rowNumber) {
  // Use specific XPath pattern for Details button on a given row
  const detailsButtonXPath = `//*[@id="accordion-content-results"]/div/div/div[2]/div[1]/div[2]/table/tbody/tr[${rowNumber}]/td[1]/button`;
  
  try {
    console.log(`🎯 Clicking Details button on row ${rowNumber} using XPath: ${detailsButtonXPath}`);
    
    // Wait for the button to be visible and clickable
    const detailsButton = this.page.locator(`xpath=${detailsButtonXPath}`);
    await detailsButton.waitFor({ state: 'visible', timeout: 10000 });
    
    // Click the Details button
    await detailsButton.click();
    console.log(`✅ Clicked Details button on row ${rowNumber}`);
    
    // Verify that the details section opens with h3 containing 'Details for'
    console.log(`🔍 Verifying details section opened for row ${rowNumber}...`);
    
    try {
      // Look for h3 containing "Details for" text specifically in the next row after the clicked row
      const nextRowXPath = `//*[@id="accordion-content-results"]/div/div/div[2]/div[1]/div[2]/table/tbody/tr[${rowNumber + 1}]`;
      const detailsHeader = this.page.locator(`xpath=${nextRowXPath}`).locator('h3').filter({ hasText: 'Details for' });
      await detailsHeader.waitFor({ state: 'visible', timeout: 5000 });
      
      console.log(`✅ Details section opened successfully for row ${rowNumber} (found in row ${rowNumber + 1})`);
      
    } catch (error) {
      throw new Error(`Details section did not open for row ${rowNumber} - h3 with 'Details for' text not found in the next row`);
    }
    
    // Small pause to see the action
    if (process.env.SLOW_MO || process.env.HEADED === 'true') {
      await this.page.waitForTimeout(500);
    }
    
  } catch (error) {
    console.error(`❌ Failed to open Details for row ${rowNumber}:`, error.message);
    throw new Error(`Could not open Details for row ${rowNumber}: ${error.message}`);
  }
});

When('I click the Compare button for DOC ID {string} in the Details section of row {int}', async function(docId, mainRowNumber) {
  // Use the details section from the specified main row
  const detailsSectionXPath = `//*[@id="accordion-content-results"]/div/div/div[2]/div[1]/div[2]/table/tbody/tr[${mainRowNumber + 1}]`;
  
  try {
    console.log(`🔍 Looking for DOC ID "${docId}" in Details section of row ${mainRowNumber}...`);
    
    // First, ensure the details section is visible
    const detailsSection = this.page.locator(`xpath=${detailsSectionXPath}`);
    await detailsSection.waitFor({ state: 'visible', timeout: 5000 });
    
    // Search through the details table rows to find the one with matching DOC ID
    let foundRow = false;
    let detailsRowNumber = 1;
    const maxRows = 10; // Reasonable limit to prevent infinite loop
    
    for (detailsRowNumber = 1; detailsRowNumber <= maxRows; detailsRowNumber++) {
      const docIdXPath = `//*[@id="accordion-content-results"]/div/div/div[2]/div[1]/div[2]/table/tbody/tr[${mainRowNumber + 1}]/td/div/div/div[2]/div[1]/div[2]/table/tbody/tr[${detailsRowNumber}]/td[6]`;
      
      try {
        const docIdElement = this.page.locator(`xpath=${docIdXPath}`);
        
        // Check if this row exists and is visible
        if (await docIdElement.isVisible({ timeout: 1000 })) {
          const currentDocId = await docIdElement.textContent();
          
          if (currentDocId && currentDocId.trim() === docId.trim()) {
            console.log(`✅ Found matching DOC ID "${docId}" in details row ${detailsRowNumber}`);
            foundRow = true;
            break;
          } else {
            console.log(`🔍 Row ${detailsRowNumber}: DOC ID "${currentDocId?.trim()}" - not a match`);
          }
        } else {
          // Row doesn't exist, stop searching
          break;
        }
      } catch (error) {
        // Row doesn't exist or isn't visible, stop searching
        break;
      }
    }
    
    if (!foundRow) {
      throw new Error(`DOC ID "${docId}" not found in Details section of row ${mainRowNumber}`);
    }
    
    // Click the Compare button for the found row
    console.log(`🎯 Clicking Compare button for DOC ID "${docId}" in details row ${detailsRowNumber}...`);
    const compareButtonXPath = `//*[@id="accordion-content-results"]/div/div/div[2]/div[1]/div[2]/table/tbody/tr[${mainRowNumber + 1}]/td/div/div/div[2]/div[1]/div[2]/table/tbody/tr[${detailsRowNumber}]/td[1]/div/div[2]/button`;
    
    const compareButton = this.page.locator(`xpath=${compareButtonXPath}`);
    await compareButton.waitFor({ state: 'visible', timeout: 5000 });
    await compareButton.click();
    
    console.log(`✅ Clicked Compare button for DOC ID "${docId}" - added to Comparison table`);
    
    // Small pause to see the action
    if (process.env.SLOW_MO || process.env.HEADED === 'true') {
      await this.page.waitForTimeout(500);
    }
    
  } catch (error) {
    console.error(`❌ Failed to click Compare button for DOC ID "${docId}" in Details section of row ${mainRowNumber}:`, error.message);
    throw new Error(`Could not click Compare button for DOC ID "${docId}" in Details section of row ${mainRowNumber}: ${error.message}`);
  }
});

When('I open the Download File modal for Comparison row {int}', async function(rowNumber) {
  // Use specific XPath pattern for Download File modal button on comparison row
  const downloadButtonXPath = `//*[@id="main-content"]/div/div/div/div[2]/div/div[2]/table/tbody/tr[${rowNumber}]/td[1]/div/div[1]/button`;
  
  try {
    console.log(`🎯 Opening Download File modal for Comparison row ${rowNumber} using XPath: ${downloadButtonXPath}`);
    
    // Wait for the button to be visible and clickable
    const downloadButton = this.page.locator(`xpath=${downloadButtonXPath}`);
    await downloadButton.waitFor({ state: 'visible', timeout: 10000 });
    
    // Click the Download File modal button
    await downloadButton.click();
    console.log(`✅ Clicked Download File modal button for Comparison row ${rowNumber}`);
    
    // Wait for modal to appear (look for common modal indicators)
    console.log(`⏳ Waiting for Download File modal to appear...`);
    const modalSelectors = [
      '[role="dialog"]',
      '.modal',
      '[class*="modal"]',
      '[aria-modal="true"]',
      'text=Download'
    ];
    
    let modalFound = false;
    for (const selector of modalSelectors) {
      try {
        if (await this.page.locator(selector).isVisible({ timeout: 3000 })) {
          console.log(`✅ Download File modal opened successfully (found: ${selector})`);
          modalFound = true;
          break;
        }
      } catch (error) {
        // Try next selector
      }
    }
    
    if (!modalFound) {
      console.log(`⚠️  Download File modal may have opened but standard modal indicators not detected`);
    }
    
    // Small pause to see the action
    if (process.env.SLOW_MO || process.env.HEADED === 'true') {
      await this.page.waitForTimeout(500);
    }
    
  } catch (error) {
    console.error(`❌ Failed to open Download File modal for Comparison row ${rowNumber}:`, error.message);
    throw new Error(`Could not open Download File modal for Comparison row ${rowNumber}: ${error.message}`);
  }
});

Then('I should see a valid File for Comparison row {int}', async function(rowNumber) {
  // Use specific XPath pattern for the file link in comparison results
  const fileLinkXPath = `//*[@id="main-content"]/div/div/div/div[2]/div/div[2]/table/tbody/tr[${rowNumber}]/td[5]/a`;
  
  try {
    console.log(`🔍 Checking for valid file link on row ${rowNumber} using XPath: ${fileLinkXPath}`);
    
    // Wait for the link element to be visible
    const fileLink = this.page.locator(`xpath=${fileLinkXPath}`);
    await fileLink.waitFor({ state: 'visible', timeout: 10000 });
    
    // Get the href attribute
    const href = await fileLink.getAttribute('href');
    
    if (!href) {
      throw new Error(`File link on row ${rowNumber} does not have an href attribute`);
    }
    
    console.log(`📋 Found href: ${href}`);
    
    // Validate that the href is not empty and looks like a valid file URL
    if (href.trim() === '' || href === '#' || href === 'javascript:void(0)') {
      throw new Error(`File link on row ${rowNumber} has invalid href: ${href}`);
    }
    
    // Convert relative URLs to absolute URLs if needed
    let fullUrl = href;
    if (href.startsWith('/')) {
      const baseUrl = new URL(this.page.url()).origin;
      fullUrl = baseUrl + href;
    } else if (!href.startsWith('http')) {
      fullUrl = new URL(href, this.page.url()).href;
    }
    
    console.log(`🌐 Testing URL accessibility: ${fullUrl}`);
    
    // Test if the URL returns a successful HTTP response
    try {
      const response = await this.page.request.get(fullUrl, {
        timeout: 15000, // 15 second timeout for file downloads
        ignoreHTTPSErrors: true // In case of self-signed certificates
      });
      
      const statusCode = response.status();
      console.log(`📊 HTTP Status: ${statusCode}`);
      
      if (statusCode >= 200 && statusCode < 300) {
        console.log(`✅ File URL is accessible (${statusCode})`);
      } else if (statusCode >= 300 && statusCode < 400) {
        console.log(`🔄 File URL redirects (${statusCode}) - this may be acceptable`);
        // Redirects might be acceptable for file downloads
      } else {
        throw new Error(`File URL returned error status ${statusCode}`);
      }
      
      // Optional: Check Content-Type header for file types
      const contentType = response.headers()['content-type'];
      if (contentType) {
        console.log(`📄 Content-Type: ${contentType}`);
        
        // Validate it's actually a file and not HTML error page
        if (contentType.includes('text/html') && !href.includes('.html')) {
          console.log(`⚠️  Warning: Expected file but got HTML content - may be an error page`);
        }
      }
      
    } catch (requestError) {
      console.error(`❌ HTTP request failed: ${requestError.message}`);
      throw new Error(`File URL is not accessible: ${requestError.message}`);
    }
    
    // Additional validation - check if it looks like a file URL
    const validFilePattern = /\.(pdf|jpg|jpeg|png|gif|doc|docx|txt|csv|xlsx?|zip)$/i;
    const isValidFileUrl = validFilePattern.test(href) || href.includes('/file/') || href.includes('/document/') || href.includes('download');
    
    if (!isValidFileUrl) {
      console.log(`⚠️  Warning: URL may not be a standard file URL pattern: ${href}`);
    }
    
    // Verify the link is clickable
    await expect(fileLink).toBeVisible();
    
    console.log(`✅ Valid and accessible file link found on row ${rowNumber}: ${href}`);
    
  } catch (error) {
    console.error(`❌ Failed to validate file link on row ${rowNumber}:`, error.message);
    throw new Error(`Could not validate file link on row ${rowNumber}: ${error.message}`);
  }
});

Then('I can see {int} file\\(s) available in the Download File modal', async function(expectedFileCount) {
  // Use specific XPath for the file list container in the Download File modal
  const fileListXPath = '//*[@id="file-download-modal-description"]/div[2]/fieldset/div';
  
  try {
    console.log(`🔍 Checking for ${expectedFileCount} file(s) in Download File modal using XPath: ${fileListXPath}`);
    
    // Dynamic waiting for the file list container with error detection
    console.log(`⏳ Dynamically waiting for Download File modal content to load...`);
    
    let attempt = 0;
    const maxAttempts = 60; // 60 seconds max wait time
    let fileListContainer = null;
    
    while (attempt < maxAttempts) {
      try {
        // Check if the file list container is available first (positive check)
        fileListContainer = this.page.locator(`xpath=${fileListXPath}`);
        if (await fileListContainer.isVisible({ timeout: 1000 })) {
          console.log(`👁️  File list container is now visible after ${attempt + 1} second(s)`);
          break;
        }
        
        // Only check for specific error messages (not CSS classes) after some time has passed
        if (attempt > 10) { // Give it 10 seconds before checking for errors
          const specificErrorSelectors = [
            'text="Error loading files"',
            'text="Failed to load"',
            'text="No files found"',
            'text="Access denied"',
            'text="Server error"'
          ];
          
          for (const selector of specificErrorSelectors) {
            if (await this.page.locator(selector).isVisible({ timeout: 500 })) {
              throw new Error(`Download File modal shows specific error: ${selector}`);
            }
          }
        }
        
        // Check if modal is still open (if it disappeared, that's an error)
        const modalStillOpen = await this.page.locator('[role="dialog"], .modal, [class*="modal"], [aria-modal="true"]').isVisible({ timeout: 500 });
        if (!modalStillOpen && attempt > 5) { // Give modal time to fully load before checking
          throw new Error('Download File modal closed unexpectedly while waiting for content');
        }
        
        attempt++;
        if (attempt % 10 === 0) {
          console.log(`⏳ Still waiting for file list content... (${attempt}s elapsed)`);
        }
        
        await this.page.waitForTimeout(1000); // Wait 1 second between checks
        
      } catch (error) {
        if (error.message.includes('Download File modal') || error.message.includes('specific error')) {
          throw error; // Re-throw our specific errors
        }
        // Continue waiting for other errors (element not found, etc.)
        attempt++;
        await this.page.waitForTimeout(1000);
      }
    }
    
    if (!fileListContainer || !await fileListContainer.isVisible({ timeout: 1000 })) {
      throw new Error(`File list container did not load within ${maxAttempts} seconds`);
    }
    
    // Count the number of child elements (files)
    console.log(`📊 Counting files in Download File modal...`);
    const fileElements = fileListContainer.locator('> *'); // Direct children only
    const actualFileCount = await fileElements.count();
    
    console.log(`📊 Found ${actualFileCount} file(s) in Download File modal`);
    
    // Verify the count matches the expected number
    if (actualFileCount === expectedFileCount) {
      console.log(`✅ File count matches expectation: ${actualFileCount} file(s)`);
    } else {
      throw new Error(`Expected ${expectedFileCount} file(s) but found ${actualFileCount} file(s) in Download File modal`);
    }
    
    // Optional: Log the file information for debugging
    if (actualFileCount > 0) {
      for (let i = 0; i < actualFileCount; i++) {
        try {
          const fileElement = fileElements.nth(i);
          const fileText = await fileElement.textContent();
          console.log(`📄 File ${i + 1}: ${fileText?.trim() || 'No text content'}`);
        } catch (error) {
          console.log(`📄 File ${i + 1}: Unable to read content`);
        }
      }
    }
    
  } catch (error) {
    console.error(`❌ Failed to verify file count in Download File modal:`, error.message);
    throw new Error(`Could not verify ${expectedFileCount} file(s) in Download File modal: ${error.message}`);
  }
});

// Common assertion steps
Then('I should see the page has loaded', async function() {
  await this.page.waitForLoadState('domcontentloaded');
  expect(await this.page.title()).toBeTruthy();
  console.log('✅ Page loaded successfully');
  
  // Pause at end of test to see results when running in headed mode
  if (process.env.SLOW_MO || process.env.HEADED === 'true') {
    console.log('⏸️  Pausing to view results...');
    await this.page.waitForTimeout(2000);
  }
});

Then('I should see {string} on the page', async function(expectedText) {
  await expect(this.page.locator(`text=${expectedText}`)).toBeVisible();
  console.log(`✅ Found text: ${expectedText}`);
});

Then('I should be on a page containing {string}', async function(urlFragment) {
  expect(this.page.url()).toContain(urlFragment);
  console.log(`✅ URL contains: ${urlFragment}`);
});