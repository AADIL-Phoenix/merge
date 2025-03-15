import React from 'react';
import PropTypes from 'prop-types';

const ProfileHeader = ({
  name,
  profilePic,
  followers,
  following,
  isOwnProfile,
  onFollow,
  isFollowing
}) => {
  return (
    <div className="profile-header">
      <div className="profile-pic-container">
        <img 
          src={profilePic || "/default-avatar.png"} 
          alt={`${name}'s profile`}
          className="profile-pic"
        />
      </div>
      
      <div className="profile-info">
        <h2>{name}</h2>
        <div className="follow-stats">
          <div className="stat">
            <span className="count">{followers}</span>
            <span className="label">Followers</span>
          </div>
          <div className="stat">
            <span className="count">{following}</span>
            <span className="label">Following</span>
          </div>
        </div>
        
        {!isOwnProfile && (
          <button 
            className="follow-button" 
            onClick={onFollow}
          >
            {isFollowing ? 'Unfollow' : 'Follow +'}
          </button>
        )}
      </div>
    </div>
  );
};

ProfileHeader.propTypes = {
  name: PropTypes.string.isRequired,
  profilePic: PropTypes.string,
  followers: PropTypes.number.isRequired,
  following: PropTypes.number.isRequired,
  isOwnProfile: PropTypes.bool.isRequired,
  onFollow: PropTypes.func.isRequired,
  isFollowing: PropTypes.bool
};

export default ProfileHeader;
