import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import './styles/UserProfile.css';

const SearchProfiles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      setSearching(true);
      setError('');
      const response = await axios.get(`/api/users/search?q=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      setError('Error searching profiles');
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !searching) {
      handleSearch();
    }
  };
  
  return (
    <div className="search-profiles">
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search profiles"
          disabled={searching}
        />
        <button 
          onClick={handleSearch}
          disabled={searching || !searchTerm.trim()}
          className="search-button"
        >
          <FaSearch />
        </button>
      </div>
      
      {searching && <div className="searching-message">Searching...</div>}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="search-results">
        {searchResults.map(user => (
          <Link 
            to={`/profile/${user._id}`} 
            key={user._id} 
            className="profile-result"
          >
            <div className="result-photo">
              <img 
                src={user.profilePhoto || "/default-avatar.png"} 
                alt={user.name} 
              />
            </div>
            <div className="user-info">
              <div className="name">{user.name}</div>
              <div className="genre">
                {user.readingPreferences?.genres?.[0] || 'No genre'}
              </div>
            </div>
          </Link>
        ))}

        {searchResults.length === 0 && searchTerm && !searching && (
          <div className="no-results">
            No profiles found
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchProfiles;
