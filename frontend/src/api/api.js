import axios from 'axios';
import { authApi } from './authApi';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API for Events
export const eventsApi = {
  getEvents: async (page = 1, limit = 3) => {
    try {
      const response = await api.get(`/events?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      
      // Get all user events from localStorage
      const allEvents = getAllUserEvents();
      
      // Sort by date and paginate
      const sortedEvents = allEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return sortedEvents.slice(startIndex, endIndex);
    }
  },
  
  getEventById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching event with id ${id}:`, error);
      
      // Find event in localStorage
      const allEvents = getAllUserEvents();
      const event = allEvents.find(e => e.id === id);
      
      if (event) return event;
      
      // Return mock data if not found
      return getMockData('event', 1, 1, id);
    }
  },

  createEvent: async (eventData) => {
    const formData = new FormData();
    Object.keys(eventData).forEach(key => {
      if (key === 'image' && eventData[key]) {
        formData.append(key, eventData[key]);
      } else {
        formData.append(key, eventData[key]);
      }
    });

    try {
      const response = await api.post('/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.data;
    } catch (error) {
      // Add event using authApi as fallback
      return authApi.addEvent(eventData);
    }
  }
};

// API for Opportunities
export const opportunitiesApi = {
  getOpportunities: async (page = 1, limit = 6) => {
    try {
      const response = await api.get(`/opportunities?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.log('Falling back to mock opportunities data');
      
      // Get example opportunities
      const exampleOpportunities = getExampleOpportunities();
      console.log('Example opportunities:', exampleOpportunities.length);
      
      // Get all user opportunities from localStorage
      const allOpportunities = getAllUserOpportunities();
      console.log('User opportunities:', allOpportunities.length);
      
      // Combine user opportunities with example opportunities
      const combinedOpportunities = [...allOpportunities, ...exampleOpportunities];
      console.log('Combined opportunities:', combinedOpportunities.length);
      
      // Sort by date and paginate
      const sortedOpportunities = combinedOpportunities.sort((a, b) => new Date(b.date) - new Date(a.date));
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return sortedOpportunities.slice(startIndex, endIndex);
    }
  },
  
  getOpportunityById: async (id) => {
    try {
      const response = await api.get(`/opportunities/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching opportunity with id ${id}:`, error);
      
      // Find opportunity in localStorage
      const allOpportunities = getAllUserOpportunities();
      const opportunity = allOpportunities.find(o => o.id === id);
      
      if (opportunity) return opportunity;
      
      // Check example opportunities
      const exampleOpportunities = getExampleOpportunities();
      const exampleOpportunity = exampleOpportunities.find(o => o.id === id);
      
      if (exampleOpportunity) return exampleOpportunity;
      
      // Return mock data if not found
      return getMockData('opportunity', 1, 1, id);
    }
  },

  createOpportunity: async (opportunityData) => {
    const formData = new FormData();
    Object.keys(opportunityData).forEach(key => {
      if (key === 'image' && opportunityData[key]) {
        formData.append(key, opportunityData[key]);
      } else if (key === 'skills' && Array.isArray(opportunityData[key])) {
        formData.append(key, opportunityData[key].join(','));
      } else {
        formData.append(key, opportunityData[key]);
      }
    });

    try {
      const response = await api.post('/opportunities', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.data;
    } catch (error) {
      // Add opportunity using authApi as fallback
      return authApi.addOpportunity(opportunityData);
    }
  },
  
  getUserOpportunities: () => {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) return [];
    
    const userOpportunities = JSON.parse(localStorage.getItem('userOpportunities') || '{}');
    return userOpportunities[currentUser.id] || [];
  }
};

// API for Testimonials
export const testimonialsApi = {
  getRandomTestimonials: async (limit = 4) => {
    try {
      const response = await api.get(`/testimonials/random?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Return mock data for development
      return getMockData('testimonials', 1, limit);
    }
  },

  createTestimonial: async (testimonialData) => {
    const formData = new FormData();
    Object.keys(testimonialData).forEach(key => {
      if (key === 'image' && testimonialData[key]) {
        formData.append(key, testimonialData[key]);
      } else {
        formData.append(key, testimonialData[key]);
      }
    });

    const response = await api.post('/testimonials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  }
};

// Helper function to get all user events from localStorage
function getAllUserEvents() {
  const userEvents = JSON.parse(localStorage.getItem('userEvents') || '{}');
  let allEvents = [];
  
  // Combine all user events into a single array
  Object.values(userEvents).forEach(events => {
    allEvents = [...allEvents, ...events];
  });
  
  return allEvents;
}

// Helper function to get all user opportunities from localStorage
function getAllUserOpportunities() {
  const userOpportunities = JSON.parse(localStorage.getItem('userOpportunities') || '{}');
  let allOpportunities = [];
  
  // Combine all user opportunities into a single array
  Object.values(userOpportunities).forEach(opportunities => {
    allOpportunities = [...allOpportunities, ...opportunities];
  });
  
  return allOpportunities;
}

// Example opportunities to inspire users
function getExampleOpportunities() {
  return [
    {
      id: 'example-1',
      title: 'Homeless Shelter Assistant',
      organization: 'City Shelter',
      location: 'Downtown',
      category: 'Social Services',
      commitment: 'Weekly, 3-4 hours',
      description: 'Help prepare and serve meals at the local homeless shelter. Tasks include food preparation, serving meals, cleaning up, and interacting with shelter residents. No experience necessary, but must be at least 18 years old.',
      requirements: 'Must be 18+, Background check required',
      skills: ['Food preparation', 'Customer service', 'Empathy'],
      contactEmail: 'volunteer@cityshelter.org',
      contactPhone: '(555) 123-4567',
      image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      date: '2023-08-15',
      hours: 3,
      isExample: true
    },
    {
      id: 'example-2',
      title: 'Reading Buddy',
      organization: 'Public Library',
      location: 'Various Locations',
      category: 'Education',
      commitment: 'Weekly, 2 hours',
      description: 'Read with children to improve their literacy skills. Volunteers will be paired with children ages 6-12 who need extra help with reading. This is a rewarding opportunity to make a direct impact on a child\'s education and future.',
      requirements: 'Must be 16+, Background check required',
      skills: ['Patience', 'Teaching', 'Communication'],
      contactEmail: 'volunteer@publiclibrary.org',
      contactPhone: '(555) 987-6543',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      date: '2023-09-05',
      hours: 2,
      isExample: true
    },
    {
      id: 'example-3',
      title: 'Wildlife Conservation Volunteer',
      organization: 'Nature Conservancy',
      location: 'National Park',
      category: 'Environment',
      commitment: 'Monthly, Full day',
      description: 'Help with habitat restoration and wildlife monitoring. Activities include planting native species, removing invasive plants, and tracking wildlife populations. Perfect for nature lovers who want to contribute to environmental conservation.',
      requirements: 'Must be 18+, Outdoor experience preferred',
      skills: ['Physical stamina', 'Environmental knowledge', 'Teamwork'],
      contactEmail: 'volunteer@natureconservancy.org',
      contactPhone: '(555) 456-7890',
      image: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      date: '2023-10-10',
      hours: 8,
      isExample: true
    },
    {
      id: 'example-4',
      title: 'Senior Companion',
      organization: 'Elder Care Alliance',
      location: 'City-wide',
      category: 'Senior Support',
      commitment: 'Weekly, 2-3 hours',
      description: 'Provide companionship to seniors who may be isolated or lonely. Activities include conversation, playing games, reading, or accompanying them on walks. This role helps reduce isolation and improves quality of life for elderly community members.',
      requirements: 'Must be 18+, Background check required',
      skills: ['Empathy', 'Patience', 'Good listener'],
      contactEmail: 'volunteer@eldercare.org',
      contactPhone: '(555) 234-5678',
      image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      date: '2023-09-15',
      hours: 3,
      isExample: true
    },
    {
      id: 'example-5',
      title: 'Community Garden Helper',
      organization: 'Urban Greening Project',
      location: 'Community Gardens',
      category: 'Environment',
      commitment: 'Weekly, 4 hours',
      description: 'Help maintain community gardens that provide fresh produce to local food banks and community members. Tasks include planting, weeding, watering, and harvesting. Learn about sustainable gardening while helping to provide fresh food to those in need.',
      requirements: 'No experience necessary, all ages welcome',
      skills: ['Gardening', 'Physical work', 'Reliability'],
      contactEmail: 'garden@urbangreening.org',
      contactPhone: '(555) 876-5432',
      image: 'https://images.unsplash.com/photo-1592150621744-aca64f48df1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      date: '2023-08-20',
      hours: 4,
      isExample: true
    },
    {
      id: 'example-6',
      title: 'Crisis Hotline Volunteer',
      organization: 'Mental Health Support Network',
      location: 'Remote',
      category: 'Crisis Response',
      commitment: 'Weekly, 4-6 hours',
      description: 'Provide support to individuals in crisis through our telephone hotline. Volunteers receive comprehensive training in crisis intervention, active listening, and mental health resources. This is a challenging but incredibly rewarding opportunity to help people during difficult times.',
      requirements: 'Must be 21+, Training required, Background check',
      skills: ['Active listening', 'Empathy', 'Crisis management'],
      contactEmail: 'volunteer@mhsupport.org',
      contactPhone: '(555) 345-6789',
      image: 'https://images.unsplash.com/photo-1590402494587-44b71d7772f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      date: '2023-09-01',
      hours: 5,
      isExample: true
    }
  ];
}

// Consolidated mock data function
function getMockData(type, page = 1, limit = 10, id = null) {
  const mockData = {
    events: [
      {
        id: 1,
        title: 'Community Cleanup Day',
        date: '2023-08-15',
        location: 'Central Park',
        description: 'Join us for a day of cleaning up our community parks and streets.',
        image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        organizer: 'Green Earth Initiative',
        contactEmail: 'info@greenearthinitiative.org',
        startTime: '9:00 AM',
        endTime: '2:00 PM'
      },
      {
        id: 2,
        title: 'Food Drive',
        date: '2023-09-05',
        location: 'Community Center',
        description: 'Help us collect food for families in need in our community.',
        image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        organizer: 'Community Helpers',
        contactEmail: 'info@communityhelpers.org',
        startTime: '10:00 AM',
        endTime: '4:00 PM'
      },
      {
        id: 3,
        title: 'Charity Run',
        date: '2023-10-10',
        location: 'Riverside Park',
        description: 'Annual 5K run to raise funds for local children\'s hospital.',
        image: 'https://images.unsplash.com/photo-1533560904424-a0c61c4aae5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        organizer: 'Hope Foundation',
        contactEmail: 'info@hopefoundation.org',
        startTime: '8:00 AM',
        endTime: '12:00 PM'
      }
    ],
    opportunities: [
      {
        id: 1,
        title: 'Homeless Shelter Assistant',
        organization: 'City Shelter',
        location: 'Downtown',
        category: 'Social Services',
        commitment: 'Weekly, 3-4 hours',
        description: 'Help prepare and serve meals at the local homeless shelter.',
        image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: 2,
        title: 'Reading Buddy',
        organization: 'Public Library',
        location: 'Various Locations',
        category: 'Education',
        commitment: 'Weekly, 2 hours',
        description: 'Read with children to improve their literacy skills.',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: 3,
        title: 'Wildlife Conservation Volunteer',
        organization: 'Nature Conservancy',
        location: 'National Park',
        category: 'Environment',
        commitment: 'Monthly, Full day',
        description: 'Help with habitat restoration and wildlife monitoring.',
        image: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
      }
    ],
    testimonials: [
      {
        name: "Sarah Johnson",
        role: "Environmental Volunteer",
        quote: "Volunteering with this organization has been one of the most rewarding experiences of my life. I've met amazing people and made a real difference in my community.",
        image: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      {
        name: "Michael Chen",
        role: "Youth Mentor",
        quote: "The support and training I received made me feel confident in my role as a mentor. Seeing the impact on the kids I work with is incredibly fulfilling.",
        image: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      {
        name: "Aisha Patel",
        role: "Food Bank Volunteer",
        quote: "I started volunteering during the pandemic and haven't stopped since. The team is so welcoming and the work we do helps so many families in need.",
        image: "https://randomuser.me/api/portraits/women/65.jpg"
      },
      {
        name: "David Rodriguez",
        role: "Community Organizer",
        quote: "This platform made it easy to find opportunities that matched my skills and schedule. I've been able to contribute in ways I never thought possible.",
        image: "https://randomuser.me/api/portraits/men/67.jpg"
      }
    ]
  };

  // Handle single item requests
  if (type === 'event' && id) {
    const event = mockData.events.find(e => e.id == id) || mockData.events[0];
    return {
      ...event,
      description: event.description + ' We\'ll provide all necessary supplies including gloves, trash bags, and tools. Lunch will be provided for all volunteers. This is a great opportunity to meet new people and make a positive impact on our environment.'
    };
  }

  if (type === 'opportunity' && id) {
    const opportunity = mockData.opportunities.find(o => o.id == id) || mockData.opportunities[0];
    return {
      ...opportunity,
      description: opportunity.description + ' Tasks include food preparation, serving meals, cleaning up, and interacting with shelter residents. No experience necessary, but must be at least 18 years old.',
      requirements: 'Must be 18+, Background check required',
      skills: ['Food preparation', 'Customer service', 'Empathy'],
      contactEmail: `volunteer@${opportunity.organization.toLowerCase().replace(/\s/g, '')}.org`,
      contactPhone: '(555) 123-4567'
    };
  }

  // Handle list requests with pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return mockData[type].slice(startIndex, endIndex);
}

// Initialize with example opportunities if none exist
if (!localStorage.getItem('exampleOpportunitiesInitialized')) {
  localStorage.setItem('exampleOpportunitiesInitialized', 'true');
  console.log('Initializing example opportunities');
  
  // Force the example opportunities to be available
  const exampleOpps = getExampleOpportunities();
  console.log(`Initialized ${exampleOpps.length} example opportunities`);
}

export default api;