import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './styles/UserProfile.css';

const SuggestedProfiles = ({ currentUserId, excludeIds = [] }) => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/users/${currentUserId}/suggested`);
        const filtered = response.data.filter(user => !excludeIds.includes(user._id));
        setSuggestedUsers(filtered);
        setError('');
      } catch (error) {
        setError('Failed to load suggestions');
        console.error('Error fetching suggested users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUserId) {
      fetchSuggestedUsers();
    }
  }, [currentUserId, excludeIds]);
  
  const totalPages = Math.ceil(suggestedUsers.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleUsers = suggestedUsers.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  if (loading) {
    return <div className="suggestions-loading">Loading suggestions...</div>;
  }

  if (error) {
    return <div className="suggestions-error">{error}</div>;
  }

  if (suggestedUsers.length === 0) {
    return <div className="no-suggestions">No suggestions available</div>;
  }
  
  return (
    <div className="suggested-profiles">
      <h3>Suggested Profiles</h3>
      <div className="profiles-carousel">
        {currentPage > 0 && (
          <button 
            onClick={prevPage}
            className="carousel-arrow prev"
            aria-label="Previous profiles"
          >
            <FaChevronLeft />
          </button>
        )}
        
        <div className="profiles-container">
          {visibleUsers.map(user => (
            <Link 
              to={`/profile/${user._id}`} 
              key={user._id}
              className="profile-box"
            >
              <div className="suggested-photo">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.name} />
                ) : (
                  <div className="photo-placeholder">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="suggested-name">{user.name}</div>
            </Link>
          ))}
        </div>

        {currentPage < totalPages - 1 && (
          <button 
            onClick={nextPage}
            className="carousel-arrow next"
            aria-label="Next profiles"
          >
            <FaChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

SuggestedProfiles.propTypes = {
  currentUserId: PropTypes.string.isRequired,
  excludeIds: PropTypes.arrayOf(PropTypes.string)
};

export default SuggestedProfiles;
