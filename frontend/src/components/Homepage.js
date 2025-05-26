import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import '../App.css';

const Homepage = () => {
  return (
    <div>
<Navbar />

    <div className="homepage-container">
      <div className="hero-section">
        <h1 className="hero-title">Transform Your Ideas into Art</h1>
        <p className="hero-subtitle">Create stunning images using AI-powered generation tools</p>
        <Link to="/generate" className="cta-button">Start Creating</Link>
      </div>
      
      <div className="feature-grid">
        <div className="feature-card">
          <h3>Text to Image</h3>
          <p>Convert your text descriptions into vivid images</p>
        </div>
        <div className="feature-card">
          <h3>Image to Image</h3>
          <p>Transform existing images with creative prompts</p>
        </div>
        <div className="feature-card">
          <h3>Community Gallery</h3>
          <p>Explore creations from our vibrant community</p>
        </div>
      </div>
    </div>
        </div>
  );
};

export default Homepage;