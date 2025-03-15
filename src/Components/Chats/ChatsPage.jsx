import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faComments, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';
import PersonalChat from './PersonalChat';
import GroupChat from './GroupChat';
import './ChatsPage.css';

const ChatsPage = () => {
  const { chatId, groupId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(groupId ? 'group' : 'personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const [personalChats] = useState([
    // Dummy data - replace with actual data from backend
    { id: 1, name: 'John Doe', lastMessage: 'Hey, have you read...', time: '10:30 AM' },
    { id: 2, name: 'Jane Smith', lastMessage: 'The book club meeting...', time: '9:15 AM' }
  ]);

  const [groupChats] = useState([
    // Dummy data - replace with actual data from backend
    { id: 1, name: 'Fantasy Book Club', lastMessage: 'Next book discussion...', time: '11:00 AM' },
    { id: 2, name: 'Mystery Readers', lastMessage: 'Any recommendations?', time: 'Yesterday' }
  ]);

  return (
    <div className="chats-container">
      <div className="chats-header">
        <div className="chat-tabs">
          <button
            className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <FontAwesomeIcon icon={faComments} /> Personal
          </button>
          <button
            className={`tab-button ${activeTab === 'group' ? 'active' : ''}`}
            onClick={() => setActiveTab('group')}
          >
            <FontAwesomeIcon icon={faUsers} /> Groups
          </button>
        </div>
        
        <div className="chat-actions">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'personal' ? 'users' : 'groups'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {activeTab === 'group' && (
            <button 
              className="create-group-btn"
              onClick={() => setShowCreateGroup(true)}
            >
              <FontAwesomeIcon icon={faPlus} /> New Group
            </button>
          )}
        </div>
      </div>

      {chatId || groupId ? (
        groupId ? (
          <GroupChat 
            group={groupChats.find(g => g.id.toString() === groupId) || {}}
            onBack={() => navigate('/chats')}
          />
        ) : (
          <PersonalChat 
            user={personalChats.find(c => c.id.toString() === chatId) || {}}
            onBack={() => navigate('/chats')}
          />
        )
      ) : (
        <div className="chats-list">
          {activeTab === 'personal' ? (
            personalChats.map(chat => (
              <div 
                key={chat.id} 
                className="chat-item"
                onClick={() => navigate(`/chats/${chat.id}`)}
              >
                <div className="chat-avatar">
                  {chat.name.charAt(0)}
                </div>
                <div className="chat-info">
                  <h3>{chat.name}</h3>
                  <p>{chat.lastMessage}</p>
                </div>
                <div className="chat-time">
                  {chat.time}
                </div>
              </div>
            ))
          ) : (
            groupChats.map(group => (
              <div 
                key={group.id} 
                className="chat-item"
                onClick={() => navigate(`/chats/group/${group.id}`)}
              >
                <div className="chat-avatar group">
                  {group.name.charAt(0)}
                </div>
                <div className="chat-info">
                  <h3>{group.name}</h3>
                  <p>{group.lastMessage}</p>
                </div>
                <div className="chat-time">
                  {group.time}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showCreateGroup && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Group</h2>
            <input type="text" placeholder="Group Name" />
            <textarea placeholder="Group Description (optional)" />
            <div className="modal-actions">
              <button onClick={() => setShowCreateGroup(false)}>Cancel</button>
              <button className="create-btn">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatsPage;
