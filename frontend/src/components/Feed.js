import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { fetchAllImages } from '../firebase/FirebaseStorage';
const Feed = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const response = await fetchAllImages();    
            const fetchedImages = response.data;
            setImages(fetchedImages);
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
                            <img src={image.imageUrl} alt={image.prompt} />
                            <p>{image.prompt}</p>
                            <small>By: @{image.username}</small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Feed;