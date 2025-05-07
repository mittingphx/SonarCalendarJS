/**
 * ViewToggle component for switching between different calendar views
 */

export class ViewToggle {
  /**
   * Create a new ViewToggle instance
   * @param {Object} options - Configuration options
   * @param {string} [options.initialView='upcoming'] - Initial active view
   * @param {Function} [options.onChange] - Callback when view changes
   * @param {string} [options.theme='light'] - Theme ('light' or 'dark')
   */
  constructor({ initialView = 'upcoming', onChange, theme = 'light' } = {}) {
    this.views = ['upcoming', 'month', 'week', 'day'];
    this.activeView = initialView;
    this.onChange = onChange;
    this.theme = theme;
    this.element = this.createElement();
  }

  /**
   * Create the view toggle element
   * @returns {HTMLElement} The created element
   * @private
   */
  createElement() {
    const container = document.createElement('div');
    container.className = `view-toggle theme-${this.theme}`;
    container.setAttribute('role', 'tablist');
    container.setAttribute('aria-label', 'Calendar view');

    this.views.forEach(view => {
      const button = document.createElement('button');
      button.className = `view-toggle__button ${view === this.activeView ? 'is-active' : ''}`;
      button.textContent = this.formatViewName(view);
      button.dataset.view = view;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', view === this.activeView ? 'true' : 'false');
      button.setAttribute('aria-controls', 'calendar-view');
      
      button.addEventListener('click', () => this.setActiveView(view));
      
      container.appendChild(button);
    });

    return container;
  }

  /**
   * Format view name for display
   * @param {string} view - View name
   * @returns {string} Formatted view name
   * @private
   */
  formatViewName(view) {
    return view.charAt(0).toUpperCase() + view.slice(1);
  }

  /**
   * Set the active view
   * @param {string} view - View to activate
   */
  setActiveView(view) {
    if (!this.views.includes(view) || view === this.activeView) return;

    // Update active state
    this.element.querySelectorAll('.view-toggle__button').forEach(button => {
      const isActive = button.dataset.view === view;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    this.activeView = view;

    // Trigger change callback
    if (this.onChange) {
      this.onChange(view);
    }
  }


  /**
   * Update the theme
   * @param {string} theme - New theme ('light' or 'dark')
   */
  setTheme(theme) {
    this.theme = theme;
    this.element.classList.toggle('theme-dark', theme === 'dark');
    this.element.classList.toggle('theme-light', theme === 'light');
  }

  /**
   * Render the view toggle in a container
   * @param {HTMLElement} container - Container to render in
   */
  render(container) {
    container.appendChild(this.element);
  }
}

export default ViewToggle;
