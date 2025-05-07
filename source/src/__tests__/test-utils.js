import { JSDOM } from 'jsdom';

// Set up a basic DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.navigator = window.navigator;

// Helper function to create a container for each test
export const createTestContainer = () => {
  const container = document.createElement('div');
  container.id = 'test-container';
  document.body.appendChild(container);
  return container;
};

// Helper function to clean up after each test
export const cleanupTestContainer = (container) => {
  if (container && container.parentNode) {
    container.parentNode.removeChild(container);
  }
};

// Helper function to create a mock event
export const createMockEvent = (overrides = {}) => ({
  id: `event-${Math.random().toString(36).substr(2, 9)}`,
  title: 'Test Event',
  start: new Date(),
  end: new Date(Date.now() + 3600000), // 1 hour later
  description: 'This is a test event',
  location: 'Test Location',
  category: 'test',
  ...overrides,
});

// Helper to wait for async operations
export const waitFor = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to mock the current date
export const mockCurrentDate = (date) => {
  const mockDate = new Date(date);
  const RealDate = Date;
  
  global.Date = class extends RealDate {
    constructor(...args) {
      if (args.length === 0) {
        return new RealDate(mockDate);
      }
      return new RealDate(...args);
    }
    static now() {
      return mockDate.getTime();
    }
  };
  
  return () => {
    global.Date = RealDate;
  };
};
