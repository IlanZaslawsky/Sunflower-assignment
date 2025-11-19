/**
 * Test Configuration
 * Centralized configuration for timeouts and test data
 */
export const TestConfig = {
  /**
   * Timeout values in milliseconds
   */
  timeouts: {
    /** Default timeout for element interactions (10 seconds) */
    default: 10000,
    /** Short timeout for quick operations like text content retrieval (5 seconds) */
    short: 5000,
  },

  /**
   * Test data configuration
   */
  testData: {
    /** Default password for test user registration */
    defaultPassword: 'TempPass123!@#',
  },
} as const;

