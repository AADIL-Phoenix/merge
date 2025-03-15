// components/GroupDetailsPanel.js
import React, { useState } from 'react';
import { X, Edit2, Users, Calendar, Settings, LogOut, Trash2, Save } from 'lucide-react';

const GroupDetailsPanel = ({ group, onClose, onLeave, onDelete, onUpdate, type = "group" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description);
  const [image, setImage] = useState(group.image);
  
  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle saving the edited data
  const handleSave = () => {
    onUpdate({
      ...group,
      name,
      description,
      image
    });
    setIsEditing(false);
  };
  
  // Check if the current user is an admin
  const isAdmin = group.members.find(m => m.name === "You")?.role === "admin";
  
  return (
    <div className="details-panel">
      {/* HEADER */}
      <div className="details-header">
        <h2>{type === "community" ? "Community" : "Group"} Details</h2>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      
      {/* CONTENT */}
      <div className="details-content">
        {isEditing ? (
          <div className="edit-form">
            {/* Name */}
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            
            {/* Image */}
            <div className="form-group">
              <label>Image</label>
              <div className="image-upload">
                {image ? (
                  <div className="preview-container">
                    <img src={image} alt="Preview" className="image-preview" />
                    <button 
                      type="button" 
                      className="remove-image"
                      onClick={() => setImage(null)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <input 
                      type="file" 
                      id="group-image" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="file-input"
                    />
                    <label htmlFor="group-image" className="upload-label">
                      Choose Image
                    </label>
                  </div>
                )}
              </div>
            </div>
            
            {/* Edit Actions */}
            <div className="edit-actions">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setIsEditing(false);
                  setName(group.name);
                  setDescription(group.description);
                  setImage(group.image);
                }}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={handleSave}
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="view-details">
            {/* Group Image */}
            {image && (
              <div className="group-image">
                <img src={image} alt="Group" />
              </div>
            )}

            {/* Group Name */}
            <h3 className="group-name">{name}</h3>
            
            {/* Group Description */}
            <p className="group-description">{description || 'No description available.'}</p>

            {/* Group Info */}
            <div className="group-info">
              <div className="info-item">
                <Users size={16} />
                <span>{group.members.length} members</span>
              </div>
              <div className="info-item">
                <Calendar size={16} />
                <span>Created on {new Date(group.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="actions">
              {isAdmin && (
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 size={16} />
                  Edit
                </button>
              )}
              {isAdmin && (
                <button 
                  className="delete-btn"
                  onClick={() => onDelete(group.id)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
              {!isAdmin && (
                <button 
                  className="leave-btn"
                  onClick={() => onLeave(group.id)}
                >
                  <LogOut size={16} />
                  Leave
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetailsPanel;
