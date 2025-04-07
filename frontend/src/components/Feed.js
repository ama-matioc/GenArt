import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { fetchAllImagesFromFirestore } from '../firebase/FirebaseStorage';
const Feed = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const fetchedImages = await fetchAllImagesFromFirestore();
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