// Mock event data
const mockEvents = [
  {
    id: 'event-1',
    title: 'Team Meeting',
    start: '2025-05-10T10:00:00Z',
    end: '2025-05-10T11:00:00Z',
    description: 'Weekly team sync',
    location: 'Zoom',
    category: 'meeting'
  },
  {
    id: 'event-2',
    title: 'Lunch Break',
    start: '2025-05-10T12:00:00Z',
    end: '2025-05-10T13:00:00Z',
    description: 'Lunch with team',
    location: 'Cafeteria',
    category: 'personal'
  }
];

const eventService = {
  getEvents: jest.fn().mockImplementation((filters = {}) => {
    // Simple filtering for testing
    let events = [...mockEvents];
    
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      events = events.filter(event => new Date(event.start) >= startDate);
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      events = events.filter(event => new Date(event.end) <= endDate);
    }
    
    return Promise.resolve(events);
  }),
  
  createEvent: jest.fn().mockImplementation((event) => {
    const newEvent = {
      ...event,
      id: `event-${Math.random().toString(36).substr(2, 9)}`
    };
    mockEvents.push(newEvent);
    return Promise.resolve(newEvent);
  }),
  
  updateEvent: jest.fn().mockImplementation((id, updates) => {
    const index = mockEvents.findIndex(event => event.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Event not found'));
    }
    mockEvents[index] = { ...mockEvents[index], ...updates };
    return Promise.resolve(mockEvents[index]);
  }),
  
  deleteEvent: jest.fn().mockImplementation((id) => {
    const index = mockEvents.findIndex(event => event.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Event not found'));
    }
    mockEvents.splice(index, 1);
    return Promise.resolve({ success: true });
  })
};

export default eventService;
