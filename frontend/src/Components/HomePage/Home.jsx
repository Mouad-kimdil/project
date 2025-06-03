import React from 'react';
import './Home.css';
import Hero from '../Hero/Hero';
import Feedback from '../Feedback/Feedback';
import RandomFeedback from '../Feedback/RandomFeedback';

// Composant principal de la page d'accueil qui organise les différentes sections
export default function HomePage() {
  return (
    <div className="container">
      {/* Section héros principale */}
      <Hero />
      
      {/* Section de témoignages aléatoires */}
      <RandomFeedback />
      
      {/* Section de formulaire de témoignage */}
      <Feedback />
    </div>
  );
}