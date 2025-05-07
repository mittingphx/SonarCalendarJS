import { SonarCalendar } from '../components/Calendar/Calendar';
import { createTestContainer, cleanupTestContainer, createMockEvent, mockCurrentDate } from './test-utils';

// Mock the eventService
jest.mock('../../services/eventService');

// Mock the Date object for consistent testing
const mockDate = '2025-05-10T12:00:00Z';
let restoreDateMock;

describe('SonarCalendar', () => {
  let container;
  let calendar;

  beforeAll(() => {
    // Set up JSDOM
    global.document.body.innerHTML = '<div id="app"></div>';
    
    // Mock the current date
    restoreDateMock = mockCurrentDate(mockDate);
  });

  afterAll(() => {
    // Restore the original Date object
    restoreDateMock();
  });

  beforeEach(() => {
    // Create a clean container for each test
    container = createTestContainer();
  });

  afterEach(() => {
    // Clean up after each test
    if (calendar && typeof calendar.destroy === 'function') {
      calendar.destroy();
    }
    cleanupTestContainer(container);
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    test('should initialize with default options', () => {
      calendar = new SonarCalendar({ container });
      expect(container.querySelector('.sonar-calendar')).not.toBeNull();
    });

    test('should apply custom theme', () => {
      calendar = new SonarCalendar({ 
        container, 
        theme: 'dark' 
      });
      expect(container.querySelector('.sonar-calendar.dark-theme')).not.toBeNull();
    });
  });

  describe('Event Loading', () => {
    test('should load events from API when apiUrl is provided', async () => {
      const apiUrl = 'https://api.example.com/events';
      calendar = new SonarCalendar({ 
        container, 
        apiUrl 
      });

      // Wait for the initial render
      await new Promise(resolve => setTimeout(resolve, 0));

      // Check if the events are rendered
      const events = container.querySelectorAll('.event-card');
      expect(events.length).toBeGreaterThan(0);
    });

    test('should load events from DOM when dataSelector is provided', async () => {
      // Create a test element with event data
      const testData = [
        createMockEvent({
          title: 'DOM Event',
          start: '2025-05-10T14:00:00Z',
          end: '2025-05-10T15:00:00Z'
        })
      ];
      
      const dataElement = document.createElement('div');
      dataElement.id = 'test-data';
      dataElement.textContent = JSON.stringify(testData);
      document.body.appendChild(dataElement);

      calendar = new SonarCalendar({ 
        container, 
        dataSelector: '#test-data' 
      });

      // Wait for the initial render
      await new Promise(resolve => setTimeout(resolve, 0));

      // Clean up
      document.body.removeChild(dataElement);

      // Check if the event is rendered
      const events = container.querySelectorAll('.event-card');
      expect(events.length).toBe(1);
      expect(events[0].textContent).toContain('DOM Event');
    });
  });

  describe('Navigation', () => {
    test('should navigate between months', () => {
      calendar = new SonarCalendar({ container });
      
      // Get the current month display
      const monthDisplay = container.querySelector('.month-display');
      const initialMonth = monthDisplay.textContent;
      
      // Click next month
      const nextButton = container.querySelector('.next-month');
      nextButton.click();
      
      // Check if month changed
      expect(monthDisplay.textContent).not.toBe(initialMonth);
    });
  });

  describe('Event Handling', () => {
    test('should open event details when an event is clicked', async () => {
      calendar = new SonarCalendar({ container });
      
      // Wait for events to load
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Click the first event
      const event = container.querySelector('.event-card');
      event.click();
      
      // Check if event details are shown
      const eventDetails = container.querySelector('.event-details');
      expect(eventDetails).not.toBeNull();
    });
  });
});
