// components/ChatHeader.js
import React from 'react';
import { Info, Users, Search, ArrowLeft } from 'lucide-react';

const ChatHeader = ({ selectedChat, onShowDetails, group, onBack }) => {
  return (
    <div className="chat-header">
      {onBack && (
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
      )}
      
      <div className="chat-info">
        <div className="chat-avatar">
          {group && group.image ? (
            <img src={group.image} alt={group.name} />
          ) : (
            <div className="avatar-placeholder">
              {selectedChat && selectedChat.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="chat-details">
          <h2 className="chat-name">{selectedChat}</h2>
          {group && (
            <div className="member-info">
              <Users size={14} />
              <span>{group.members.length} members</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="chat-actions">
        <button className="action-btn">
          <Search size={20} />
        </button>
        
        <button 
          className="action-btn"
          onClick={onShowDetails}
        >
          <Info size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;