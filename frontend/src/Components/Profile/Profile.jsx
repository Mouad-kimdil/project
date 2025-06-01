import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import './Profile.scss';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    hoursVolunteered: 0,
    eventsAttended: 0,
    peopleImpacted: 0
  });
  const [activities, setActivities] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = authApi.getCurrentUser();
        setUser(userData);
        
        // Get real user stats
        const userStats = authApi.getUserStats() || {
          hoursVolunteered: 0,
          eventsAttended: 0,
          peopleImpacted: 0
        };
        setStats(userStats);
        
        // Get real user activities
        const userActivities = authApi.getUserActivities() || [];
        setActivities(userActivities);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    
    // Check if there's an active tab stored in localStorage
    const storedTab = localStorage.getItem('profileActiveTab');
    if (storedTab) {
      setActiveTab(storedTab);
      // Clear it after use
      localStorage.removeItem('profileActiveTab');
    }
  }, []);

  const handleEditProfile = () => {
    // Trigger file input click
    fileInputRef.current.click();
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Read the file as a data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        
        // Use the authApi to update the profile
        authApi.updateProfile({ profileImage: imageUrl });
        
        // Update the local state
        setUser({
          ...user,
          profileImage: imageUrl
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="profile-error">
        <h2>Not Logged In</h2>
        <p>Please <Link to="/login">login</Link> to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.profileImage ? (
            <img src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
          ) : (
            <>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*"
            onChange={handleProfileImageChange}
          />
        </div>
        <div className="profile-info">
          <h1>{user.firstName} {user.lastName}</h1>
          <p className="profile-email">{user.email}</p>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{stats.hoursVolunteered}</span>
              <span className="stat-label">Hours</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.eventsAttended}</span>
              <span className="stat-label">Events</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.peopleImpacted}</span>
              <span className="stat-label">People Impacted</span>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="edit-profile-btn" onClick={handleEditProfile}>
            Change Photo
          </button>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
          onClick={() => setActiveTab('activities')}
        >
          Activities
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="profile-overview">
            <div className="profile-section">
              <h2>Your Impact</h2>
              <div className="impact-cards">
                <div className="impact-card">
                  <div className="impact-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="impact-details">
                    <h3>{stats.hoursVolunteered} Hours</h3>
                    <p>Volunteered</p>
                  </div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <div className="impact-details">
                    <h3>{stats.eventsAttended} Events</h3>
                    <p>Attended</p>
                  </div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="impact-details">
                    <h3>{stats.peopleImpacted} People</h3>
                    <p>Impacted</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="profile-section">
              <h2>Recent Activities</h2>
              {activities.length > 0 ? (
                <>
                  <div className="activities-list">
                    {activities.slice(0, 3).map(activity => (
                      <div className="activity-item" key={activity.id}>
                        <div className="activity-type">
                          <span className={`activity-badge ${activity.type}`}>
                            {activity.type === 'event' ? 'Event' : 'Opportunity'}
                          </span>
                        </div>
                        <div className="activity-details">
                          <h3>{activity.title}</h3>
                          <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                        </div>
                        <div className="activity-status">
                          <span className={`status-badge ${activity.status.toLowerCase()}`}>
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {activities.length > 3 && (
                    <div className="view-all">
                      <button className="view-all-btn" onClick={() => setActiveTab('activities')}>
                        View All Activities
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-activities">
                  <p>You haven't participated in any activities yet.</p>
                  <div className="activity-links">
                    <Link to="/events" className="activity-link">Browse Events</Link>
                    <Link to="/opportunities" className="activity-link">Find Opportunities</Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className="profile-section">
              <h2>Recommended For You</h2>
              <div className="recommendations">
                <div className="recommendation-card">
                  <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Food Drive" />
                  <div className="recommendation-content">
                    <h3>Food Drive</h3>
                    <p>Help collect food for families in need in our community.</p>
                    <Link to="/events/2" className="view-details-btn">View Details</Link>
                  </div>
                </div>
                <div className="recommendation-card">
                  <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Reading Buddy" />
                  <div className="recommendation-content">
                    <h3>Reading Buddy</h3>
                    <p>Read with children to improve their literacy skills.</p>
                    <Link to="/opportunities/2" className="view-details-btn">View Details</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="profile-activities">
            <h2>Your Activities</h2>
            {activities.length > 0 ? (
              <div className="activities-list full-list">
                {activities.map(activity => (
                  <div className="activity-item" key={activity.id}>
                    <div className="activity-type">
                      <span className={`activity-badge ${activity.type}`}>
                        {activity.type === 'event' ? 'Event' : 'Opportunity'}
                      </span>
                    </div>
                    <div className="activity-details">
                      <h3>{activity.title}</h3>
                      <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                    <div className="activity-status">
                      <span className={`status-badge ${activity.status.toLowerCase()}`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-activities">
                <p>You haven't participated in any activities yet.</p>
                <div className="activity-links">
                  <Link to="/events" className="activity-link">Browse Events</Link>
                  <Link to="/opportunities" className="activity-link">Find Opportunities</Link>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="profile-settings">
            <h2>Account Settings</h2>
            <div className="settings-form">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" defaultValue={user.firstName} />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" defaultValue={user.lastName} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue={user.email} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <button className="save-settings-btn">Save Changes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;