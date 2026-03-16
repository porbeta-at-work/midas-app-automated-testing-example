const reporter = require('cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

/**
 * Generate HTML report from Cucumber JSON output
 */
function generateHtmlReport() {
  const reportsDir = 'reports';
  const jsonReportPath = path.join(reportsDir, 'cucumber-report.json');
  const htmlReportPath = path.join(reportsDir, 'cucumber-report.html');

  // Check if JSON report exists
  if (!fs.existsSync(jsonReportPath)) {
    console.log('❌ JSON report not found:', jsonReportPath);
    console.log('💡 Run tests with: npm run test:report');
    return;
  }

  // Ensure reports directory exists
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const options = {
    theme: 'bootstrap',
    jsonFile: jsonReportPath,
    output: htmlReportPath,
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: false,
    metadata: {
      'App Version': '1.0.0',
      'Test Environment': process.env.NODE_ENV || 'test',
      'Platform': process.platform,
      'Parallel': 'Scenarios',
      'Executed': 'Local'
    },
    failedSummaryReport: true,
    brandTitle: 'Test Automation Report',
    name: 'Playwright + Cucumber Test Results'
  };

  try {
    reporter.generate(options);
    console.log('✅ HTML report generated successfully:', htmlReportPath);
    console.log('🔗 Open the report in your browser to view results');
  } catch (error) {
    console.error('❌ Error generating HTML report:', error);
  }
}

// Run if called directly
if (require.main === module) {
  generateHtmlReport();
}

module.exports = {
  generateHtmlReport
};