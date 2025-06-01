import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './OpportunityDetail.scss';

const OpportunityDetail = () => {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the opportunity in our static data
    const staticOpportunities = getStaticOpportunities();
    const foundOpportunity = staticOpportunities.find(o => o.id === id) || staticOpportunities[0];
    
    // Add additional details for the detail view
    const enhancedOpportunity = {
      ...foundOpportunity,
      requirements: foundOpportunity.requirements || 'Must be 18+, Background check required',
      skills: foundOpportunity.skills || ['Communication', 'Teamwork', 'Empathy'],
      contactEmail: foundOpportunity.contactEmail || `volunteer@${foundOpportunity.organization.toLowerCase().replace(/\\s/g, '')}.org`,
      contactPhone: foundOpportunity.contactPhone || '(555) 123-4567',
      hours: foundOpportunity.hours || 3
    };
    
    setOpportunity(enhancedOpportunity);
    setLoading(false);
  }, [id]);

  if (loading) return <div className="loading">Loading opportunity details...</div>;
  if (!opportunity) return <div className="error">Opportunity not found</div>;

  return (
    <div className="opportunity-detail-page">
      <div className="opportunity-detail-header">
        <div className="opportunity-detail-image-container">
          <img 
            src={opportunity.image} 
            alt={opportunity.title} 
            className="opportunity-detail-image" 
          />
          <div className="opportunity-detail-category">{opportunity.category}</div>
          {opportunity.isExample && (
            <div className="example-badge">
              <i className="fas fa-lightbulb"></i> Example Opportunity
            </div>
          )}
        </div>
      </div>

      <div className="opportunity-detail-content">
        <div className="opportunity-detail-main">
          <h1 className="opportunity-detail-title">{opportunity.title}</h1>
          
          <div className="opportunity-detail-meta">
            <div className="meta-item">
              <i className="fas fa-building"></i>
              <span>{opportunity.organization}</span>
            </div>
            <div className="meta-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>{opportunity.location}</span>
            </div>
            <div className="meta-item">
              <i className="fas fa-clock"></i>
              <span>{opportunity.commitment}</span>
            </div>
          </div>

          <div className="opportunity-detail-section">
            <h2>Description</h2>
            <p>{opportunity.description}</p>
          </div>

          {opportunity.requirements && (
            <div className="opportunity-detail-section">
              <h2>Requirements</h2>
              <p>{opportunity.requirements}</p>
            </div>
          )}

          {opportunity.skills && opportunity.skills.length > 0 && (
            <div className="opportunity-detail-section">
              <h2>Skills Needed</h2>
              <div className="skills-list">
                {Array.isArray(opportunity.skills) ? (
                  opportunity.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))
                ) : (
                  typeof opportunity.skills === 'string' && 
                  opportunity.skills.split(',').map((skill, index) => (
                    <span key={index} className="skill-tag">{skill.trim()}</span>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="opportunity-detail-sidebar">
          <div className="sidebar-card">
            <h3>Contact Information</h3>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>{opportunity.contactEmail}</span>
              </div>
              {opportunity.contactPhone && (
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>{opportunity.contactPhone}</span>
                </div>
              )}
            </div>
            
            <a href={`mailto:${opportunity.contactEmail}`} className="contact-button">
              Contact Organization
            </a>
          </div>

          <div className="sidebar-card">
            <h3>Volunteer Hours</h3>
            <div className="hours-info">
              <div className="hours-icon">
                <i className="fas fa-hourglass-half"></i>
              </div>
              <div className="hours-details">
                <span className="hours-value">{opportunity.hours || 3} hours</span>
                <span className="hours-label">per session</span>
              </div>
            </div>
          </div>

          <div className="sidebar-actions">
            <Link to="/opportunities" className="back-button">
              <i className="fas fa-arrow-left"></i> Back to Opportunities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Static opportunities data
function getStaticOpportunities() {
  return [
    {
      id: 'static-1',
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
      hours: 3,
      isExample: true
    },
    {
      id: 'static-2',
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
      hours: 2,
      isExample: true
    },
    {
      id: 'static-3',
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
      hours: 8,
      isExample: true
    },
    {
      id: 'static-4',
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
      hours: 3,
      isExample: true
    },
    {
      id: 'static-5',
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
      hours: 4,
      isExample: true
    },
    {
      id: 'static-6',
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
      hours: 5,
      isExample: true
    }
  ];
}

export default OpportunityDetail;