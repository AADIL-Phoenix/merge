import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context';
import './styles/CreateProfile.css';

const CreateProfile = () => {
  const navigate = useNavigate();
  const { setUser } = useGlobalContext();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    website: '',
    favoriteGenres: [''],
    profilePhoto: null,
    photoPreview: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get user data from localStorage when component mounts
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData && (userData.id || userData._id)) {
        setUserId(userData.id || userData._id);
      } else {
        setError('User data not found. Please log in again.');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      setError('Error loading user data. Please log in again.');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePhoto: file,
        photoPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleGenreChange = (index, value) => {
    const newGenres = [...formData.favoriteGenres];
    newGenres[index] = value;
    setFormData(prev => ({
      ...prev,
      favoriteGenres: newGenres
    }));
  };

  const addGenreField = () => {
    setFormData(prev => ({
      ...prev,
      favoriteGenres: [...prev.favoriteGenres, '']
    }));
  };

  const removeGenreField = (index) => {
    setFormData(prev => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    if (!userId) {
      setError('User ID not found. Please log in again.');
      setIsSubmitting(false);
      return;
    }
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('user', userId);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('website', formData.website);
      formDataToSend.append('favoriteGenres', JSON.stringify(formData.favoriteGenres.filter(genre => genre.trim() !== '')));
  
      if (formData.profilePhoto) {
        formDataToSend.append('profilePhoto', formData.profilePhoto);
      }
  
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
  
      const response = await fetch('http://localhost:5001/api/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
  
      const responseData = await response.json(); // Parse the response
      console.log('Server Response:', responseData); // Log the response
  
      if (response.ok) {
        const profileData = responseData;
        setUser(profileData);
        navigate('/', { replace: true });
      } else {
        throw new Error(responseData.message || 'Failed to create profile');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      setError(error.message || 'An error occurred while creating your profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-profile-container">
      <h1 className="form-title">Create Your Profile</h1>
      <p className="form-subtitle">Help other readers get to know you better</p>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        {/* Profile photo section */}
        <div className="form-section">
          <h2 className="section-title">Profile Photo</h2>
          <div className="photo-upload-container">
            <div className="photo-preview">
              {formData.photoPreview ? (
                <img src={formData.photoPreview} alt="Profile preview" />
              ) : (
                <div className="photo-placeholder">
                  <span className="photo-icon">📷</span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden-input"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="upload-button">
              Choose Photo
            </label>
          </div>
        </div>

        {/* Basic information section */}
        <div className="form-section">
          <h2 className="section-title">Basic Information</h2>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        {/* Reading preferences section */}
        <div className="form-section">
          <h2 className="section-title">Reading Preferences</h2>
          <div className="form-group">
            <label>Favorite Genres</label>
            {formData.favoriteGenres.map((genre, index) => (
              <div key={index} className="list-input-row">
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => handleGenreChange(index, e.target.value)}
                  placeholder="Enter a genre"
                />
                {index > 0 && (
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeGenreField(index)}
                    aria-label="Remove genre"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="add-button"
              onClick={addGenreField}
            >
              + Add another genre
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting || !userId}
          >
            {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProfile;
