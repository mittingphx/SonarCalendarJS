/**
 * Error handling utility for API responses
 */

export class ApiError extends Error {
  /**
   * Create a new API error
   * @param {string} message - Error message
   * @param {number} [status] - HTTP status code
   * @param {Object} [details] - Additional error details
   */
  constructor(message, status = 500, details = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Handle API errors consistently
 * @param {Error} error - The error to handle
 * @param {string} [context] - Additional context for the error
 * @throws {ApiError}
 */
export function handleApiError(error, context = '') {
  if (error instanceof ApiError) {
    // Re-throw our custom errors
    throw error;
  }

  // Handle network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    throw new ApiError(
      'Network error: Unable to connect to the server',
      0,
      { originalError: error.message, context }
    );
  }

  // Handle HTTP errors
  if (error.status) {
    const message = error.message || 'An unknown error occurred';
    throw new ApiError(
      message,
      error.status,
      { originalError: error, context }
    );
  }

  // Handle other errors
  throw new ApiError(
    error.message || 'An unexpected error occurred',
    error.status || 500,
    { originalError: error, context }
  );
}

/**
 * Create an API error handler with context
 * @param {string} context - Context for the error handler
 * @returns {Function} Error handling function
 */
export function createErrorHandler(context) {
  return (error) => handleApiError(error, context);
}

/**
 * Check if an error is an API error
 * @param {Error} error - The error to check
 * @returns {boolean}
 */
export function isApiError(error) {
  return error && error.name === 'ApiError';
}
