import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Opportunities.scss';

const Opportunities = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Hardcoded opportunities that will always display
  const staticOpportunities = [
    {
      id: 'static-1',
      title: 'Homeless Shelter Assistant',
      organization: 'City Shelter',
      location: 'Downtown',
      category: 'Social Services',
      commitment: 'Weekly, 3-4 hours',
      description: 'Help prepare and serve meals at the local homeless shelter. Tasks include food preparation, serving meals, cleaning up, and interacting with shelter residents.',
      image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      isExample: true
    },
    {
      id: 'static-2',
      title: 'Reading Buddy',
      organization: 'Public Library',
      location: 'Various Locations',
      category: 'Education',
      commitment: 'Weekly, 2 hours',
      description: 'Read with children to improve their literacy skills. Volunteers will be paired with children ages 6-12 who need extra help with reading.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      isExample: true
    },
    {
      id: 'static-3',
      title: 'Wildlife Conservation Volunteer',
      organization: 'Nature Conservancy',
      location: 'National Park',
      category: 'Environment',
      commitment: 'Monthly, Full day',
      description: 'Help with habitat restoration and wildlife monitoring. Activities include planting native species, removing invasive plants, and tracking wildlife populations.',
      image: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      isExample: true
    },
    {
      id: 'static-4',
      title: 'Senior Companion',
      organization: 'Elder Care Alliance',
      location: 'City-wide',
      category: 'Senior Support',
      commitment: 'Weekly, 2-3 hours',
      description: 'Provide companionship to seniors who may be isolated or lonely. Activities include conversation, playing games, reading, or accompanying them on walks.',
      image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      isExample: true
    },
    {
      id: 'static-5',
      title: 'Community Garden Helper',
      organization: 'Urban Greening Project',
      location: 'Community Gardens',
      category: 'Environment',
      commitment: 'Weekly, 4 hours',
      description: 'Help maintain community gardens that provide fresh produce to local food banks and community members. Tasks include planting, weeding, watering, and harvesting.',
      image: 'https://images.unsplash.com/photo-1592150621744-aca64f48df1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      isExample: true
    },
    {
      id: 'static-6',
      title: 'Crisis Hotline Volunteer',
      organization: 'Mental Health Support Network',
      location: 'Remote',
      category: 'Crisis Response',
      commitment: 'Weekly, 4-6 hours',
      description: 'Provide support to individuals in crisis through our telephone hotline. Volunteers receive comprehensive training in crisis intervention, active listening, and mental health resources.',
      image: 'https://images.unsplash.com/photo-1590402494587-44b71d7772f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      isExample: true
    }
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="opportunities-page">
      <div className="opportunities-header">
        <h1>Volunteer <span className="highlight">Opportunities</span></h1>
        <p className="opportunities-subtitle">Find the perfect volunteer opportunity that matches your skills and interests</p>
        
        {isAuthenticated && (
          <div className="opportunities-tabs">
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => handleTabChange('all')}
            >
              All Opportunities
            </button>
            <button 
              className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
              onClick={() => handleTabChange('my')}
            >
              My Opportunities
            </button>
          </div>
        )}
        
        <div className="opportunities-actions">
          <Link to="/create-opportunity" className="create-opportunity-btn">
            <i className="fas fa-plus"></i> Create Opportunity
          </Link>
        </div>
      </div>

      <div className="opportunities-grid">
        {staticOpportunities.map(opportunity => (
          <div className="opportunity-card" key={opportunity.id}>
            <div className="opportunity-image-container">
              <img 
                src={opportunity.image} 
                alt={opportunity.title} 
                className="opportunity-image" 
              />
              <div className="opportunity-category">{opportunity.category}</div>
              {opportunity.isExample && (
                <div className="example-badge">Example</div>
              )}
            </div>
            <div className="opportunity-content">
              <h3 className="opportunity-title">{opportunity.title}</h3>
              <div className="opportunity-organization">
                <i className="fas fa-building"></i>
                <span>{opportunity.organization}</span>
              </div>
              <div className="opportunity-details">
                <div className="opportunity-location">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{opportunity.location}</span>
                </div>
                <div className="opportunity-commitment">
                  <i className="fas fa-clock"></i>
                  <span>{opportunity.commitment}</span>
                </div>
              </div>
              <p className="opportunity-description">{opportunity.description}</p>
              <Link to={`/opportunities/${opportunity.id}`} className="opportunity-link">
                View Details
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="create-your-own">
        <h3>Don't see what you're looking for?</h3>
        <p>Create your own volunteer opportunity and share it with the community</p>
        <Link to="/create-opportunity" className="create-opportunity-btn">
          Create Opportunity
        </Link>
      </div>
    </div>
  );
};

export default Opportunities;