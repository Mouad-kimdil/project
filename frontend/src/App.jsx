import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authApi } from './api/authApi';
import HomePage from './Components/HomePage/Home';
import Events from './Components/Events/Events';
import EventDetail from './Components/Events/EventDetail';
import EventForm from './Components/Forms/EventForm';
import Opportunities from './Components/Opportunities/Opportunities';
import OpportunityDetail from './Components/Opportunities/OpportunityDetail';
import OpportunityForm from './Components/Forms/OpportunityForm';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import Profile from './Components/Profile/Profile';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authApi.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  // Force re-render when auth state changes
  const [authState, setAuthState] = useState(authApi.isAuthenticated());
  
  useEffect(() => {
    const handleStorageChange = () => {
      setAuthState(authApi.isAuthenticated());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom auth events
    window.addEventListener('auth-change', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Navbar key={`navbar-${authState}`} />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/opportunities/:id" element={<OpportunityDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/create-event" element={
          <ProtectedRoute>
            <EventForm />
          </ProtectedRoute>
        } />
        <Route path="/create-opportunity" element={
          <ProtectedRoute>
            <OpportunityForm />
          </ProtectedRoute>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;