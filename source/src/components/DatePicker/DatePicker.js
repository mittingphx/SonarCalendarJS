/**
 * DatePicker component for calendar date selection
 */

export class DatePicker {
  /**
   * Create a new DatePicker instance
   * @param {Object} options - Configuration options
   * @param {Date} [options.initialDate=new Date()] - Initial selected date
   * @param {Function} [options.onChange] - Callback when date changes
   * @param {string} [options.theme='light'] - Theme ('light' or 'dark')
   */
  constructor({ initialDate = new Date(), onChange, theme = 'light' } = {}) {
    this.selectedDate = new Date(initialDate);
    this.onChange = onChange;
    this.theme = theme;
    this.months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    this.element = this.createElement();
  }

  /**
   * Create the date picker element
   * @returns {HTMLElement} The created element
   * @private
   */
  createElement() {
    const container = document.createElement('div');
    container.className = `date-picker theme-${this.theme}`;
    
    // Navigation controls
    const nav = document.createElement('div');
    nav.className = 'date-picker__nav';
    
    const prevButton = document.createElement('button');
    prevButton.className = 'date-picker__nav-button';
    prevButton.innerHTML = '&larr;';
    prevButton.setAttribute('aria-label', 'Previous month');
    prevButton.addEventListener('click', () => this.navigate(-1));
    
    const nextButton = document.createElement('button');
    nextButton.className = 'date-picker__nav-button';
    nextButton.innerHTML = '&rarr;';
    nextButton.setAttribute('aria-label', 'Next month');
    nextButton.addEventListener('click', () => this.navigate(1));
    
    this.monthYearDisplay = document.createElement('span');
    this.monthYearDisplay.className = 'date-picker__month-year';
    this.updateMonthYearDisplay();
    
    nav.appendChild(prevButton);
    nav.appendChild(this.monthYearDisplay);
    nav.appendChild(nextButton);
    
    // Calendar grid
    this.calendarGrid = document.createElement('div');
    this.calendarGrid.className = 'date-picker__grid';
    this.calendarGrid.setAttribute('role', 'grid');
    this.calendarGrid.setAttribute('aria-label', 'Calendar');
    
    // Day headers
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const dayHeaders = document.createElement('div');
    dayHeaders.className = 'date-picker__day-headers';
    dayNames.forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'date-picker__day-header';
      dayHeader.textContent = day;
      dayHeader.setAttribute('aria-label', day);
      dayHeaders.appendChild(dayHeader);
    });
    
    this.daysContainer = document.createElement('div');
    this.daysContainer.className = 'date-picker__days';
    this.renderDays();
    
    this.calendarGrid.appendChild(dayHeaders);
    this.calendarGrid.appendChild(this.daysContainer);
    
    container.appendChild(nav);
    container.appendChild(this.calendarGrid);
    
    return container;
  }

  /**
   * Update the month and year display
   * @private
   */
  updateMonthYearDisplay() {
    const month = this.months[this.selectedDate.getMonth()];
    const year = this.selectedDate.getFullYear();
    this.monthYearDisplay.textContent = `${month} ${year}`;
    this.monthYearDisplay.setAttribute('aria-live', 'polite');
  }

  /**
   * Render the calendar days
   * @private
   */
  renderDays() {
    this.daysContainer.innerHTML = '';
    
    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth();
    
    // Get first day of month and total days in month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Create day elements
    for (let i = 0; i < 42; i++) { // 6 rows x 7 days
      const day = i - firstDay + 1;
      const dayElement = document.createElement('button');
      dayElement.className = 'date-picker__day';
      dayElement.setAttribute('role', 'gridcell');
      
      if (day > 0 && day <= daysInMonth) {
        dayElement.textContent = day;
        dayElement.dataset.day = day;
        dayElement.setAttribute('aria-label', new Date(year, month, day).toLocaleDateString());
        
        // Highlight current day
        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
          dayElement.classList.add('is-today');
        }
        
        // Highlight selected day
        if (day === this.selectedDate.getDate()) {
          dayElement.classList.add('is-selected');
          dayElement.setAttribute('aria-selected', 'true');
        } else {
          dayElement.setAttribute('aria-selected', 'false');
        }
        
        dayElement.addEventListener('click', () => this.selectDay(day));
      } else {
        dayElement.classList.add('is-empty');
        dayElement.setAttribute('aria-hidden', 'true');
      }
      
      this.daysContainer.appendChild(dayElement);
    }
  }

  /**
   * Navigate to previous or next month
   * @param {number} direction - -1 for previous month, 1 for next month
   * @private
   */
  navigate(direction) {
    this.selectedDate.setMonth(this.selectedDate.getMonth() + direction);
    this.updateMonthYearDisplay();
    this.renderDays();
  }

  /**
   * Select a day
   * @param {number} day - The day to select
   * @private
   */
  selectDay(day) {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(day);
    this.selectedDate = newDate;
    this.renderDays();
    
    if (this.onChange) {
      this.onChange(newDate);
    }
  }

  /**
   * Set the selected date
   * @param {Date} date - The date to select
   */
  setDate(date) {
    this.selectedDate = new Date(date);
    this.updateMonthYearDisplay();
    this.renderDays();
  }

  /**
   * Set the theme
   * @param {string} theme - The theme to set ('light' or 'dark')
   */
  setTheme(theme) {
    this.theme = theme;
    this.element.className = `date-picker theme-${theme}`;
  }

  /**
   * Get the current selected date
   * @returns {Date} The selected date
   */
  getDate() {
    return new Date(this.selectedDate);
  }
}

export default DatePicker;
