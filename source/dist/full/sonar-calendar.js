(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.SonarCalendar = {}));
})(this, (function (exports) { 'use strict';

  /**
   * Sonar Calendar - Main Calendar Component
   * 
   * This is the main calendar component that handles the overall calendar state,
   * view management, and API interactions.
   */

  class SonarCalendar {
    /**
     * Create a new SonarCalendar instance
     * @param {Object} options - Configuration options
     * @param {HTMLElement} options.container - The container element for the calendar
     * @param {string} [options.theme='light'] - The theme to use ('light' or 'dark')
     * @param {string} [options.apiUrl] - Base URL for the events API
     * @param {string} [options.dataSelector] - CSS selector for an element containing JSON data
     */
    constructor({ container, theme = 'light', apiUrl, dataSelector } = {}) {
      if (!container) {
        throw new Error('Container element is required');
      }

      this.container = container;
      this.theme = theme;
      this.apiUrl = apiUrl;
      this.dataSelector = dataSelector;
      this.currentDate = new Date();
      this.events = [];
      this.isLoading = false;
      this.error = null;

      // Initialize the calendar
      this.initialize();
    }


    /**
     * Initialize the calendar
     * @private
     */
    initialize() {
      // Apply theme
      this.applyTheme(this.theme);
      
      // Set up the container
      this.container.innerHTML = `
      <div class="sonar-calendar">
        <div class="calendar-header">
          <h2>Sonar Calendar</h2>
          <div class="calendar-controls">
            <button class="btn btn-icon" id="prev">
              <span class="sr-only">Previous</span>
              <span aria-hidden="true">←</span>
            </button>
            <h3 id="current-month">${this.formatDate(this.currentDate, 'MMMM yyyy')}</h3>
            <button class="btn btn-icon" id="next">
              <span class="sr-only">Next</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
        <div class="calendar-body" id="calendar-body">
          <p>Loading calendar...</p>
        </div>
      </div>
    `;

      // Set up event listeners
      this.setupEventListeners();
      
      // Load initial data
      this.loadEvents();
    }


    /**
     * Apply the specified theme
     * @param {string} theme - The theme to apply ('light' or 'dark')
     */
    applyTheme(theme) {
      this.theme = theme;
      document.documentElement.setAttribute('data-theme', theme);
    }

    /**
     * Set up event listeners
     * @private
     */
    setupEventListeners() {
      // Navigation buttons
      const prevBtn = this.container.querySelector('#prev');
      const nextBtn = this.container.querySelector('#next');

      if (prevBtn) {
        prevBtn.addEventListener('click', () => this.navigate(-1));
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.navigate(1));
      }
    }

    /**
     * Navigate between months
     * @param {number} direction - The direction to navigate (-1 for previous, 1 for next)
     */
    navigate(direction) {
      const newDate = new Date(this.currentDate);
      newDate.setMonth(newDate.getMonth() + direction);
      this.currentDate = newDate;
      this.updateCalendar();
    }

    /**
     * Parse events from a data source
     * @param {string} source - The source of the data ('api' or 'element')
     * @returns {Promise<Array>} - Parsed events array
     * @private
     */
    async parseEvents(source) {
      try {
        if (source === 'api' && this.apiUrl) {
          const response = await fetch(this.apiUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return await response.json();
        } else if (source === 'element' && this.dataSelector) {
          const element = document.querySelector(this.dataSelector);
          if (!element) {
            throw new Error(`No element found with selector: ${this.dataSelector}`);
          }
          
          // Get the data from the element's value or text content
          const data = element.value !== undefined ? element.value : element.textContent;
          if (!data) {
            throw new Error('No data found in the specified element');
          }
          
          return JSON.parse(data);
        }
        return [];
      } catch (error) {
        console.error(`Error parsing events from ${source}:`, error);
        throw error;
      }
    }

    /**
     * Load events from the available data source
     */
    async loadEvents() {
      this.isLoading = true;
      this.error = null;
      this.updateLoadingState();

      try {
        // Try to load from API first if available
        if (this.apiUrl) {
          this.events = await this.parseEvents('api');
        } 
        // If no API URL or API failed, try loading from data element if specified
        else if (this.dataSelector) {
          this.events = await this.parseEvents('element');
        } else {
          this.events = [];
          console.warn('No data source specified. Provide either apiUrl or dataSelector.');
        }
        
        this.updateCalendar();
      } catch (error) {
        console.error('Error loading events:', error);
        this.error = error.message;
        this.showError(error.message);
      } finally {
        this.isLoading = false;
        this.updateLoadingState();
      }
    }

    /**
     * Update the calendar display
     * @private
     */
    updateCalendar() {
      const monthElement = this.container.querySelector('#current-month');
      if (monthElement) {
        monthElement.textContent = this.formatDate(this.currentDate, 'MMMM yyyy');
      }

      // TODO: Implement calendar grid rendering
      const calendarBody = this.container.querySelector('#calendar-body');
      if (calendarBody) {
        calendarBody.innerHTML = `
        <div class="calendar-month">
          <p>Calendar view for ${this.formatDate(this.currentDate, 'MMMM yyyy')} will be implemented here.</p>
          <p>Found ${this.events.length} events.</p>
        </div>
      `;
      }
    }

    /**
     * Update loading state
     * @private
     */
    updateLoadingState() {
      const calendarBody = this.container.querySelector('#calendar-body');
      if (!calendarBody) return;

      if (this.isLoading) {
        calendarBody.innerHTML = '<div class="loading">Loading events...</div>';
      } else if (this.error) {
        calendarBody.innerHTML = `
        <div class="error">
          <p>Error loading events: ${this.error}</p>
          <button class="btn btn-primary" id="retry-load">Retry</button>
        </div>
      `;
        
        const retryBtn = calendarBody.querySelector('#retry-load');
        if (retryBtn) {
          retryBtn.addEventListener('click', () => this.loadEvents());
        }
      }
    }

    /**
     * Show error message
     * @param {string} message - The error message to display
     * @private
     */
    showError(message) {
      console.error('Calendar Error:', message);
      // Error display is handled in updateLoadingState
    }

    /**
     * Format a date string
     * @param {Date} date - The date to format
     * @param {string} format - The format string
     * @returns {string} The formatted date string
     * @private
     */
    formatDate(date, format) {
      // Simple date formatting - can be enhanced with a library like date-fns
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      };
      
      return new Intl.DateTimeFormat('en-US', options).format(date);
    }
  }

  /**
   * Sonar Calendar - Main Entry Point
   * 
   * This is the main entry point for the Sonar Calendar library.
   * It initializes the calendar and sets up the necessary event listeners.
   */

  /**
   * Initialize the Sonar Calendar
   * @param {Object} options - Configuration options for the calendar
   * @param {string} options.selector - CSS selector for the container element
   * @param {string} [options.theme='light'] - Theme to use ('light' or 'dark')
   * @param {string} [options.apiUrl] - Base URL for the events API
   * @param {string} [options.dataSelector] - CSS selector for an element containing JSON data
   * @returns {SonarCalendar} - The initialized calendar instance
   */
  function initSonarCalendar(options = {}) {
    const {
      selector = '#calendar',
      theme = 'light',
      apiUrl,
      dataSelector
    } = options;

    // Find the container element
    const container = document.querySelector(selector);
    if (!container) {
      console.error(`No element found with selector: ${selector}`);
      return null;
    }

    // Initialize the calendar
    const calendar = new SonarCalendar({
      container,
      theme,
      apiUrl,
      dataSelector
    });

    return calendar;
  }

  // Export the initialization function and main class
  window.SonarCalendar = {
    init: initSonarCalendar,
    Calendar: SonarCalendar
  };

  exports.SonarCalendar = SonarCalendar;
  exports.initSonarCalendar = initSonarCalendar;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=sonar-calendar.js.map
