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
      
      console.log(`✅ Details section header opened for row ${rowNumber} (found in row ${rowNumber + 1})`);
      
      // Now wait for the actual table data inside the details section to load
      console.log(`⏳ Waiting for details table data to populate...`);
      const detailsTableXPath = `${nextRowXPath}/td/div/div/div[2]/div[1]/div[2]/table`;
      const detailsTable = this.page.locator(`xpath=${detailsTableXPath}`);
      
      // Wait for the details table to be visible
      await detailsTable.waitFor({ state: 'visible', timeout: 10000 });
      
      // Wait for table to actually have data rows (not just loading state)
      const hasDetailsTableData = await this.page.waitForFunction(
        (tableXPath) => {
          const table = document.evaluate(tableXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          if (!table) return false;
          
          const tbody = table.querySelector('tbody');
          if (!tbody) return false;
          
          const rows = tbody.querySelectorAll('tr');
          
          // Check for actual data rows with content
          if (rows.length === 0) return false;
          
          // Check if first row has actual data (not loading message)
          const firstRowText = rows[0].textContent?.toLowerCase() || '';
          if (firstRowText.includes('loading') || firstRowText.includes('please wait')) {
            return false;
          }
          
          // Ensure first row has multiple cells with content
          return rows[0].children.length > 3 && rows[0].textContent.trim() !== '';
        },
        detailsTableXPath,
        { 
          timeout: 15000, // 15-second max timeout for details data
          polling: 500   // Check every 500ms
        }
      );
      
      if (hasDetailsTableData) {
        console.log(`✅ Details table data loaded successfully for row ${rowNumber}`);
      } else {
        console.log(`⚠️  Details table may not have loaded properly, but continuing...`);
      }
      
    } catch (error) {
      throw new Error(`Details section did not open properly for row ${rowNumber}: ${error.message}`);
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
    
    // Wait for the details table data to actually load before searching
    console.log(`⏳ Ensuring details table data is loaded before searching for DOC ID...`);
    const detailsTableXPath = `${detailsSectionXPath}/td/div/div/div[2]/div[1]/div[2]/table`;
    
    // Add specific wait for table data to load with retry logic
    let tableDataReady = false;
    for (let attempt = 1; attempt <= 10; attempt++) {
      try {
        const hasData = await this.page.waitForFunction(
          (tableXPath) => {
            const table = document.evaluate(tableXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (!table) return false;
            
            const tbody = table.querySelector('tbody');
            if (!tbody) return false;
            
            const rows = tbody.querySelectorAll('tr');
            return rows.length > 0 && rows[0].children.length > 3 && rows[0].textContent.trim() !== '';
          },
          detailsTableXPath,
          { timeout: 2000, polling: 200 }
        );
        
        if (hasData) {
          tableDataReady = true;
          console.log(`✅ Details table data confirmed loaded (attempt ${attempt})`);
          break;
        }
      } catch (error) {
        console.log(`⏳ Waiting for details table data... (attempt ${attempt}/10)`);
        if (attempt < 10) {
          await this.page.waitForTimeout(1000);
        }
      }
    }
    
    if (!tableDataReady) {
      console.log(`⚠️  Details table data may not be fully loaded, but proceeding with search...`);
    }
    
    // Search through the details table rows to find the one with matching DOC ID
    let foundRow = false;
    let bestMatchRow = null;
    let bestMatchType = 'none'; // 'exact', 'truncated', 'none'
    let bestMatchLength = 0;
    const maxRows = 10; // Reasonable limit to prevent infinite loop
    
    // First pass: Look for exact matches, collect truncated matches as backup
    for (let detailsRowNumber = 1; detailsRowNumber <= maxRows; detailsRowNumber++) {
      const docIdXPath = `//*[@id="accordion-content-results"]/div/div/div[2]/div[1]/div[2]/table/tbody/tr[${mainRowNumber + 1}]/td/div/div/div[2]/div[1]/div[2]/table/tbody/tr[${detailsRowNumber}]/td[5]`;
      
      try {
        const docIdElement = this.page.locator(`xpath=${docIdXPath}`);
        
        // Check if this row exists and is visible
        if (await docIdElement.isVisible({ timeout: 1000 })) {
          // Try multiple ways to get the full DOC ID (handling truncation)
          let currentDocId = await docIdElement.textContent();
          
          // If textContent seems truncated, try title attribute
          if (currentDocId && currentDocId.length < 15) { // DOC IDs should be longer
            const titleAttr = await docIdElement.getAttribute('title');
            if (titleAttr && titleAttr.trim().length > currentDocId.trim().length) {
              currentDocId = titleAttr;
              console.log(`🔍 Using title attribute for full DOC ID in row ${detailsRowNumber}: "${currentDocId}"`);
            }
          }
          
          // Check if the found DOC ID matches exactly
          if (currentDocId && currentDocId.trim() === docId.trim()) {
            console.log(`✅ Found EXACT matching DOC ID "${docId}" in details row ${detailsRowNumber}`);
            foundRow = true;
            bestMatchRow = detailsRowNumber;
            bestMatchType = 'exact';
            break; // Exact match found, use it immediately
          } 
          // Check for truncated version - but keep looking for better matches
          else if (currentDocId && docId.startsWith(currentDocId.trim()) && currentDocId.trim().length >= 6) {
            console.log(`🔍 Row ${detailsRowNumber}: Found truncated DOC ID match: "${currentDocId.trim()}" (${currentDocId.trim().length} chars)`);
            
            // Track the best truncated match (longest one)
            if (bestMatchType === 'none' || 
                (bestMatchType === 'truncated' && currentDocId.trim().length > bestMatchLength)) {
              bestMatchRow = detailsRowNumber;
              bestMatchType = 'truncated';
              bestMatchLength = currentDocId.trim().length;
              foundRow = true;
            }
          } else {
            console.log(`🔍 Row ${detailsRowNumber}: DOC ID "${currentDocId?.trim()}" - not a match for "${docId}"`);
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
    
    const detailsRowNumber = bestMatchRow;
    console.log(`✅ Using ${bestMatchType} match for DOC ID "${docId}" in details row ${detailsRowNumber}`);
    
    // Click the Compare button for the found row
    console.log(`🎯 Clicking Compare button for DOC ID "${docId}" in details row ${detailsRowNumber}...`);
    
    // Construct the Compare button XPath using the same detailsRowNumber where we found the DOC ID
    const compareButtonXPath = `//*[@id="accordion-content-results"]/div/div/div[2]/div[1]/div[2]/table/tbody/tr[${mainRowNumber + 1}]/td/div/div/div[2]/div[1]/div[2]/table/tbody/tr[${detailsRowNumber}]/td[1]/div/div[2]/button`;
    
    console.log(`📍 Using Compare button XPath: ${compareButtonXPath}`);
    console.log(`📋 Target: mainRow=${mainRowNumber + 1}, detailsRow=${detailsRowNumber}, DOC ID="${docId}"`);
    
    // Verify the Compare button exists in the same row as the DOC ID
    const compareButton = this.page.locator(`xpath=${compareButtonXPath}`);
    
    // Double-check we're clicking the button in the correct row by verifying the DOC ID is still there
    const verifyDocIdXPath = `//*[@id="accordion-content-results"]/div/div/div[2]/div[1]/div[2]/table/tbody/tr[${mainRowNumber + 1}]/td/div/div/div[2]/div[1]/div[2]/table/tbody/tr[${detailsRowNumber}]/td[5]`;
    const verifyDocIdElement = this.page.locator(`xpath=${verifyDocIdXPath}`);
    
    try {
      const verifyCurrentDocId = await verifyDocIdElement.textContent();
      console.log(`🔍 Verifying DOC ID in target row ${detailsRowNumber}: "${verifyCurrentDocId?.trim()}"`);
      
      // Ensure we're still looking at the right row
      if (!verifyCurrentDocId || (!verifyCurrentDocId.trim().includes(docId.substring(0, 8)) && !docId.includes(verifyCurrentDocId.trim()))) {
        throw new Error(`DOC ID verification failed: expected "${docId}" but found "${verifyCurrentDocId?.trim()}" in row ${detailsRowNumber}`);
      }
    } catch (verifyError) {
      console.error(`❌ Failed to verify DOC ID before clicking Compare button: ${verifyError.message}`);
      throw new Error(`Cannot verify correct row for DOC ID "${docId}": ${verifyError.message}`);
    }
    
    await compareButton.waitFor({ state: 'visible', timeout: 5000 });
    await compareButton.click();
    
    console.log(`✅ Clicked Compare button for DOC ID "${docId}" - added to Comparison table`);
    
    // Wait for the comparison table to actually populate with the new item
    console.log(`⏳ Waiting for comparison table to populate with new item...`);
    const comparisonTableXPath = '//*[@id="main-content"]/div/div/div/div[2]/div/div[2]/table';
    
    try {
      // Wait for comparison table to exist and have at least one row
      await this.page.waitForFunction(
        (tableXPath) => {
          const table = document.evaluate(tableXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          if (!table) return false;
          
          const tbody = table.querySelector('tbody');
          if (!tbody) return false;
          
          const rows = tbody.querySelectorAll('tr');
          // Check for at least one row with content
          return rows.length > 0 && rows[0].children.length > 2 && rows[0].textContent.trim() !== '';
        },
        comparisonTableXPath,
        { timeout: 15000, polling: 500 }
      );
      
      console.log(`✅ Comparison table populated successfully`);
    } catch (error) {
      console.log(`⚠️  Comparison table may not have populated fully, but proceeding...`);
    }
    
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
  // Handle both scenarios for comparison table file links:
  // 1. Multiple rows: //*[@id="main-content"]/div/div/div/div[2]/div/div[2]/table/tbody/tr[1]/td[5]/a
  // 2. Single row: //*[@id="main-content"]/div/div/div/div[2]/div/div[2]/table/tbody/tr/td[5]/div/a
  
  const fileLinkXPaths = [
    // Try specific row number first (multiple rows scenario)
    `//*[@id="main-content"]/div/div/div/div[2]/div/div[2]/table/tbody/tr[${rowNumber}]/td[5]/a`,
    // Try single row scenario (no row index, with extra div)
    `//*[@id="main-content"]/div/div/div/div[2]/div/div[2]/table/tbody/tr/td[5]/div/a`
  ];
  
  try {
    console.log(`🔍 Checking for file link on comparison row ${rowNumber}...`);
    
    let fileLink = null;
    let workingXPath = null;
    
    // Try each XPath pattern
    for (const xpath of fileLinkXPaths) {
      try {
        const link = this.page.locator(`xpath=${xpath}`);
        if (await link.isVisible({ timeout: 2000 })) {
          fileLink = link;
          workingXPath = xpath;
          console.log(`✅ Found file link using XPath: ${xpath}`);
          break;
        }
      } catch (error) {
        // Continue to next XPath
      }
    }
    
    if (!fileLink) {
      throw new Error(`File link not found using any expected XPath pattern for row ${rowNumber}`);
    }
    
    console.log(`✅ Found file link on row ${rowNumber}`);
    console.log(`🔍 Validating file link...`);
    
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
    
    // Enhanced dynamic waiting for the file list container with better error detection
    console.log(`⏳ Waiting for Download File modal content to fully load...`);
    
    // Use waitForFunction to wait until the element is present and has the expected content
    const fileListContainer = await this.page.waitForFunction(
      (xpath, expectedCount) => {
        const container = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (!container) return false;
        
        // Check if container has children and they're not just loading placeholders
        const children = container.children;
        if (children.length === 0) return false;
        
        // Check that the content is not in a loading state
        const containerText = container.textContent?.toLowerCase() || '';
        if (containerText.includes('loading') || containerText.includes('please wait')) {
          return false;
        }
        
        // For exact count matching, ensure we have the right number
        if (expectedCount > 0) {
          return children.length === expectedCount;
        }
        
        // For any files present, just ensure we have some
        return children.length > 0;
      },
      fileListXPath,
      expectedFileCount,
      { timeout: 30000, polling: 1000 }
    );
    
    if (fileListContainer) {
      console.log(`✅ File list container loaded successfully`);
    } else {
      throw new Error('File list container could not be loaded');
    }
    
    // Now count the actual files
    const container = this.page.locator(`xpath=${fileListXPath}`);
    const actualFileCount = await container.locator('> *').count();
    
    console.log(`📊 Found ${actualFileCount} file(s) in Download File modal`);
    
    // Verify the count matches the expected number
    if (actualFileCount === expectedFileCount) {
      console.log(`✅ File count matches expectation: ${actualFileCount} file(s)`);
    } else {
      throw new Error(`Expected ${expectedFileCount} file(s) but found ${actualFileCount} file(s) in Download File modal`);
    }
    
    // Optional: Log the file information for debugging
    if (actualFileCount > 0) {
      for (let i = 0; i < Math.min(actualFileCount, 5); i++) {
        try {
          const fileElement = container.locator('> *').nth(i);
          const fileText = await fileElement.textContent();
          console.log(`📄 File ${i + 1}: ${fileText?.trim() || 'No text content'}`);
        } catch (error) {
          console.log(`📄 File ${i + 1}: Unable to read content`);
        }
      }
      
      if (actualFileCount > 5) {
        console.log(`📊 And ${actualFileCount - 5} more files...`);
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

Then('I should see a page title', async function() {
  const title = await this.page.title();
  expect(title).toBeTruthy();
  expect(title.length).toBeGreaterThan(0);
  console.log(`✅ Page has title: "${title}"`);
});