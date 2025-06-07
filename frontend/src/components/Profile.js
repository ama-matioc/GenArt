import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/FirebaseHandler';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Navbar from './Navbar'
import { fetchUserImages } from '../firebase/FirebaseStorage';

const db = getFirestore();

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
    const fetchUserData = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUsername(userData.username);
            // Set join date from user creation time
            const joinDate = user.metadata.creationTime 
              ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })
              : 'Recently';
            setUserStats(prev => ({
              ...prev,
              joinDate
            }));
          } else {
            setUsername('User');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUsername('User');
        }
      }
    };

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
        {/* Profile Header */}
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
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">Member</span>
                  <span className="stat-label">Since {userStats.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Images Gallery */}
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

        {/* Image Modal */}
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