/**
 * Centralized Error Handler Service
 * Handles API errors, logging, and user notifications
 */

class ErrorHandler {
  constructor() {
    this.listeners = [];
    this.errorLog = [];
  }

  /**
   * Register error event listener
   * @param {Function} callback - Called when error occurs
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Handle API errors with retry logic
   * @param {Function} apiCall - Async function making API call
   * @param {Object} options - Configuration options
   * @returns {Promise} API response or error
   */
  async executeWithRetry(apiCall, options = {}) {
    const {
      maxRetries = 3,
      delay = 1000,
      backoffMultiplier = 2,
      timeout = 30000,
      context = 'API Call'
    } = options;

    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Execute with timeout
        const result = await this.withTimeout(apiCall(), timeout);
        return result;
      } catch (error) {
        lastError = error;
        
        // Don't retry on 4xx errors (client errors)
        if (error.status >= 400 && error.status < 500) {
          this.logError('CLIENT_ERROR', error, context, attempt);
          throw error;
        }

        // Retry delay with exponential backoff
        if (attempt < maxRetries) {
          const waitTime = delay * Math.pow(backoffMultiplier, attempt - 1);
          console.warn(`Retry attempt ${attempt}/${maxRetries} for ${context} after ${waitTime}ms`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    // All retries exhausted
    this.logError('RETRY_EXHAUSTED', lastError, context, maxRetries);
    this.notifyError({
      type: 'NETWORK_ERROR',
      message: `${context} failed after ${maxRetries} attempts. Please try again.`,
      severity: 'high',
      originalError: lastError
    });

    throw lastError;
  }

  /**
   * Wrap promise with timeout
   * @param {Promise} promise - Promise to wrap
   * @param {Number} ms - Timeout in milliseconds
   * @returns {Promise}
   */
  withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), ms)
      )
    ]);
  }

  /**
   * Handle and validate API response
   * @param {Response} response - Fetch response
   * @returns {Promise<Object>} Parsed JSON or error
   */
  async handleResponse(response) {
    if (!response.ok) {
      const error = new Error('API request failed');
      error.status = response.status;
      
      try {
        const data = await response.json();
        error.message = data.message || error.message;
        error.errors = data.errors;
      } catch (_) {
        error.message = response.statusText || error.message;
      }

      this.logError('API_ERROR', error, response.url, response.status);
      throw error;
    }

    try {
      return await response.json();
    } catch (error) {
      this.logError('PARSE_ERROR', error, 'Failed to parse API response');
      throw new Error('Invalid API response format');
    }
  }

  /**
   * Log error with context
   * @param {String} errorType - Type of error
   * @param {Error} error - Error object
   * @param {String} context - Error context
   * @param {Number} attempt - Attempt number (for retries)
   */
  logError(errorType, error, context, attempt = 1) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      type: errorType,
      context,
      message: error?.message || String(error),
      stack: error?.stack,
      attempt,
      url: error?.url,
      status: error?.status
    };

    this.errorLog.push(errorEntry);

    // Keep last 50 errors in memory
    if (this.errorLog.length > 50) {
      this.errorLog.shift();
    }

    // Log to console in development
    if (process.env.VITE_DEBUG_MODE === 'true' || !import.meta.env.PROD) {
      console.error(`[${errorType}] ${context}:`, error);
    }

    // Send to error tracking service (Sentry, etc.)
    if (import.meta.env.PROD && window.Sentry) {
      window.Sentry.captureException(error, {
        tags: { errorType, context },
        level: 'error'
      });
    }
  }

  /**
   * Notify UI of error
   * @param {Object} errorInfo - Error information
   */
  notifyError(errorInfo) {
    this.listeners.forEach(callback => {
      try {
        callback(errorInfo);
      } catch (error) {
        console.error('Error in error listener:', error);
      }
    });
  }

  /**
   * Get error logs
   * @returns {Array} Error entries
   */
  getLogs() {
    return this.errorLog;
  }

  /**
   * Clear error logs
   */
  clearLogs() {
    this.errorLog = [];
  }

  /**
   * Export error logs
   * @returns {String} JSON string of logs
   */
  exportLogs() {
    return JSON.stringify(this.errorLog, null, 2);
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

/**
 * Custom hook for React components
 * Usage: const [error, clearError] = useErrorHandler();
 */
export function useErrorHandler() {
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = errorHandler.subscribe(errorInfo => {
      setError(errorInfo);
      // Auto clear after 5 seconds
      setTimeout(() => setError(null), 5000);
    });

    return unsubscribe;
  }, []);

  return [error, () => setError(null)];
}

/**
 * Safe fetch wrapper with retry and timeout
 * @param {String} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} API response
 */
export async function safeFetch(url, options = {}) {
  const {
    maxRetries = 3,
    timeout = 30000,
    context = url,
    ...fetchOptions
  } = options;

  return errorHandler.executeWithRetry(
    async () => {
      const response = await fetch(url, fetchOptions);
      return errorHandler.handleResponse(response);
    },
    { maxRetries, timeout, context }
  );
}

export default errorHandler;
