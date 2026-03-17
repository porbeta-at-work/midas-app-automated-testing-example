/**
 * Test data and configuration constants for MiDAS Application
 */

const TEST_DATA = {
  // MiDAS form test data
  midas: {
    lastName: [
      'BOGGIO',
      'SMITH',
      'JOHNSON',
      'WILLIAMS',
      'BROWN'
    ],
    aNumber: [
      'A1728308',
      'A1234567',
      'A9876543',
      'A5555555'
    ]
  },

  // Test scenarios for edge cases
  edgeCases: {
    emptyValues: ['', ' '],
    specialCharacters: ['@#$%^&*()', "<script>alert('xss')</script>"],
    longValues: ['A' + '1'.repeat(50), 'VERYLONGLASTNAMETHATEXCEEDSNORMALLIMITS']
  }
};

const URLS = {
  base: process.env.BASE_URL || 'http://midas-webhosting-dev2.s3-website-us-gov-west-1.amazonaws.com',
  home: '/'
};

const TIMEOUTS = {
  short: 5000,        // 5 seconds
  medium: 15000,      // 15 seconds
  long: 30000,        // 30 seconds
  veryLong: 60000     // 1 minute
};

const BROWSER_CONFIG = {
  viewport: {
    width: 1280,
    height: 720
  },
  defaultBrowser: 'chromium',
  headless: process.env.HEADED !== 'true',
  slowMo: process.env.DEBUG === 'true' ? 100 : 0
};

const ERROR_MESSAGES = {
  form: {
    noResults: 'No results found',
    invalidInput: 'Please enter a valid value'
  },
  general: {
    networkError: 'Network error occurred',
    serverError: 'Server error occurred',
    timeout: 'Request timed out'
  }
};

const SUCCESS_MESSAGES = {
  form: {
    searchCompleted: 'Search completed',
    resultsFound: 'results found'
  }
};

module.exports = {
  TEST_DATA,
  URLS,
  TIMEOUTS,
  BROWSER_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};