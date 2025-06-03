import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventApi } from '../../api/eventApi';
import './Forms.scss';

// Composant pour créer ou modifier un événement
const EventForm = () => {
  const navigate = useNavigate();
  // État pour stocker les données du formulaire
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    organizer: '',
    description: '',
    contactEmail: '',
    image: '',
    hours: 2 // Valeur par défaut
  });
  // États pour gérer les erreurs, le chargement et le succès
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Gère les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Gère les changements dans le champ de fichier (image)
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

  // Gère la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation des données du formulaire
      if (!formData.title.trim()) {
        throw new Error('Le titre de l\'événement est requis');
      }
      
      if (!formData.date) {
        throw new Error('La date de l\'événement est requise');
      }
      
      if (!formData.startTime || !formData.endTime) {
        throw new Error('Les heures de début et de fin sont requises');
      }
      
      if (!formData.location.trim()) {
        throw new Error('Le lieu de l\'événement est requis');
      }
      
      if (!formData.organizer.trim()) {
        throw new Error('L\'organisateur de l\'événement est requis');
      }
      
      if (!formData.description.trim()) {
        throw new Error('La description de l\'événement est requise');
      }
      
      if (!formData.contactEmail.trim()) {
        throw new Error('L\'email de contact est requis');
      }
      
      // Formater la date pour l'API
      const formattedData = {
        ...formData,
        // Convertir la date en format ISO
        date: new Date(formData.date).toISOString()
      };
      
      console.log('Données à envoyer:', formattedData);
      
      // Créer l'événement en utilisant l'API dédiée
      const response = await eventApi.createEvent(formattedData);
      
      console.log('Événement créé avec succès:', response);
      setSuccess(true);
      
      // Rediriger vers la page des événements après 2 secondes
      setTimeout(() => {
        navigate('/events');
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de la création de l\'événement:', err);
      
      // Afficher un message d'erreur détaillé
      if (err.response?.data?.message) {
        setError(`Erreur: ${err.response.data.message}`);
      } else if (err.message) {
        setError(`Erreur: ${err.message}`);
      } else {
        setError('Erreur lors de la création de l\'événement. Veuillez vérifier tous les champs et réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Obtenir la date d'aujourd'hui au format YYYY-MM-DD pour l'attribut min
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Créer un événement de bénévolat</h2>
          <p>Partagez un nouvel événement avec notre communauté de bénévoles</p>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">Événement créé avec succès! Redirection vers la page des événements...</div>}

        <form className="custom-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Titre de l'événement*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Entrez le titre de l'événement"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date de l'événement*</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={today}
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
                placeholder="Entrez le lieu de l'événement"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Heure de début*</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">Heure de fin*</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="organizer">Organisateur*</label>
            <input
              type="text"
              id="organizer"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              required
              placeholder="Entrez le nom de l'organisateur"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Décrivez l'événement"
              rows="4"
            ></textarea>
          </div>

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
            <label htmlFor="hours">Heures de bénévolat*</label>
            <input
              type="number"
              id="hours"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              required
              min="1"
              max="24"
              placeholder="Entrez le nombre d'heures"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image de l'événement</label>
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
            {loading ? 'Création en cours...' : 'Créer l\'événement'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;