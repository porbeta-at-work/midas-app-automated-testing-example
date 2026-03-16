module.exports = {
  default: {
    // Specify the step definition files
    require: [
      'step-definitions/**/*.js',
      'utils/setup.js'
    ],
    
    // Specify the feature files location
    paths: [
      'features/**/*.feature'
    ],
    
    // Output format for test results
    format: [
      'progress',
      ['json', 'reports/cucumber-report.json'],
      ['html', 'reports/cucumber-report.html']
    ],
    
    // Fail fast - stop on first failure
    failFast: false,
    
    // Parallel execution
    parallel: 2,
    
    // Tags to include/exclude
    tags: process.env.TAGS || 'not @skip',
    
    // World parameters
    worldParameters: {
      headless: process.env.HEADED !== 'true',
      debug: process.env.DEBUG === 'true',
      slowMo: process.env.DEBUG === 'true' ? 100 : 0,
      timeout: 30000
    }
  }
};