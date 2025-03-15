import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useGlobalContext } from '../../context';
import './styles/EditProfileModal.css';

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const { user: currentUser } = useGlobalContext();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    photo: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        bio: user.bio || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData(prev => ({
        ...prev,
        photo: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!user?._id) {
        throw new Error('User ID not found');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Set up request configuration
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Create profile update data
      const profileData = {};
      if (formData.name !== user.name) profileData.name = formData.name;
      if (formData.bio !== user.bio) profileData.bio = formData.bio;

      let updatedUser = { ...user };

      // Update name and bio if changed
      if (Object.keys(profileData).length > 0) {
        try {
          console.log('Updating profile:', { userId: user._id, data: profileData });
          const updateResponse = await axios.patch(`/api/users/${user._id}`, profileData, config);
          console.log('Profile update response:', updateResponse.data);
          updatedUser = { ...updatedUser, ...updateResponse.data };
        } catch (err) {
          console.error('Error updating profile data:', err);
          throw new Error('Failed to update profile information');
        }
      }

      // Update photo if changed
      if (formData.photo) {
        try {
          const photoFormData = new FormData();
          photoFormData.append('photo', formData.photo);

          console.log('Updating photo for user:', user._id);
          const photoResponse = await axios.post(
            `/api/users/${user._id}/photo`,
            photoFormData,
            {
              headers: {
                ...config.headers,
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          console.log('Photo update response:', photoResponse.data);
          updatedUser = { ...updatedUser, ...photoResponse.data };
        } catch (err) {
          console.error('Error uploading photo:', err);
          throw new Error('Failed to upload profile photo');
        }
      }

      // Update with final user data
      onUpdate(updatedUser);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="photo">Profile Photo</label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose}
              className="cancel-button"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default EditProfileModal;
