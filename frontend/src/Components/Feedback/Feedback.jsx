import React from 'react';
import './Feedback.scss';

const Feedback = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Community Volunteer",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      quote: "Volunteering through VolunteerHub has been one of the most rewarding experiences of my life. I've met amazing people and made a real difference in my community.",
      project: "Food Bank Distribution"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Environmental Activist",
      image: "https://randomuser.me/api/portraits/men/54.jpg",
      quote: "The platform made it incredibly easy to find environmental projects that aligned with my values. I've been able to contribute to multiple beach cleanups and tree planting events.",
      project: "Coastal Cleanup Initiative"
    },
    {
      id: 3,
      name: "Aisha Patel",
      role: "Education Volunteer",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      quote: "As a teacher, I wanted to extend my impact beyond the classroom. VolunteerHub connected me with students who needed tutoring, and the results have been incredible.",
      project: "After-School Tutoring"
    }
  ];

  return (
    <section className="feedback-section">
      <div className="feedback-container">
        <h2 className="feedback-title">Volunteer <span className="highlight">Stories</span></h2>
        <p className="feedback-subtitle">Hear from people making a difference in their communities</p>
        
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div className="testimonial-card" key={testimonial.id}>
              <div className="testimonial-header">
                <div className="volunteer-image">
                  <img src={testimonial.image} alt={testimonial.name} />
                </div>
                <div className="volunteer-info">
                  <h3 className="volunteer-name">{testimonial.name}</h3>
                  <p className="volunteer-role">{testimonial.role}</p>
                  <div className="project-badge">{testimonial.project}</div>
                </div>
              </div>
              <blockquote className="testimonial-quote">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>
        
        <div className="feedback-cta">
          <h3>Ready to share your own volunteer story?</h3>
          <button className="share-story-btn">Share Your Experience</button>
        </div>
      </div>
    </section>
  );
};

export default Feedback;