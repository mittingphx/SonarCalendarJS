/**
 * Event Service for Sonar Calendar
 * Handles event-related operations and caching
 */

import { apiService } from './apiService';

export class EventService {
  constructor() {
    this.eventsCache = new Map();
    this.categoriesCache = null;
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
    this.lastFetchTime = 0;
  }

  /**
   * Get all events with optional filtering
   * @param {Object} [filters] - Filter criteria
   * @returns {Promise<Array>} - Array of events
   */
  async getEvents(filters = {}) {
    try {
      const cacheKey = this._generateCacheKey('events', filters);
      const now = Date.now();

      // Return cached data if available and not expired
      if (this.eventsCache.has(cacheKey)) {
        const { data, timestamp } = this.eventsCache.get(cacheKey);
        if (now - timestamp < this.cacheExpiry) {
          return data;
        }
      }

      // Fetch from API
      const events = await apiService.getEvents(filters);
      
      // Update cache
      this.eventsCache.set(cacheKey, {
        data: events,
        timestamp: now
      });

      return events;
    } catch (error) {
      console.error('Failed to fetch events:', error);
      throw error;
    }
  }


  /**
   * Get a single event by ID
   * @param {string} id - Event ID
   * @returns {Promise<Object>} - Event data
   */
  async getEvent(id) {
    try {
      // Check cache first
      for (const { data } of this.eventsCache.values()) {
        const cachedEvent = Array.isArray(data) 
          ? data.find(event => event.id === id)
          : null;
        if (cachedEvent) return cachedEvent;
      }

      // If not in cache, fetch from API
      return await apiService.getEvent(id);
    } catch (error) {
      console.error(`Failed to fetch event ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new event
   * @param {Object} eventData - Event data
   * @returns {Promise<Object>} - Created event
   */
  async createEvent(eventData) {
    try {
      const newEvent = await apiService.createEvent(eventData);
      this._invalidateCache();
      return newEvent;
    } catch (error) {
      console.error('Failed to create event:', error);
      throw error;
    }
  }

  /**
   * Update an existing event
   * @param {string} id - Event ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} - Updated event
   */
  async updateEvent(id, updates) {
    try {
      const updatedEvent = await apiService.updateEvent(id, updates);
      this._invalidateCache();
      return updatedEvent;
    } catch (error) {
      console.error(`Failed to update event ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete an event
   * @param {string} id - Event ID
   * @returns {Promise<void>}
   */
  async deleteEvent(id) {
    try {
      await apiService.deleteEvent(id);
      this._invalidateCache();
    } catch (error) {
      console.error(`Failed to delete event ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all categories
   * @returns {Promise<Array>} - Array of categories
   */
  async getCategories() {
    try {
      const now = Date.now();
      
      // Return cached categories if available and not expired
      if (this.categoriesCache && now - this.lastFetchTime < this.cacheExpiry) {
        return this.categoriesCache;
      }

      // Fetch from API
      const categories = await apiService.getCategories();
      
      // Update cache
      this.categoriesCache = categories;
      this.lastFetchTime = now;
      
      return categories;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  }

  /**
   * Search events
   * @param {string} query - Search query
   * @param {Object} [options] - Search options
   * @returns {Promise<Array>} - Matching events
   */
  async searchEvents(query, options = {}) {
    try {
      return await apiService.searchEvents(query, options);
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  }

  /**
   * Invalidate all cached data
   */
  _invalidateCache() {
    this.eventsCache.clear();
    this.categoriesCache = null;
  }

  /**
   * Generate a cache key from filter criteria
   * @private
   */
  _generateCacheKey(prefix, filters) {
    return `${prefix}:${JSON.stringify(filters)}`;
  }
}

// Export a singleton instance
export const eventService = new EventService();

export default eventService;
