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
import JoinEvents from './Components/JoinEvents/JoinEvents';
import JoinOpportunities from './Components/JoinOpportunities/JoinOpportunities';
import EventParticipants from './Components/Admin/EventParticipants';
import OpportunityParticipants from './Components/Admin/OpportunityParticipants';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import Profile from './Components/Profile/Profile';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import './App.css';

// Composant de route protégée qui vérifie l'authentification
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authApi.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Composant de route protégée pour les administrateurs
const AdminRoute = ({ children }) => {
  const isAuthenticated = authApi.isAuthenticated();
  const currentUser = authApi.getCurrentUser();
  const isAdmin = currentUser && currentUser.role === 'admin';
  
  return isAuthenticated && isAdmin ? children : <Navigate to="/" replace />;
};

// Composant principal de l'application
function App() {
  // Force le re-rendu lorsque l'état d'authentification change
  const [authState, setAuthState] = useState(authApi.isAuthenticated());
  
  // Effet pour écouter les changements d'authentification
  useEffect(() => {
    const handleStorageChange = () => {
      setAuthState(authApi.isAuthenticated());
    };
    
    // Écoute les événements de stockage pour les changements d'authentification
    window.addEventListener('storage', handleStorageChange);
    
    // Écoute également les événements personnalisés d'authentification
    window.addEventListener('auth-change', handleStorageChange);
    
    // Nettoyage des écouteurs d'événements lors du démontage
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      {/* Barre de navigation avec clé unique pour forcer le re-rendu */}
      <Navbar key={`navbar-${authState}`} />
      <Routes>
        {/* Routes publiques accessibles à tous les utilisateurs */}
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/opportunities/:id" element={<OpportunityDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Routes protégées nécessitant une authentification */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* Routes pour rejoindre des événements et opportunités (utilisateurs connectés) */}
        <Route path="/join-events" element={
          <ProtectedRoute>
            <JoinEvents />
          </ProtectedRoute>
        } />
        <Route path="/join-opportunities" element={
          <ProtectedRoute>
            <JoinOpportunities />
          </ProtectedRoute>
        } />
        
        {/* Routes protégées pour les administrateurs uniquement */}
        <Route path="/create-event" element={
          <AdminRoute>
            <EventForm />
          </AdminRoute>
        } />
        <Route path="/create-opportunity" element={
          <AdminRoute>
            <OpportunityForm />
          </AdminRoute>
        } />
        <Route path="/admin/events/:id/participants" element={
          <AdminRoute>
            <EventParticipants />
          </AdminRoute>
        } />
        <Route path="/admin/opportunities/:id/participants" element={
          <AdminRoute>
            <OpportunityParticipants />
          </AdminRoute>
        } />
        
        {/* Route par défaut redirigeant vers la page d'accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* Pied de page */}
      <Footer />
    </Router>
  );
}

export default App;