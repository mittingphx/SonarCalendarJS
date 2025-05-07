/**
 * EventCard Component
 * 
 * Displays a single event in the calendar
 */

export class EventCard {
  /**
   * Create a new EventCard instance
   * @param {Object} event - The event data
   * @param {string} [theme='light'] - The theme to use ('light' or 'dark')
   * @param {Function} [onClick] - Callback function when the card is clicked
   */
  constructor(event, theme = 'light', onClick) {
    this.event = event;
    this.theme = theme;
    this.onClick = onClick;
    this.element = this.createElement();
  }

  /**
   * Create the event card element
   * @returns {HTMLElement} The created element
   * @private
   */
  createElement() {
    const { id, title, start, end, description, category } = this.event;
    const startTime = this.formatTime(start);
    const endTime = this.formatTime(end);
    const categoryClass = category ? `event-category-${category.toLowerCase().replace(/\s+/g, '-')}` : '';

    const card = document.createElement('div');
    card.className = `event-card ${categoryClass} theme-${this.theme}`;
    card.dataset.eventId = id;
    
    // Add ARIA attributes for accessibility
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View details for ${title}`);
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View details for ${title}`);
    
    card.innerHTML = `
      <div class="event-card__header">
        <h3 class="event-card__title">${title}</h3>
        ${category ? `<span class="event-card__category">${category}</span>` : ''}
      </div>
      <div class="event-card__time">
        <time datetime="${start}">${startTime}</time> - <time datetime="${end}">${endTime}</time>
      </div>
      ${description ? `<p class="event-card__description">${description}</p>` : ''}
      <div class="event-card__more">View details</div>
    `;
    
    // Add click and keyboard event listeners
    if (this.onClick) {
      const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.onClick(this.event);
      };
      
      card.addEventListener('click', handleClick);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      });
    }

    return card;
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
   * Render the event card
   * @param {HTMLElement} container - The container to render the card into
   */
  render(container) {
    container.appendChild(this.element);
  }

  /**
   * Update the event data
   * @param {Object} newEvent - The new event data
   */
  update(newEvent) {
    this.event = { ...this.event, ...newEvent };
    const newElement = this.createElement();
    this.element.parentNode.replaceChild(newElement, this.element);
    this.element = newElement;
  }
}
