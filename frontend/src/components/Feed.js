import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { fetchAllImages } from '../firebase/FirebaseStorage';
const Feed = () => {
    const [images, setImages] = useState([]);
    const [selected, setSelected] = useState(null);
    
    useEffect(() => {
        const fetchImages = async () => {
            const response = await fetchAllImages();    
            const fetchedImages = response.data;
            setImages(fetchedImages);
        };
        fetchImages();
    }, []);

    const closeModal = () => setSelected(null);
    return (
        <div>
        <Navbar />
        <div className="feed-container">
            <h1>Generated images</h1>
            <div className="feed-grid">
            {images.map(img => (
                <div
                key={img.id}
                className="feed-item"
                onClick={() => setSelected(img)}
                >
                <img src={img.imageUrl} alt={img.prompt} />
                <div className="username-overlay">
                    @{img.username}
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Modal */}
      {selected && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closeModal}>
              &times;
            </button>

            <div className="modal-image">
              <img src={selected.imageUrl} alt={selected.prompt} />
            </div>

            <div className="modal-info">
              <h2>Details</h2>
              <p><strong>Prompt:</strong> {selected.prompt}</p>
              <p><strong>By:</strong> @{selected.username}</p>
            </div>
          </div>
        </div>
      )}
        </div>
    );
    };

export default Feed;