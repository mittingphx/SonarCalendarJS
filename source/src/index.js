/**
 * Sonar Calendar - Main Entry Point
 * 
 * This is the main entry point for the Sonar Calendar library.
 * It initializes the calendar and sets up the necessary event listeners.
 */

// Import base styles
import './styles/base.css';
import './styles/themes/light.css'; // Default theme
import './styles/themes/dark.css';

// Import component styles
import './components/EventCard/EventCard.css';
import './components/EventDetails/EventDetails.css';
import './components/ViewToggle/ViewToggle.css';
import './components/DatePicker/DatePicker.css';
import { SonarCalendar } from './components/Calendar/Calendar';

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
const SonarCalendarLib = {
  init: initSonarCalendar,
  Calendar: SonarCalendar,
  VERSION: '1.0.0' // Add version info
};

// For UMD/script tag usage
if (typeof window !== 'undefined') {
  window.SonarCalendar = SonarCalendarLib;
}

// For CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SonarCalendarLib;
}

// For ES modules
export { SonarCalendar };
export default SonarCalendarLib;
