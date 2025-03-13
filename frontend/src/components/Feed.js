import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const Feed = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/images');
                setImages(response.data);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchImages();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="feed-container">
                <h1>Generated images</h1>
                <div className="feed-grid">
                    {images.map((image) => (
                        <div key={image.id} className="feed-item">
                            <img
                                src={image.image_url} // Use the URL directly
                                alt={image.prompt}
                            />
                            <p>{image.prompt}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Feed;