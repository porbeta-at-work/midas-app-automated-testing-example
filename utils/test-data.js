/**
 * Test data and configuration constants
 */

const TEST_DATA = {
  // Valid user credentials
  validUsers: {
    admin: {
      username: 'admin@example.com',
      password: 'admin123',
      displayName: 'Admin User'
    },
    testUser: {
      username: 'testuser@example.com',
      password: 'password123',
      displayName: 'Test User'
    },
    standardUser: {
      username: 'user@example.com',
      password: 'user123',
      displayName: 'Standard User'
    }
  },

  // Invalid user credentials
  invalidUsers: {
    wrongPassword: {
      username: 'testuser@example.com',
      password: 'wrongpassword'
    },
    wrongUsername: {
      username: 'invalid@example.com',
      password: 'password123'
    },
    bothWrong: {
      username: 'invalid@example.com',
      password: 'wrongpassword'
    }
  },

  // Search test data
  searchTerms: {
    withResults: [
      'automation',
      'testing',
      'playwright',
      'javascript'
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
  base: process.env.BASE_URL || 'http://localhost:3000',
  login: '/login',
  dashboard: '/dashboard',
  search: '/search',
  profile: '/profile',
  settings: '/settings',
  logout: '/logout'
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
  login: {
    invalidCredentials: 'Invalid username or password',
    usernameRequired: 'Username is required',
    passwordRequired: 'Password is required',
    bothRequired: 'Username and password required'
  },
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
  login: {
    welcome: 'Welcome',
    loginSuccessful: 'Login successful'
  },
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