const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { URLS } = require('../utils/execution/test-data');

Given('I navigate to the MiDAS crosswalk tab', async function() {
  await this.page.goto(URLS.base + '/crosswalk', { waitUntil: 'domcontentloaded' });
  console.log('✅ Navigated to MiDAS crosswalk tab');
});

When('I select {string} in the crosswalk Source field', async function(optionValue) {
  const selectXPath = '//*[@id="SOURCE"]';
  let selected = false;
  
  try {
    const selectElement = this.page.locator(`xpath=${selectXPath}`).first();
    if (await selectElement.isVisible({ timeout: 1000 })) {
      // Try selecting by value first
      try {
        await selectElement.selectOption(optionValue);
        selected = true;
        console.log(`✅ Selected option by value: ${optionValue} in Source field`);
      } catch (error) {
        // If selecting by value fails, try selecting by label text
        try {
          await selectElement.selectOption({ label: optionValue });
          selected = true;
          console.log(`✅ Selected option by label: ${optionValue} in Source field`);
        } catch (labelError) {
          // Log both errors for debugging
          console.log(`⚠️  Failed to select by value: ${error.message}`);
          console.log(`⚠️  Failed to select by label: ${labelError.message}`);
        }
      }
      
      // Small pause to see the action
      if (process.env.SLOW_MO || process.env.HEADED === 'true') {
        await this.page.waitForTimeout(300);
      }
    }
  } catch (error) {
    // Element not found or not visible
  }
  
  if (!selected) {
    throw new Error(`Could not select "${optionValue}" in crosswalk Source field`);
  }
});

When('I enter {string} in the crosswalk A Number field', async function(value) {
  const inputXPath = '//*[@id="A_NUMBER"]';
  let filled = false;
  
  try {
    const element = this.page.locator(`xpath=${inputXPath}`).first();
    if (await element.isVisible({ timeout: 1000 })) {
      await element.fill(value);
      filled = true;
      console.log(`✅ Entered: ${value} in crosswalk A Number field`);
      // Small pause to see the action
      if (process.env.SLOW_MO || process.env.HEADED === 'true') {
        await this.page.waitForTimeout(300);
      }
    }
  } catch (error) {
    // Element not found or not visible
  }
  
  if (!filled) {
    throw new Error('Could not find crosswalk A Number field');
  }
});

When('I enter {string} in the crosswalk C Number field', async function(value) {
  const inputXPath = '//*[@id="C_NUMBER"]';
  let filled = false;
  
  try {
    const element = this.page.locator(`xpath=${inputXPath}`).first();
    if (await element.isVisible({ timeout: 1000 })) {
      await element.fill(value);
      filled = true;
      console.log(`✅ Entered: ${value} in crosswalk C Number field`);
      // Small pause to see the action
      if (process.env.SLOW_MO || process.env.HEADED === 'true') {
        await this.page.waitForTimeout(300);
      }
    }
  } catch (error) {
    // Element not found or not visible
  }
  
  if (!filled) {
    throw new Error('Could not find crosswalk C Number field');
  }
});

When('I click the "Search crosswalk" button', async function() {
  // Use specific XPath for MiDAS Search crosswalk button
  const searchButtonXPath = '//*[@id="accordion-content-search"]/div/div[7]/button';
  const resultsTableXPath = '//*[@id="accordion-content-results"]/div/div/div[2]/div[1]/div[2]/table';
  
  try {
    console.log(`🎯 Clicking crosswalk search button using XPath: ${searchButtonXPath}`);
    await this.page.locator(`xpath=${searchButtonXPath}`).click();
    console.log('✅ Clicked crosswalk search button');
    
    // Dynamic waiting for results table with loading indicators
    console.log('⏳ Waiting for crosswalk results table to load...');
    const resultsTable = this.page.locator(`xpath=${resultsTableXPath}`);
    
    // Step 1: Wait for table to be visible (with longer timeout for slow responses)
    console.log('⏳ Waiting for crosswalk results table to appear...');
    await resultsTable.waitFor({ state: 'visible', timeout: 60000 });
    console.log('👁️  Crosswalk results table is now visible');
    
    // Step 2: Dynamically wait for table to have data with polling feedback
    console.log('⏳ Waiting for crosswalk table data to populate...');
    
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
      console.log('✅ Crosswalk results table loaded successfully with data');
    } else {
      console.log('ℹ️  Crosswalk search completed (may have no results)');
    }
    
    // Small pause to see the results
    if (process.env.SLOW_MO || process.env.HEADED === 'true') {
      await this.page.waitForTimeout(1000);
    }
    
  } catch (error) {
    console.error('❌ Failed to click crosswalk search button or load results:', error.message);
    throw new Error(`Could not click crosswalk search button or load results table: ${error.message}`);
  }
});

Then('I should see {int} row\\(s) in the Crosswalk Search Results', async function(expectedRowCount) {
  const tbodyXPath = '//*[@id="accordion-content-results"]/div/div/div[2]/div[1]/div[2]/table/tbody';
  
  try {
    console.log(`🔍 Checking for ${expectedRowCount} row(s) in Crosswalk Search Results using XPath: ${tbodyXPath}`);
    
    // Check if the tbody element exists
    const tbody = this.page.locator(`xpath=${tbodyXPath}`);
    const tbodyExists = await tbody.isVisible({ timeout: 5000 });
    
    if (!tbodyExists) {
      if (expectedRowCount === 0) {
        console.log('✅ No results table found, which matches expectation of 0 rows');
        return;
      } else {
        throw new Error(`Expected ${expectedRowCount} rows but results table tbody does not exist`);
      }
    }
    
    // Count the tr rows within the tbody
    const rows = tbody.locator('tr');
    const actualRowCount = await rows.count();
    
    console.log(`📊 Found ${actualRowCount} row(s) in Crosswalk Search Results`);
    
    // Compare actual count with expected count
    if (actualRowCount === expectedRowCount) {
      console.log(`✅ Row count matches expectation: ${actualRowCount} row(s)`);
    } else {
      throw new Error(`Expected ${expectedRowCount} row(s) but found ${actualRowCount} row(s) in Crosswalk Search Results`);
    }
    
    // Optional: Log some information about the rows for debugging
    if (actualRowCount > 0 && actualRowCount <= 5) { // Only log details for small result sets
      for (let i = 0; i < actualRowCount; i++) {
        try {
          const row = rows.nth(i);
          const rowText = await row.textContent();
          const truncatedText = rowText ? (rowText.trim().substring(0, 100) + (rowText.trim().length > 100 ? '...' : '')) : 'No text content';
          console.log(`📄 Row ${i + 1}: ${truncatedText}`);
        } catch (error) {
          console.log(`📄 Row ${i + 1}: Unable to read content`);
        }
      }
    } else if (actualRowCount > 5) {
      console.log(`📊 Large result set (${actualRowCount} rows) - skipping individual row details`);
    }
    
  } catch (error) {
    console.error(`❌ Failed to verify row count in Crosswalk Search Results:`, error.message);
    throw new Error(`Could not verify ${expectedRowCount} row(s) in Crosswalk Search Results: ${error.message}`);
  }
});

Then('I should see the DOC ID of {string} in the Details section of row {int}', async function(docId, mainRowNumber) {
  // Use the details section from the specified main row
  const detailsSectionXPath = `//*[@id="accordion-content-results"]/div/div/div[2]/div[1]/div[2]/table/tbody/tr[${mainRowNumber + 1}]`;
  
  try {
    console.log(`🔍 Looking for DOC ID "${docId}" in Details section of row ${mainRowNumber}...`);
    
    // First, ensure the details section is visible
    const detailsSection = this.page.locator(`xpath=${detailsSectionXPath}`);
    await detailsSection.waitFor({ state: 'visible', timeout: 5000 });
    
    // Wait for the details table data to actually load before searching using condition-based waiting
    console.log(`⏳ Ensuring details table data is loaded before searching for DOC ID...`);
    const detailsTableXPath = `${detailsSectionXPath}/td/div/div/div[2]/div[1]/div[2]/table`;
    
    // Use waitForFunction for responsive condition-based waiting instead of retry loops
    try {
      const tableDataReady = await this.page.waitForFunction(
        (tableXPath) => {
          const table = document.evaluate(tableXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          if (!table) return false;
          
          const tbody = table.querySelector('tbody');
          if (!tbody) return false;
          
          const rows = tbody.querySelectorAll('tr');
          
          // Check that we have rows with actual data (not loading placeholders)
          if (rows.length === 0) return false;
          
          // Verify the first row has the expected number of columns and content
          const firstRow = rows[0];
          if (!firstRow || firstRow.children.length < 3) return false;
          
          // Check that content is not in loading state
          const rowText = firstRow.textContent?.toLowerCase() || '';
          if (rowText.includes('loading') || rowText.includes('please wait')) {
            return false;
          }
          
          // Confirm we have actual data content
          return firstRow.textContent.trim() !== '';
        },
        detailsTableXPath,
        { timeout: 30000, polling: 1000 }
      );
      
      if (tableDataReady) {
        console.log(`✅ Details table data confirmed loaded using condition-based waiting`);
      }
    } catch (error) {
      console.log(`⚠️  Details table data loading timeout - proceeding with search anyway: ${error.message}`);
    }
    
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
          // Try multiple ways to get the full DOC ID (handling truncation)
          let currentDocId = await docIdElement.textContent();
          
          // If textContent seems truncated, try title attribute
          if (currentDocId && currentDocId.length < 15) { // DOC IDs should be longer
            const titleAttr = await docIdElement.getAttribute('title');
            if (titleAttr && titleAttr.trim().length > currentDocId.trim().length) {
              currentDocId = titleAttr;
              console.log(`🔍 Using title attribute for full DOC ID: "${currentDocId}"`);
            }
          }
          
          // Check if the found DOC ID matches exactly or is a truncated version of expected
          if (currentDocId && currentDocId.trim() === docId.trim()) {
            console.log(`✅ Found exact matching DOC ID "${docId}" in details row ${detailsRowNumber}`);
            foundRow = true;
            break;
          } else if (currentDocId && docId.startsWith(currentDocId.trim()) && currentDocId.trim().length >= 6) {
            // Handle truncated display: if expected DOC ID starts with found value and found value is substantial
            console.log(`✅ Found truncated DOC ID match: "${currentDocId.trim()}" matches start of expected "${docId}" in details row ${detailsRowNumber}`);
            foundRow = true;
            break;
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
    
    console.log(`✅ Successfully validated DOC ID "${docId}" exists in Details section of row ${mainRowNumber}`);
    
  } catch (error) {
    console.error(`❌ Failed to validate DOC ID "${docId}" in Details section of row ${mainRowNumber}:`, error.message);
    throw new Error(`Could not validate DOC ID "${docId}" in Details section of row ${mainRowNumber}: ${error.message}`);
  }
});

