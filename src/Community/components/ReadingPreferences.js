import React, { useState, useContext } from 'react';
import { useGlobalContext } from '../../context';
import PropTypes from 'prop-types';
import axios from 'axios';
import './styles/UserProfile.css';

const ReadingPreferences = ({ preferences = [], isOwnProfile, onGenreAdded }) => {
  const [newGenre, setNewGenre] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const { user: currentUser } = useGlobalContext();
  
  const handleAddGenre = async () => {
    if (!newGenre.trim()) return;
    setIsAdding(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!currentUser?._id) {
        throw new Error('User not found');
      }

      const response = await axios.post(`/api/users/${currentUser._id}/reading-preferences`, 
        { genre: newGenre.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (onGenreAdded) {
        onGenreAdded(response.data);
      }
      setNewGenre('');
    } catch (error) {
      setError('Failed to add genre');
      console.error('Error adding genre:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isAdding) {
      handleAddGenre();
    }
  };
  
  return (
    <div className="reading-preferences">
      <h3>Reading Preferences</h3>
      <div className="preferences-list">
        {preferences.map((genre, index) => (
          <span className="preference-item" key={index}>
            {genre}
          </span>
        ))}
      </div>
      
      {isOwnProfile && (
        <div className="add-preference">
          <input
            type="text"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add genre"
            disabled={isAdding}
          />
          <button 
            onClick={handleAddGenre} 
            className="add-button"
            disabled={isAdding || !newGenre.trim()}
          >
            {isAdding ? '...' : '+'}
          </button>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

ReadingPreferences.propTypes = {
  preferences: PropTypes.arrayOf(PropTypes.string),
  isOwnProfile: PropTypes.bool.isRequired,
  onGenreAdded: PropTypes.func
};

export default ReadingPreferences;
