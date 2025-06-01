import axios from 'axios';

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dispatch auth change event
const dispatchAuthChangeEvent = () => {
  window.dispatchEvent(new Event('auth-change'));
};

// Store registered users in localStorage for development
const getRegisteredUsers = () => {
  const users = localStorage.getItem('registeredUsers');
  return users ? JSON.parse(users) : [];
};

const saveRegisteredUser = (user) => {
  const users = getRegisteredUsers();
  users.push(user);
  localStorage.setItem('registeredUsers', JSON.stringify(users));
};

// Update a user in the registered users list
const updateRegisteredUser = (updatedUser) => {
  const users = getRegisteredUsers();
  const updatedUsers = users.map(user => 
    user.id === updatedUser.id ? { ...user, ...updatedUser } : user
  );
  localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
};

// Get user events and activities
const getUserEvents = (userId) => {
  const eventsStr = localStorage.getItem('userEvents');
  const events = eventsStr ? JSON.parse(eventsStr) : {};
  return events[userId] || [];
};

const getUserOpportunities = (userId) => {
  const opportunitiesStr = localStorage.getItem('userOpportunities');
  const opportunities = opportunitiesStr ? JSON.parse(opportunitiesStr) : {};
  return opportunities[userId] || [];
};

export const authApi = {
  login: async (email, password) => {
    try {
      console.log('Checking login credentials');
      
      // For development - check against localStorage registered users
      const users = getRegisteredUsers();
      const user = users.find(u => u.email === email);
      
      if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
      }
      
      // Create a user object without the password
      const authenticatedUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage, // Include profile image
        role: user.role || 'user'
      };
      
      const token = 'dev-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      
      // Dispatch auth change event
      dispatchAuthChangeEvent();
      
      return { token, user: authenticatedUser };
    } catch (error) {
      console.error('Login failed:', error.message);
      throw {
        response: {
          data: {
            message: 'Invalid email or password'
          }
        }
      };
    }
  },

  register: async (userData) => {
    try {
      console.log('Registering new user');
      
      // For development - store in localStorage
      const users = getRegisteredUsers();
      
      // Check if email already exists
      if (users.some(user => user.email === userData.email)) {
        throw new Error('Email already registered');
      }
      
      // Create new user with ID
      const newUser = {
        id: `user_${Date.now()}`,
        ...userData,
        role: 'user'
      };
      
      // Save to localStorage
      saveRegisteredUser(newUser);
      
      // Create a user object without the password
      const registeredUser = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role
      };
      
      const token = 'dev-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      
      // Initialize empty events and opportunities for the user
      const userEvents = JSON.parse(localStorage.getItem('userEvents') || '{}');
      userEvents[newUser.id] = [];
      localStorage.setItem('userEvents', JSON.stringify(userEvents));
      
      const userOpportunities = JSON.parse(localStorage.getItem('userOpportunities') || '{}');
      userOpportunities[newUser.id] = [];
      localStorage.setItem('userOpportunities', JSON.stringify(userOpportunities));
      
      // Dispatch auth change event
      dispatchAuthChangeEvent();
      
      return { token, user: registeredUser };
    } catch (error) {
      console.error('Registration failed:', error.message);
      throw {
        response: {
          data: {
            message: error.message || 'Registration failed'
          }
        }
      };
    }
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Dispatch auth change event
    dispatchAuthChangeEvent();
  },

  getMe: async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('User not found');
    }
    return JSON.parse(userStr);
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  updateProfile: (userData) => {
    // Get current user
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) return false;
    
    // Update user data
    const updatedUser = { ...currentUser, ...userData };
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update in registered users
    updateRegisteredUser(updatedUser);
    
    // Dispatch auth change event
    dispatchAuthChangeEvent();
    
    return true;
  },

  getUserStats: () => {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) return null;
    
    const events = getUserEvents(currentUser.id);
    const opportunities = getUserOpportunities(currentUser.id);
    
    // Calculate hours based on events and opportunities
    const hoursVolunteered = events.reduce((total, event) => total + (event.hours || 2), 0) + 
                            opportunities.reduce((total, opp) => total + (opp.hours || 3), 0);
    
    return {
      hoursVolunteered,
      eventsAttended: events.length,
      peopleImpacted: events.length * 10 + opportunities.length * 5 // Simple calculation for demo
    };
  },

  getUserActivities: () => {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) return [];
    
    const events = getUserEvents(currentUser.id).map(event => ({
      ...event,
      type: 'event'
    }));
    
    const opportunities = getUserOpportunities(currentUser.id).map(opp => ({
      ...opp,
      type: 'opportunity'
    }));
    
    return [...events, ...opportunities].sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  addEvent: (eventData) => {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) return false;
    
    const event = {
      id: `event_${Date.now()}`,
      ...eventData,
      date: eventData.date || new Date().toISOString().split('T')[0],
      status: 'Upcoming',
      userId: currentUser.id
    };
    
    const userEvents = JSON.parse(localStorage.getItem('userEvents') || '{}');
    userEvents[currentUser.id] = userEvents[currentUser.id] || [];
    userEvents[currentUser.id].push(event);
    localStorage.setItem('userEvents', JSON.stringify(userEvents));
    
    return event;
  },

  addOpportunity: (opportunityData) => {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) return false;
    
    const opportunity = {
      id: `opportunity_${Date.now()}`,
      ...opportunityData,
      date: opportunityData.date || new Date().toISOString().split('T')[0],
      status: 'Active',
      userId: currentUser.id
    };
    
    const userOpportunities = JSON.parse(localStorage.getItem('userOpportunities') || '{}');
    userOpportunities[currentUser.id] = userOpportunities[currentUser.id] || [];
    userOpportunities[currentUser.id].push(opportunity);
    localStorage.setItem('userOpportunities', JSON.stringify(userOpportunities));
    
    return opportunity;
  },

  isAuthenticated: () => localStorage.getItem('token') !== null,
  
  // Demo login function
  demoLogin: async () => {
    return authApi.login('demo@example.com', 'Demo123');
  }
};

// Initialize with a demo user if no users exist
if (getRegisteredUsers().length === 0) {
  saveRegisteredUser({
    id: 'demo-user-id',
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@example.com',
    password: 'Demo123',
    role: 'user'
  });
  
  // Add some demo events and opportunities for the demo user
  const demoEvents = [
    {
      id: 'event_1',
      title: 'Community Cleanup Day',
      date: '2023-08-15',
      status: 'Completed',
      hours: 4,
      userId: 'demo-user-id'
    }
  ];
  
  const demoOpportunities = [
    {
      id: 'opportunity_1',
      title: 'Reading Buddy',
      date: '2023-09-05',
      status: 'Active',
      hours: 2,
      userId: 'demo-user-id'
    }
  ];
  
  localStorage.setItem('userEvents', JSON.stringify({ 'demo-user-id': demoEvents }));
  localStorage.setItem('userOpportunities', JSON.stringify({ 'demo-user-id': demoOpportunities }));
}

export default api;