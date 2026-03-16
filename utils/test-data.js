/**
 * Test data and configuration constants
 */

const TEST_DATA = {
  // Search test data
  searchTerms: {
    withResults: [
      'data',
      'research',
      'information',
      'file'
    ],
    noResults: [
      'xyzabc123nonexistent',
      'qwertyuiopasdfgh',
      'randomtextnotfound'
    ],
    specialCharacters: [
      '@#$%^&*()',
      '!@#$%^&*',
      '<script>alert("xss")</script>'
    ]
  },

  // Filter options
  filters: {
    categories: [
      'Tools',
      'Documentation',
      'Tutorials',
      'API',
      'Guides'
    ],
    dateRanges: [
      'Last 24 hours',
      'Last 7 days',
      'Last 30 days',
      'Last 90 days',
      'Last year'
    ],
    sortOptions: [
      'Relevance',
      'Date (newest)',
      'Date (oldest)',
      'Title (A-Z)',
      'Title (Z-A)'
    ]
  }
};

const URLS = {
  base: process.env.BASE_URL || 'http://midas-webhosting-dev2.s3-website-us-gov-west-1.amazonaws.com',
  search: '/search',
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
  search: {
    noResults: 'No results found',
    invalidQuery: 'Please enter a valid search term'
  },
  general: {
    networkError: 'Network error occurred',
    serverError: 'Server error occurred',
    timeout: 'Request timed out'
  }
};

const SUCCESS_MESSAGES = {
  search: {
    resultsFound: 'results found',
    searchCompleted: 'Search completed'
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