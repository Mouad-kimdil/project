import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventsApi } from '../../api/api';
import './EventDetail.scss';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const data = await eventsApi.getEventById(id);
        setEvent(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load event details. Please try again later.');
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (loading) return <div className="loading">Loading event details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!event) return <div className="error">Event not found</div>;

  return (
    <div className="event-detail-page">
      <div className="event-detail-container">
        <div className="event-detail-header">
          <Link to="/events" className="back-link">
            <i className="fas fa-arrow-left"></i> Back to Events
          </Link>
          <h1>{event.title}</h1>
        </div>

        <div className="event-detail-content">
          <div className="event-detail-image-container">
            <img src={event.image} alt={event.title} className="event-detail-image" />
          </div>

          <div className="event-detail-info">
            <div className="event-info-card">
              <div className="event-info-item">
                <i className="fas fa-calendar"></i>
                <div>
                  <h4>Date</h4>
                  <p>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              <div className="event-info-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h4>Time</h4>
                  <p>{event.startTime} - {event.endTime}</p>
                </div>
              </div>

              <div className="event-info-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h4>Location</h4>
                  <p>{event.location}</p>
                </div>
              </div>

              <div className="event-info-item">
                <i className="fas fa-user"></i>
                <div>
                  <h4>Organizer</h4>
                  <p>{event.organizer}</p>
                </div>
              </div>

              <button className="register-button">
                Register for this Event
              </button>
            </div>

            <div className="event-description-section">
              <h2>About This Event</h2>
              <p>{event.description}</p>
            </div>

            <div className="event-contact-section">
              <h2>Contact Information</h2>
              <p>
                For questions about this event, please contact: <a href={`mailto:${event.contactEmail}`}>{event.contactEmail}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;