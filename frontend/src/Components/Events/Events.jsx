import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsApi } from '../../api/api';
import './Events.scss';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchEvents = async (pageNum) => {
    try {
      setLoadingMore(true);
      const data = await eventsApi.getEvents(pageNum);
      
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setEvents(prevEvents => pageNum === 1 ? data : [...prevEvents, ...data]);
      }
      
      setLoading(false);
      setLoadingMore(false);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Upcoming <span className="highlight">Events</span></h1>
        <p className="events-subtitle">Join us at these upcoming volunteer events and make a difference in your community</p>
        <p className="api-info">Data provided by: Lorem Picsum API</p>
      </div>

      <div className="events-grid">
        {events.map(event => (
          <div className="event-card" key={event.id}>
            <div className="event-image-container">
              <img src={event.image} alt={event.title} className="event-image" />
              <div className="event-date">
                <span className="event-month">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                <span className="event-day">{new Date(event.date).getDate()}</span>
              </div>
            </div>
            <div className="event-content">
              <h3 className="event-title">{event.title}</h3>
              <div className="event-details">
                <div className="event-location">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{event.location}</span>
                </div>
              </div>
              <p className="event-description">{event.description}</p>
              <Link to={`/events/${event.id}`} className="event-link">
                Learn More
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="load-more-container">
          <button 
            className="load-more-button" 
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load More Events'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Events;