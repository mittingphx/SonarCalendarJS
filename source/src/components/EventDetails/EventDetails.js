/**
 * EventDetails Component
 * 
 * Displays detailed information about a calendar event
 */

export class EventDetails {
  /**
   * Create a new EventDetails instance
   * @param {Object} event - The event data
   * @param {Function} onClose - Callback when the details view is closed
   * @param {string} [theme='light'] - The theme to use ('light' or 'dark')
   */
  constructor(event, onClose, theme = 'light') {
    this.event = event;
    this.onClose = onClose;
    this.theme = theme;
    this.element = this.createElement();
  }

  /**
   * Create the event details element
   * @returns {HTMLElement} The created element
   * @private
   */
  createElement() {
    const { id, title, start, end, description, category, location } = this.event;
    const startDate = this.formatDate(start);
    const startTime = this.formatTime(start);
    const endTime = this.formatTime(end);
    const duration = this.calculateDuration(start, end);

    const details = document.createElement('div');
    details.className = `event-details theme-${this.theme}`;
    details.dataset.eventId = id;
    
    details.innerHTML = `
      <div class="event-details__overlay"></div>
      <div class="event-details__content">
        <button class="event-details__close" aria-label="Close details">
          <span aria-hidden="true">&times;</span>
        </button>
        
        <div class="event-details__header">
          ${category ? `<span class="event-details__category">${category}</span>` : ''}
          <h2 class="event-details__title">${title}</h2>
        </div>
        
        <div class="event-details__info">
          <div class="event-details__info-item">
            <span class="event-details__info-label">Date:</span>
            <time datetime="${start}">${startDate}</time>
          </div>
          <div class="event-details__info-item">
            <span class="event-details__info-label">Time:</span>
            <time datetime="${start}">${startTime}</time> - <time datetime="${end}">${endTime}</time>
            <span class="event-details__duration">(${duration})</span>
          </div>
          ${location ? `
            <div class="event-details__info-item">
              <span class="event-details__info-label">Location:</span>
              <span>${location}</span>
            </div>
          ` : ''}
        </div>
        
        ${description ? `
          <div class="event-details__description">
            <h3>Description</h3>
            <p>${description}</p>
          </div>
        ` : ''}
        
        <div class="event-details__actions">
          <button class="btn btn--secondary">Edit</button>
          <button class="btn btn--primary">Add to Calendar</button>
        </div>
      </div>
    `;

    // Add event listeners
    details.querySelector('.event-details__overlay').addEventListener('click', () => this.close());
    details.querySelector('.event-details__close').addEventListener('click', () => this.close());

    return details;
  }

  /**
   * Format a date string to a readable date
   * @param {string} dateString - The date string to format
   * @returns {string} The formatted date string
   * @private
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  /**
   * Format a date string to a time string
   * @param {string} dateString - The date string to format
   * @returns {string} The formatted time string
   * @private
   */
  formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Calculate the duration between two dates
   * @param {string} start - The start date string
   * @param {string} end - The end date string
   * @returns {string} The formatted duration
   * @private
   */
  calculateDuration(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate - startDate;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  /**
   * Close the details view
   */
  close() {
    this.element.classList.add('event-details--closing');
    setTimeout(() => {
      this.element.remove();
      if (this.onClose) this.onClose();
    }, 300); // Match the CSS transition duration
  }

  /**
   * Render the event details
   * @param {HTMLElement} container - The container to render into
   */
  render(container) {
    container.appendChild(this.element);
    // Trigger the opening animation
    requestAnimationFrame(() => {
      this.element.classList.add('event-details--visible');
    });
  }
}
