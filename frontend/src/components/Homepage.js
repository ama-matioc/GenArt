import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import '../App.css';

const Homepage = () => {
  return (
    <div>
      <Navbar />
      
      <div className="homepage-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Transform Your Ideas into Art</h1>
            <p className="hero-subtitle">Create stunning images using AI-powered generation tools</p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Images Created</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Active Artists</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">AI Available</span>
              </div>
            </div>
            <div className="cta-buttons">
              <Link to="/generate" className="cta-button primary">Start Creating</Link>
              <Link to="/gallery" className="cta-button secondary">View Gallery</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div className="card-content">Text to Image</div>
            </div>
            <div className="floating-card card-2">
              <div className="card-content">Image to Image</div>
            </div>
            <div className="floating-card card-3">
              <div className="card-content">High Quality</div>
            </div>
          </div>
        </div>

        {/*Feature Section */}
        <div className="features-section">
          <h2 className="section-title">Powerful Creation Tools</h2>
          <div className="feature-grid">
            <div className="feature-card enhanced">
              <h3>Text to Image</h3>
              <p>Convert your text descriptions into vivid, high-quality images using advanced AI models</p>
              <div className="feature-highlight">
                <span>• Multiple art styles</span>
                <span>• Custom dimensions</span>
                <span>• Instant generation</span>
              </div>
            </div>
            
            <div className="feature-card enhanced">
              <h3>Image to Image</h3>
              <p>Transform existing images with creative prompts and artistic interpretations</p>
              <div className="feature-highlight">
                <span>• Style transfer</span>
                <span>• Creative edits</span>
                <span>• Preserve details</span>
              </div>
            </div>
            
            <div className="feature-card enhanced">
              <h3>Community Gallery</h3>
              <p>Explore creations from our vibrant community of digital artists and creators</p>
              <div className="feature-highlight">
                <span>• Daily featured art</span>
                <span>• Artist profiles</span>
                <span>• Inspiration feed</span>
              </div>
            </div>
          </div>
        </div>

        {/*How It Works Section */}
        <div className="how-it-works-section">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Choose Your Method</h4>
                <p>Select between text-to-image or image-to-image generation</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Craft Your Prompt</h4>
                <p>Describe your vision or upload your reference image</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Generate & Share</h4>
                <p>Watch AI create your masterpiece and share with the community</p>
              </div>
            </div>
          </div>
        </div>

        {/* Showcase Section */}
        <div className="showcase-section">
          <h2 className="section-title">Recent Creations</h2>
          <div className="showcase-grid">
            <div className="showcase-item">
              <div className="showcase-placeholder">
                <span className="placeholder-text">🌅 Landscape Art</span>
              </div>
              <p className="showcase-prompt">"Serene mountain landscape at sunset"</p>
            </div>
            <div className="showcase-item">
              <div className="showcase-placeholder">
                <span className="placeholder-text">🎭 Portrait Art</span>
              </div>
              <p className="showcase-prompt">"Cyberpunk character design"</p>
            </div>
            <div className="showcase-item">
              <div className="showcase-placeholder">
                <span className="placeholder-text">🏛️ Architecture</span>
              </div>
              <p className="showcase-prompt">"Futuristic city architecture"</p>
            </div>
            <div className="showcase-item">
              <div className="showcase-placeholder">
                <span className="placeholder-text">🦋 Nature Art</span>
              </div>
              <p className="showcase-prompt">"Magical forest creatures"</p>
            </div>
          </div>
          <div className="showcase-cta">
            <Link to="/gallery" className="cta-button secondary">View All Creations</Link>
          </div>
        </div>

        {/* Footer */}
        <div className="cta-section">
          <h2>Ready to Create Something Amazing?</h2>
          <p>Join thousands of artists already using our AI-powered tools</p>
          <Link to="/generate" className="cta-button primary large">Get Started Now</Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;