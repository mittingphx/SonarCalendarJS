/**
 * Sonar Calendar - Main Calendar Component
 * 
 * This is the main calendar component that handles the overall calendar state,
 * view management, and API interactions.
 */

import { EventCard } from '../EventCard';
import { EventDetails } from '../EventDetails';
import { ViewToggle } from '../ViewToggle';

export class SonarCalendar {
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
    this.activeEvent = null;
    this.activeEventDetails = null;
    this.currentView = 'upcoming'; // 'upcoming', 'month', 'week', 'day'

    // Bind methods
    this.handleEventClick = this.handleEventClick.bind(this);
    this.closeEventDetails = this.closeEventDetails.bind(this);
    this.handlePopState = this.handlePopState.bind(this);

    // Initialize the calendar
    this.initialize();
    
    // Set up view change handler
    this.handleViewChange = this.handleViewChange.bind(this);
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
    
    // Add styles
    this.addStyles();

    // Set up event listeners
    this.setupEventListeners();

    // Add popstate handler for browser back/forward buttons
    window.addEventListener('popstate', this.handlePopState);

    // Load events
    this.loadEvents();
  }

  /**
   * Create the calendar header
   * @private
   */
  createHeader() {
    const header = document.createElement('div');
    header.className = 'calendar-header';
    
    const title = document.createElement('h2');
    title.className = 'calendar-title';
    title.textContent = this.formatMonthYear(this.currentDate);
    
    // Create view toggle
    this.viewToggle = new ViewToggle({
      initialView: this.currentView,
      onChange: this.handleViewChange,
      theme: this.theme
    });
    
    const headerContent = document.createElement('div');
    headerContent.className = 'calendar-header__content';
    headerContent.appendChild(title);
    
    header.appendChild(headerContent);
    
    // Add view toggle to header
    const viewToggleContainer = document.createElement('div');
    viewToggleContainer.className = 'calendar-view-toggle';
    this.viewToggle.render(viewToggleContainer);
    header.appendChild(viewToggleContainer);
    
    return header.outerHTML;
  }

  /**
   * Add calendar styles
   * @private
   */
  addStyles() {
    const styleId = 'sonar-calendar-styles';
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .sonar-calendar {
        max-width: 800px;
        margin: 0 auto;
        font-family: var(--font-sans);
      }
      
      .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }
      
      .calendar-header__content {
        display: flex;
        align-items: center;
      }
      
      .calendar-title {
        font-size: 1.5rem;
        color: var(--color-text);
        margin: 0 0 1rem 0;
      }
      
      .calendar-view-toggle {
        margin-left: 1rem;
      }
      
      .calendar-events-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
      }
      
      .no-events {
        color: var(--color-text-muted);
        font-style: italic;
        grid-column: 1 / -1;
        text-align: center;
        padding: 2rem 0;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  /**
   * Apply the specified theme
   * @param {string} theme - The theme to apply ('light' or 'dark')
   */
  setTheme(theme) {
    this.theme = theme;
    if (this.viewToggle) {
      this.viewToggle.setTheme(theme);
    }
    this.render();
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
   * Handle event click
   * @param {Object} event - The event data
   * @private
   */
  handleEventClick(event) {
    this.activeEvent = event;
    this.showEventDetails(event);
  }

  /**
   * Show event details
   * @param {Object} event - The event data to display
   * @private
   */
  showEventDetails(event) {
    // Close any open event details
    this.closeEventDetails();
    
    // Create and show new event details
    this.activeEventDetails = new EventDetails(
      event,
      this.closeEventDetails.bind(this),
      this.theme
    );
    
    this.activeEventDetails.render(this.container);
    
    // Add to history state
    window.history.pushState(
      { eventId: event.id },
      `Event: ${event.title}`,
      `#event-${event.id}`
    );
  }

  /**
   * Close the event details view
   * @private
   */
  closeEventDetails() {
    if (this.activeEventDetails) {
      this.activeEventDetails.close();
      this.activeEventDetails = null;
      this.activeEvent = null;
      
      // Update URL if we're currently viewing an event
      if (window.location.hash.startsWith('#event-')) {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
  }

  /**
   * Handle popstate events (back/forward navigation)
   * @private
   */
  handlePopState() {
    if (window.location.hash.startsWith('#event-')) {
      const eventId = window.location.hash.replace('#event-', '');
      const event = this.events.find(e => e.id.toString() === eventId);
      if (event) {
        this.showEventDetails(event);
      }
    } else if (this.activeEvent) {
      this.closeEventDetails();
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
    const calendarBody = this.container.querySelector('#calendar-body');
    if (!calendarBody) return;

    if (this.currentView === 'upcoming') {
      this.renderUpcomingEvents(calendarBody);
    } else if (this.currentView === 'month') {
      this.renderMonthView(calendarBody);
    } else if (this.currentView === 'week') {
      this.renderWeekView(calendarBody);
    } else if (this.currentView === 'day') {
      this.renderDayView(calendarBody);
    }
  }

  /**
   * Render upcoming events
   * @param {HTMLElement} container - The container to render events into
   * @private
   */
  renderUpcomingEvents(container) {
    const upcomingEvents = this.events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= this.currentDate;
    });

    this.renderEvents(container, upcomingEvents);
  }

  /**
   * Render month view
   * @param {HTMLElement} container - The container to render events into
   * @private
   */
  renderMonthView(container) {
    const monthEvents = this.events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getMonth() === this.currentDate.getMonth() && 
             eventDate.getFullYear() === this.currentDate.getFullYear();
    });

    this.renderEvents(container, monthEvents);
  }

  /**
   * Render week view
   * @param {HTMLElement} container - The container to render events into
   * @private
   */
  renderWeekView(container) {
    const weekEvents = this.events.filter(event => {
      const eventDate = new Date(event.start);
      const startDate = new Date(this.currentDate);
      startDate.setDate(startDate.getDate() - startDate.getDay());
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);

      return eventDate >= startDate && eventDate < endDate;
    });

    this.renderEvents(container, weekEvents);
  }

  /**
   * Render day view
   * @param {HTMLElement} container - The container to render events into
   * @private
   */
  renderDayView(container) {
    const dayEvents = this.events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === this.currentDate.toDateString();
    });

    this.renderEvents(container, dayEvents);
  }

  /**
   * Render events in the calendar
   * @param {HTMLElement} container - The container to render events into
   * @param {Array} [events] - Optional events to render (defaults to all events)
   * @private
   */
  renderEvents(container, events = this.events) {
    const eventsContainer = document.createElement('div');
    eventsContainer.className = 'events-grid';
    
    events.forEach(event => {
      const eventCard = new EventCard(event, this.theme);
      eventCard.element.addEventListener('click', () => this.handleEventClick(event));
      eventCard.element.setAttribute('tabindex', '0');
      eventCard.element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleEventClick(event);
        }
      });
      eventsContainer.appendChild(eventCard.element);
    });

    container.innerHTML = ''; // Clear previous content
    container.appendChild(eventsContainer);

    // Show message if no events
    if (events.length === 0) {
      const noEvents = document.createElement('p');
      noEvents.className = 'no-events';
      noEvents.textContent = `No ${this.currentView} events found.`;
      eventsContainer.appendChild(noEvents);
    }
    
    // Check if we need to show an event from the URL hash
    if (window.location.hash.startsWith('#event-') && !this.activeEvent) {
      const eventId = window.location.hash.replace('#event-', '');
      const event = this.events.find(e => e.id.toString() === eventId);
      if (event) {
        // Use setTimeout to ensure the DOM is updated first
        setTimeout(() => this.showEventDetails(event), 0);
      }
    }
  }

  /**
   * Update the calendar display
   * @private
   */
  updateCalendar() {
    const calendarBody = this.container.querySelector('#calendar-body') || this.container;
    
    if (this.currentView === 'upcoming') {
      this.renderUpcomingEvents(calendarBody);
    } else if (this.currentView === 'month') {
      this.renderMonthView(calendarBody);
    } else if (this.currentView === 'week') {
      this.renderWeekView(calendarBody);
    } else if (this.currentView === 'day') {
      this.renderDayView(calendarBody);
    }
    
    // Update the title with the current view context
    const titleElement = this.container.querySelector('.calendar-title');
    if (titleElement) {
      if (this.currentView === 'upcoming') {
        titleElement.textContent = 'Upcoming Events';
      } else {
        titleElement.textContent = this.formatDate(this.currentDate, 'MMMM yyyy');
      }
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
