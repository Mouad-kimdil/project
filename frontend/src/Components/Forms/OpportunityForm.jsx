import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import './Forms.scss';

const OpportunityForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    location: '',
    category: '',
    commitment: '',
    description: '',
    requirements: '',
    skills: '',
    contactEmail: '',
    contactPhone: '',
    image: null,
    hours: 3 // Default hours
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = [
    'Environment',
    'Education',
    'Social Services',
    'Healthcare',
    'Animal Welfare',
    'Community Development',
    'Arts & Culture',
    'Crisis Response',
    'Youth Services',
    'Senior Support'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Process skills
      const processedData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim())
      };
      
      // Add the opportunity using authApi
      const opportunity = authApi.addOpportunity(processedData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      setError('Failed to create opportunity. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Create Volunteer Opportunity</h2>
          <p>Share a new opportunity with our volunteer community</p>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">Opportunity created successfully! Redirecting to your profile...</div>}

        <form className="custom-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Opportunity Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter the opportunity title"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="organization">Organization*</label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                required
                placeholder="Enter organization name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location*</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Enter location"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category*</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="commitment">Time Commitment*</label>
              <input
                type="text"
                id="commitment"
                name="commitment"
                value={formData.commitment}
                onChange={handleChange}
                required
                placeholder="e.g., Weekly, 3-4 hours"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the volunteer opportunity"
              rows="4"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="requirements">Requirements</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Any specific requirements for volunteers"
              rows="2"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="skills">Skills Needed (comma-separated)</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., Communication, Teamwork, First Aid"
            />
          </div>

          <div className="form-group">
            <label htmlFor="hours">Volunteer Hours per Session*</label>
            <input
              type="number"
              id="hours"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              required
              min="1"
              max="24"
              placeholder="Enter volunteer hours per session"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactEmail">Contact Email*</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                placeholder="Enter contact email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactPhone">Contact Phone</label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="Enter contact phone"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Opportunity Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
            />
            <small>Recommended size: 800x500 pixels</small>
          </div>

          <button 
            type="submit" 
            className="form-button"
            disabled={loading}
          >
            {loading ? 'Creating Opportunity...' : 'Create Opportunity'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OpportunityForm;