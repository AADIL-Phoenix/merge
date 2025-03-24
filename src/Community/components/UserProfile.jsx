import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProfileHeader from './ProfileHeader';
import ReadingPreferences from './ReadingPreferences';
import SearchProfiles from './SearchProfiles';
import SuggestedProfiles from './SuggestedProfiles';
import { useGlobalContext } from '../../context';
import EditProfileModal from './EditProfileModal';
import './styles/UserProfile.css';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { userId } = useParams();
  const { user: currentUser, setUser } = useGlobalContext();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Use _id instead of id, and handle the case when viewing own profile
        const idToFetch = userId || currentUser?._id;
        
        if (!idToFetch) {
          throw new Error('No user ID available');
        }

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${idToFetch}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
        setIsOwnProfile(!userId || userId === currentUser?._id);
        setIsFollowing(response.data.followers.includes(currentUser?._id));
      } catch (error) {
        setError('Failed to load profile');
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [userId, currentUser]);

  // Update other uses of currentUser.id to currentUser._id
  const handleFollow = async () => {
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/${userData._id}/${endpoint}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUserData(prev => ({
        ...prev,
        followers: isFollowing 
          ? prev.followers.filter(id => id !== currentUser._id)
          : [...prev.followers, currentUser._id]
      }));
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };


  const handleProfileUpdate = useCallback((updatedData) => {
    // Immediately update the local state
    setUserData(prev => ({ ...prev, ...updatedData }));
    
    // Update the global user context if it's own profile
    if (isOwnProfile) {
      const updatedUser = { ...currentUser, ...updatedData };
      setUser(updatedUser);
      // Also update the user data in localStorage to persist changes
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, [isOwnProfile, setUser, currentUser]);

  const handleGenreAdded = (updatedPreferences) => {
    setUserData(prev => ({
      ...prev,
      readingPreferences: updatedPreferences
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="error-container">
        <p>Profile not found</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {isOwnProfile && (
        <button 
          className="edit-profile-button"
          onClick={() => setIsEditModalOpen(true)}
        >
          Edit Profile
        </button>
      )}

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={userData}
        onUpdate={handleProfileUpdate}
      />

      <ProfileHeader 
        name={userData.name}
        profilePic={userData.profilePhoto}
        followers={userData.followers?.length || 0}
        following={userData.following?.length || 0}
        isOwnProfile={isOwnProfile}
        onFollow={handleFollow}
        isFollowing={isFollowing}
      />

      <div className="bio-section">
        <h3>Bio</h3>
        <p>{userData.bio || "No bio available"}</p>
      </div>

      <ReadingPreferences 
        preferences={userData.readingPreferences?.genres || []}
        isOwnProfile={isOwnProfile}
        onGenreAdded={handleGenreAdded}
      />

      {isOwnProfile && <SearchProfiles />}

      <SuggestedProfiles 
        currentUserId={currentUser?._id}
        excludeIds={[userData._id]}
      />
    </div>
  );
};

export default UserProfile;
