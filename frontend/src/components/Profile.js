import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/FirebaseHandler';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Navbar from './Navbar'
import { fetchUserImages } from '../firebase/FirebaseStorage';

const db=getFirestore();

const Profile = () => {

  const [username, setUsername] = useState('');
  const [images, setImages] = useState([]);
  const userId = auth.currentUser?.uid; 

  useEffect(() => {
    const fetchUsername = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUsername(userSnap.data().username);
        } else {
          setUsername('User');
        }
      }
    };

    const fetchUserImagesList = async () => {
          const response = await fetchUserImages();
          const fetchedImages = response.data;
          setImages(fetchedImages);
    };

    fetchUsername();
    fetchUserImagesList();
  }, [userId]);

  return (
    <div>
    <Navbar />
    <div className="feed-container">
        <h1>Hello @{username}!</h1>
        <h2>Your Generated Images</h2>
        <div className="feed-grid">
            {images.length > 0 ? (
                images.map((image) => (
                    <div key={image.id} className="feed-item">
                        <img src={image.imageUrl} alt={image.prompt} />
                        <p>{image.prompt}</p>
                    </div>
                ))
            ) : (
                <p>No images found.</p>
            )}
        </div>
    </div>
</div>
  )
}

export default Profile