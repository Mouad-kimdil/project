import React from 'react';
import './Home.css';
import Hero from '../Hero/Hero';
import Feedback from '../Feedback/Feedback';
import RandomFeedback from '../Feedback/RandomFeedback';

export default function HomePage() {
  return (
    <div className="container">
      <Hero />
      <RandomFeedback />
      <Feedback />
    </div>
  );
}