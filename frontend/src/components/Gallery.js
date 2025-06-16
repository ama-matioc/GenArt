import React, { useEffect, useState, useCallback } from 'react';
import Navbar from './Navbar';
import { fetchAllImages } from '../firebase/FirebaseStorage';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAllImages();
      let fetchedImages = response.data;
      
      // search
      if (searchQuery) {
        fetchedImages = fetchedImages.filter(img => 
          img.prompt.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // sort
      fetchedImages.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
      
      // pagination
      const startIndex = (page - 1) * limit;
      const paginatedImages = fetchedImages.slice(0, startIndex + limit);
      
      setImages(paginatedImages);
      setHasMore(fetchedImages.length > paginatedImages.length);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortOrder, page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const closeModal = () => setSelected(null);
  
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchImages();
  };
  
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };


  return (
    <div>
      <Navbar />
      <div className="feed-page">
        <h1>Community Gallery</h1>
        
        {/* search and sort controls */}
        <div className="gallery-controls">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
            
            <div className="sort-controls">
              <span>Sort by:</span>
              <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </form>
        </div>

        {/* loading spinner */}
        {loading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading images...</p>
          </div>
        )}
        
        {/* image feed*/}
        <div className="feed-container">
          {!loading && images.length === 0 ? (
            <div className="no-images">
              <p>No images found{searchQuery && ` for "${searchQuery}"`}</p>
            </div>
          ) : (
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
          )}
        </div>
        
        {/* load more button */}
        {!loading && hasMore && (
          <div className="load-more-container">
            <button onClick={handleLoadMore} className="load-more-button">
              Load More
            </button>
          </div>
        )}
        
        {/* image modal */}
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
                <p><strong>Posted on:</strong> {new Date(selected.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



export default Gallery;