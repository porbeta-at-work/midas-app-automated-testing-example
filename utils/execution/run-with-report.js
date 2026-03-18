#!/usr/bin/env node

/**
 * Run Cucumber tests and generate HTML report
 * This script ensures both commands execute properly on Windows
 */

const { spawn } = require('child_process');
const { generateHtmlReport } = require('./generate-html-report');

function runWithReport() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('❌ No cucumber command arguments provided');
    process.exit(1);
  }

  console.log('🧪 Running Cucumber tests...');
  
  // Run cucumber with all provided arguments
  const cucumber = spawn('npx', ['cucumber-js'].concat(args), {
    stdio: 'inherit',
    shell: true
  });

  cucumber.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Tests completed successfully');
      console.log('📊 Generating HTML report...');
      
      // Generate HTML report
      generateHtmlReport();
    } else {
      console.log(`❌ Tests failed with exit code ${code}`);
      console.log('📊 Generating HTML report for failed tests...');
      
      // Still generate report even if tests failed
      generateHtmlReport();
      process.exit(code);
    }
  });

  cucumber.on('error', (error) => {
    console.error('❌ Failed to run tests:', error.message);
    process.exit(1);
  });
}

if (require.main === module) {
  runWithReport();
}

module.exports = { runWithReport };