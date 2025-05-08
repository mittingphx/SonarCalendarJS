/**
 * API Service for Sonar Calendar
 * Handles all API interactions with the calendar backend
 */

export class ApiService {
  /**
   * Create a new ApiService instance
   * @param {string} baseUrl - Base URL for the API
   */
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
  }

  /**
   * Make a request to the API
   * @private
   */
  async _request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = `${options.method || 'GET'}:${url}`;
    const now = Date.now();

    // Check cache first
    if (options.method === 'GET' && this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey);
      if (now - timestamp < this.cacheExpiry) {
        return data;
      }
      this.cache.delete(cacheKey);
    }

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const error = new Error(`API request failed: ${response.statusText}`);
        error.status = response.status;
        throw error;
      }

      const data = await response.json();

      // Cache GET requests
      if (options.method === 'GET') {
        this.cache.set(cacheKey, { data, timestamp: now });
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Events

  /**
   * Fetch all events
   * @param {Object} [params] - Query parameters
   * @returns {Promise<Array>} - Array of events
   */
  async getEvents(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this._request(`/api/events${query ? `?${query}` : ''}`);
  }

  /**
   * Fetch a single event by ID
   * @param {string} id - Event ID
   * @returns {Promise<Object>} - Event data
   */
  async getEvent(id) {
    return this._request(`/api/events/${id}`);
  }

  /**
   * Create a new event
   * @param {Object} eventData - Event data
   * @returns {Promise<Object>} - Created event data
   */
  async createEvent(eventData) {
    return this._request('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  /**
   * Update an existing event
   * @param {string} id - Event ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} - Updated event data
   */
  async updateEvent(id, updates) {
    return this._request(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Delete an event
   * @param {string} id - Event ID
   * @returns {Promise<Object>} - Confirmation
   */
  async deleteEvent(id) {
    return this._request(`/api/events/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories

  /**
   * Fetch all categories
   * @returns {Promise<Array>} - Array of categories
   */
  async getCategories() {
    return this._request('/api/categories');
  }

  /**
   * Create a new category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} - Created category data
   */
  async createCategory(categoryData) {
    return this._request('/api/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  // Search

  /**
   * Search events
   * @param {string} query - Search query
   * @param {Object} [params] - Additional search parameters
   * @returns {Promise<Array>} - Matching events
   */
  async searchEvents(query, params = {}) {
    return this._request(`/api/search?q=${encodeURIComponent(query)}&${new URLSearchParams(params)}`);
  }
}

// Determine the base URL based on the environment
const getApiBaseUrl = () => {
  // In browser, we can use a data attribute, window variable, or relative path
  if (typeof window !== 'undefined') {
    // Check for a data attribute on the script tag
    const scriptTag = document.currentScript || 
      Array.from(document.getElementsByTagName('script')).find(script => 
        script.src && script.src.includes('sonar-calendar')
      );
    
    if (scriptTag && scriptTag.dataset.apiBaseUrl) {
      return scriptTag.dataset.apiBaseUrl;
    }
    
    // Check for a global variable
    if (window.SONAR_CALENDAR_CONFIG && window.SONAR_CALENDAR_CONFIG.apiBaseUrl) {
      return window.SONAR_CALENDAR_CONFIG.apiBaseUrl;
    }
    
    // Default to relative path
    return '/api';
  }
  
  // In Node.js environment
  return process.env.API_BASE_URL || '';
};

// Export a singleton instance
export const apiService = new ApiService(getApiBaseUrl());

export default apiService;
