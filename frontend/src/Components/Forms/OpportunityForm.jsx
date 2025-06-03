import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { opportunityApi } from '../../api/opportunityApi';
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
    image: '',
    hours: 3 // Valeur par défaut
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = [
    'Environnement',
    'Éducation',
    'Services sociaux',
    'Santé',
    'Protection des animaux',
    'Développement communautaire',
    'Arts et culture',
    'Réponse aux crises',
    'Services à la jeunesse',
    'Soutien aux aînés'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Pour l'instant, on stocke juste l'URL de l'image
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setFormData({
        ...formData,
        image: imageUrl
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation des données du formulaire
      if (!formData.title.trim()) {
        throw new Error('Le titre de l\'opportunité est requis');
      }
      
      if (!formData.organization.trim()) {
        throw new Error('Le nom de l\'organisation est requis');
      }
      
      if (!formData.location.trim()) {
        throw new Error('Le lieu est requis');
      }
      
      if (!formData.category) {
        throw new Error('La catégorie est requise');
      }
      
      if (!formData.commitment.trim()) {
        throw new Error('L\'engagement de temps est requis');
      }
      
      if (!formData.description.trim()) {
        throw new Error('La description est requise');
      }
      
      if (!formData.contactEmail.trim()) {
        throw new Error('L\'email de contact est requis');
      }
      
      // Traiter les compétences
      const processedData = {
        ...formData,
        skills: formData.skills ? formData.skills.split(',').map(skill => skill.trim()) : []
      };
      
      console.log('Données à envoyer:', processedData);
      
      // Créer l'opportunité en utilisant l'API dédiée
      const response = await opportunityApi.createOpportunity(processedData);
      
      console.log('Opportunité créée avec succès:', response);
      setSuccess(true);
      
      // Rediriger vers la page des opportunités après 2 secondes
      setTimeout(() => {
        navigate('/opportunities');
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de la création de l\'opportunité:', err);
      
      // Afficher un message d'erreur détaillé
      if (err.response?.data?.message) {
        setError(`Erreur: ${err.response.data.message}`);
      } else if (err.message) {
        setError(`Erreur: ${err.message}`);
      } else {
        setError('Erreur lors de la création de l\'opportunité. Veuillez vérifier tous les champs et réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Créer une opportunité de bénévolat</h2>
          <p>Partagez une nouvelle opportunité avec notre communauté de bénévoles</p>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">Opportunité créée avec succès! Redirection vers la page des opportunités...</div>}

        <form className="custom-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Titre de l'opportunité*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Entrez le titre de l'opportunité"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="organization">Organisation*</label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                required
                placeholder="Entrez le nom de l'organisation"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Lieu*</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Entrez le lieu"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Catégorie*</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="commitment">Engagement de temps*</label>
              <input
                type="text"
                id="commitment"
                name="commitment"
                value={formData.commitment}
                onChange={handleChange}
                required
                placeholder="ex: Hebdomadaire, 3-4 heures"
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
              placeholder="Décrivez l'opportunité de bénévolat"
              rows="4"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="requirements">Prérequis</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Exigences spécifiques pour les bénévoles"
              rows="2"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="skills">Compétences requises (séparées par des virgules)</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="ex: Communication, Travail d'équipe, Premiers secours"
            />
          </div>

          <div className="form-group">
            <label htmlFor="hours">Heures de bénévolat par session*</label>
            <input
              type="number"
              id="hours"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              required
              min="1"
              max="24"
              placeholder="Entrez le nombre d'heures par session"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactEmail">Email de contact*</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                placeholder="Entrez l'email de contact"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactPhone">Téléphone de contact</label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="Entrez le téléphone de contact"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image de l'opportunité</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
            />
            <small>Taille recommandée: 800x500 pixels</small>
          </div>

          <button 
            type="submit" 
            className="form-button"
            disabled={loading}
          >
            {loading ? 'Création en cours...' : 'Créer l\'opportunité'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OpportunityForm;