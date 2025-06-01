import React, { useState, useEffect } from 'react';
import { testimonialsApi } from '../../api/api';
import './RandomFeedback.scss';

const RandomFeedback = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomTestimonials = async () => {
      try {
        const data = await testimonialsApi.getRandomTestimonials(4);
        setTestimonials(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load testimonials');
        setLoading(false);
      }
    };

    fetchRandomTestimonials();
  }, []);

  if (loading) return <div className="random-feedback-loading">Loading testimonials...</div>;
  if (error) return null;

  return (
    <div className="random-feedback-section">
      <div className="random-feedback-container">
        <h2 className="random-feedback-title">What Our Volunteers Say</h2>
        
        <div className="random-testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div className="random-testimonial-card" key={index}>
              <div className="random-testimonial-content">
                <div className="quote-icon">
                  <i className="fas fa-quote-left"></i>
                </div>
                <p className="random-testimonial-quote">{testimonial.quote}</p>
              </div>
              <div className="random-testimonial-author">
                <div className="random-volunteer-image">
                  <img 
                    src={testimonial.image.startsWith('http') 
                      ? testimonial.image 
                      : `http://localhost:5001${testimonial.image}`} 
                    alt={testimonial.name} 
                  />
                </div>
                <div className="random-volunteer-info">
                  <h4 className="random-volunteer-name">{testimonial.name}</h4>
                  <p className="random-volunteer-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RandomFeedback;