import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import '../App.css';

const GeneratePage = () => {
    return (
        <div>
            <Navbar />
            <div className="generate-container">
                <h1>Start creating!</h1>
                <div className="generation-options">
                    <Link to="/txt2img" className="generation-option">
                        <div className="option-card">
                            <h2>Text to Image</h2>
                            <p>Bring your ideas to life by transforming text descriptions into unique visual creations</p>
                        </div>
                    </Link>
                    <Link to="/img2img" className="generation-option">
                        <div className="option-card">
                            <h2>Image to Image</h2>
                            <p>Reimagine existing images with creative transformations guided by your prompts</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default GeneratePage;