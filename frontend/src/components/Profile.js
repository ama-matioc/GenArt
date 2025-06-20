import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/FirebaseHandler';
import Navbar from './Navbar'
import { fetchUserImages, fetchUserProfile } from '../firebase/FirebaseStorage';


const Profile = () => {
  const [username, setUsername] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userStats, setUserStats] = useState({
    totalImages: 0,
    joinDate: ''
  });
  const userId = auth.currentUser?.uid;

  useEffect(() => {

    // Fetch user's profile info
    const fetchUserData = async () => {
      try {
        const res = await fetchUserProfile();
        const { username, joinDate } = res.data;
        setUsername(username);
        setUserStats(prev => ({ ...prev, joinDate }));
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    // fetch user's generated images
    const fetchUserImagesList = async () => {
      try {
        const response = await fetchUserImages();
        const fetchedImages = response.data;
        setImages(fetchedImages);
        setUserStats(prev => ({
          ...prev,
          totalImages: fetchedImages.length
        }));
      } catch (error) {
        console.error('Error fetching images:', error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchUserImagesList();
  }, [userId]);

  // modal handlers
  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <Navbar />
      <div className="profile-page">
        {/* profile info */}
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {username.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">@{username}</h1>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">{userStats.totalImages}</span>
                  <span className="stat-label">Creations</span>
                </div>
                {/*
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">Member</span>
                  <span className="stat-label">Since {userStats.joinDate}</span>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* user's image gallery */}
        <div className="profile-container">
          <div className="profile-section-header">
            <h1>Your AI Art Gallery</h1>
          </div>
          <div className="feed-container">
          {loading ? (
            <div className="profile-loading">
              <div className="loading-spinner"></div>
              <p>Loading your masterpieces...</p>
            </div>
          ) : (
            <>
              {images.length > 0 ? (
                <div className="feed-grid">
                {images.map((image) => (
                  <div 
                    key={image.id} 
                    className="feed-item"
                    onClick={() => openImageModal(image)}
                  >
                      <img src={image.imageUrl} alt={image.prompt} />
                  </div>
                ))}
                </div>
              ) : (
                <div className="no-images-enhanced">
                  <h3>No Images Yet</h3>
                  <p>Start your AI art journey by creating your first masterpiece!</p>
                  <a href="/generate" className="create-first-button">
                    Start Creating
                  </a>
                </div>
              )}
            </>
          )}
          </div>
        </div>

        {/* selected image modal */}
        {selectedImage && (
          <div className="modal-backdrop" onClick={closeImageModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeImageModal}>
                &times;
              </button>
              <div className="modal-image">
                <img src={selectedImage.imageUrl} alt={selectedImage.prompt} />
              </div>
                <div className="modal-info">
                  <h2>Details</h2>
                  <p><strong>Prompt:</strong> {selectedImage.prompt}</p>
                  <p><strong>Posted on:</strong> {new Date(selectedImage.timestamp).toLocaleDateString()}</p>
                </div>


              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Profile;