// pages/CommunityPage.js
import React, { useState, useRef } from 'react';
import { Search, Plus, Users, MessageSquare, Hash, Bell, User, Settings, ChevronRight, Send, Image, Smile, Paperclip, BarChart2, Reply, X, Upload, Info, Calendar } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import './styles/Community.css';

import ChatHeader from '../components/ChatHeader';
import PollCreator from '../components/PollCreator';
import PollMessage from '../components/PollMessage';
import GroupDetailsPanel from '../components/GroupDetailsPanel';
// import CreateGroupModal from '../components/CreateGroupModal';

const CommunityPage = () => {
  // State variables
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCommunityDetails, setShowCommunityDetails] = useState(false);
  const fileInputRef = useRef(null);
  
  // Add messages state
  const [communityMessages, setCommunityMessages] = useState({
    'Mystery Lovers Book Club': [
      { 
        id: 1, 
        text: 'Has anyone read "The Silent Patient"?', 
        sender: 'Mark Davies', 
        time: '10:30 AM',
        reactions: []
      }
    ],
    'Sci-Fi Enthusiasts': [
      { 
        id: 1, 
        text: 'The next meeting is on Friday!', 
        sender: 'Admin', 
        time: 'Yesterday',
        reactions: []
      }
    ],
    'Fantasy Worlds Fanclub': [
      { 
        id: 1, 
        text: 'Welcome to our community! We discuss all things fantasy literature.', 
        sender: 'Emma Wilson', 
        time: '3 days ago',
        reactions: []
      }
    ],
    'Literary Classics Society': [
      { 
        id: 1, 
        text: 'Our next discussion will be on Jane Austen\'s works.', 
        sender: 'James Peterson', 
        time: 'Last week',
        reactions: []
      }
    ]
  });

  // Add communities state
  const [communities, setCommunities] = useState([
    {
      id: 1,
      name: "Mystery Lovers Book Club",
      description: "A community for mystery book enthusiasts",
      members: [
        { id: 1, name: "Mark Davies", role: "admin" },
        { id: 3, name: "You", role: "member", active: true },
      ],
      image: null
    },
    {
      id: 2,
      name: "Sci-Fi Enthusiasts",
      description: "Discussing science fiction books, movies and TV shows",
      members: [
        { id: 1, name: "Lisa Chen", role: "admin" },
        { id: 2, name: "You", role: "member", active: true },
      ],
      image: null
    },
    {
      id: 3,
      name: "Fantasy Worlds Fanclub",
      description: "For fans of fantasy literature and worldbuilding",
      members: [
        { id: 1, name: "Emma Wilson", role: "admin" },
        { id: 2, name: "You", role: "member", active: true },
      ],
      image: null
    },
    {
      id: 4,
      name: "Literary Classics Society",
      description: "Appreciating and analyzing the great classics",
      members: [
        { id: 1, name: "James Peterson", role: "admin" },
        { id: 2, name: "You", role: "member", active: true },
      ],
      image: null
    }
  ]);

  // Add the handleUpdateCommunity function
  const handleUpdateCommunity = (updatedCommunity) => {
    setCommunities(prev => prev.map(c => c.id === updatedCommunity.id ? updatedCommunity : c));
  };

  // Handle community selection
  const handleCommunityClick = (communityName) => {
    setSelectedCommunity(communityName);
    setShowEmojiPicker(false);
  };

  // Handle message send
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() && !replyingTo) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'You',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
      replyTo: replyingTo
    };

    setCommunityMessages(prev => ({
      ...prev,
      [selectedCommunity]: [...(prev[selectedCommunity] || []), newMessage]
    }));

    setMessage('');
    setReplyingTo(null);
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji.native);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newMessage = {
          id: Date.now(),
          type: 'image',
          url: e.target.result,
          sender: 'You',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactions: []
        };
        setCommunityMessages(prev => ({
          ...prev,
          [selectedCommunity]: [...(prev[selectedCommunity] || []), newMessage]
        }));
      };
      reader.readAsDataURL(file);
    } else {
      const newMessage = {
        id: Date.now(),
        type: 'file',
        fileName: file.name,
        fileSize: file.size,
        sender: 'You',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: []
      };
      setCommunityMessages(prev => ({
        ...prev,
        [selectedCommunity]: [...(prev[selectedCommunity] || []), newMessage]
      }));
    }
  };

  const handleReaction = (messageId, emoji) => {
    setCommunityMessages(prev => ({
      ...prev,
      [selectedCommunity]: prev[selectedCommunity].map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find(r => r.emoji === emoji);
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.filter(r => r.emoji !== emoji)
            };
          }
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, user: 'You' }]
          };
        }
        return msg;
      })
    }));
  };

  const handleCreatePoll = (question, options) => {
    const newPoll = {
      id: Date.now(),
      type: 'poll',
      question,
      options: options.map(opt => ({ text: opt, votes: [] })),
      sender: 'You',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: []
    };

    setCommunityMessages(prev => ({
      ...prev,
      [selectedCommunity]: [...(prev[selectedCommunity] || []), newPoll]
    }));
    setShowPollModal(false);
  };

  const handleVote = (messageId, optionIndex) => {
    setCommunityMessages(prev => ({
      ...prev,
      [selectedCommunity]: prev[selectedCommunity].map(msg => {
        if (msg.id === messageId && msg.type === 'poll') {
          const updatedOptions = [...msg.options];
          // Remove vote from other options
          updatedOptions.forEach(opt => {
            opt.votes = opt.votes.filter(voter => voter !== 'You');
          });
          // Add vote to selected option
          updatedOptions[optionIndex].votes.push('You');
          return { ...msg, options: updatedOptions };
        }
        return msg;
      })
    }));
  };

  const handleLeaveCommunity = (communityId) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === communityId) {
        return {
          ...c,
          members: c.members.map(m => 
            m.name === "You" ? { ...m, active: false } : m
          )
        };
      }
      return c;
    }));
  };

  const handleDeleteCommunity = (communityId) => {
    setCommunities(prev => prev.filter(c => c.id !== communityId));
    setSelectedCommunity(null);
  };

  // Get current community
  const getCurrentCommunity = () => {
    return communities.find(c => c.name === selectedCommunity);
  };

  const handleCreateCommunity = (newCommunity) => {
    const communityToAdd = {
      ...newCommunity,
      id: Date.now(),
      members: [
        { id: 1, name: "You", role: "admin", active: true },
      ]
    };
    
    setCommunities(prev => [...prev, communityToAdd]);
    
    // Add empty messages array for this community
    setCommunityMessages(prev => ({
      ...prev,
      [newCommunity.name]: []
    }));
  };

  return (
    <div className="community-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Communities</h2>
          <button 
            className="new-community-btn"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={20} />
          </button>
        </div>
        
        <div className="search-box">
          <Search size={16} />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search communities..." 
          />
        </div>

        <div className="list-container">
          {communities.map((community) => (
            <div 
              key={community.id} 
              className={`list-item ${selectedCommunity === community.name ? 'active' : ''}`}
              onClick={() => handleCommunityClick(community.name)}
            >
              <div className="list-item-avatar">
                {community.image ? (
                  <img src={community.image} alt={community.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {community.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="list-item-info">
                <div className="list-item-name">{community.name}</div>
                <div className="list-item-members">
                  {community.members.length} members
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-area">
        {!selectedCommunity ? (
          <div className="welcome-screen">
            <h1>Book Club Communities</h1>
            <p>Join discussions with like-minded readers</p>
            <div className="community-showcase">
              <h2>Popular Communities</h2>
              <div className="community-grid">
                {communities.slice(0, 2).map(community => (
                  <div key={community.id} className="community-card" onClick={() => handleCommunityClick(community.name)}>
                    <div className="community-avatar">
                      {community.name.charAt(0)}
                    </div>
                    <h3>{community.name}</h3>
                    <p>{community.description}</p>
                    <div className="member-count">
                      <Users size={16} />
                      <span>{community.members.length} members</span>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className="discover-btn"
                onClick={() => setShowCreateModal(true)}
              >
                Create a Community
              </button>
            </div>
          </div>
        ) : (
          <>
            <ChatHeader 
              selectedChat={selectedCommunity}
              onShowDetails={() => setShowCommunityDetails(true)}
              group={getCurrentCommunity()}
            />
            <div className="messages-container">
              {communityMessages[selectedCommunity]?.map((msg) => (
                <div key={msg.id} className={`message ${msg.sender === 'You' ? 'sent' : 'received'}`}>
                  {msg.replyTo && (
                    <div className="reply-to">
                      <span className="reply-sender">{msg.replyTo.sender}</span>
                      <span className="reply-text">{msg.replyTo.text}</span>
                    </div>
                  )}

                  <div className="message-bubble">
                    {msg.type === 'image' && (
                      <img src={msg.url} alt="Shared" className="message-image" />
                    )}

                    {msg.type === 'file' && (
                      <div className="file-attachment">
                        <Paperclip size={16} />
                        <span className="file-name">{msg.fileName}</span>
                        <span className="file-size">
                          ({(msg.fileSize / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    )}

                    {msg.type === 'poll' && (
                      <PollMessage
                        poll={msg}
                        onVote={(optionIndex) => handleVote(msg.id, optionIndex)}
                      />
                    )}

                    {!msg.type && (
                      <div className="message-text">{msg.text}</div>
                    )}

                    <div className="message-meta">
                      <span className="message-sender">{msg.sender}</span>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  </div>

                  <div className="message-actions">
                    <button 
                      className="action-btn"
                      onClick={() => setReplyingTo(msg)}
                    >
                      <Reply size={16} />
                    </button>
                    <div className="reaction-btn">
                      <Smile size={16} />
                      <div className="reaction-popup">
                        {['👍', '❤️', '😂', '😲', '😢', '👏'].map(emoji => (
                          <button 
                            key={emoji} 
                            onClick={() => handleReaction(msg.id, emoji)}
                            className={`emoji-btn ${msg.reactions.some(r => r.emoji === emoji && r.user === 'You') ? 'active' : ''}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {msg.reactions.length > 0 && (
                    <div className="message-reactions">
                      {[...new Set(msg.reactions.map(r => r.emoji))].map(emoji => {
                        const count = msg.reactions.filter(r => r.emoji === emoji).length;
                        return (
                          <button 
                            key={emoji} 
                            className={`reaction-badge ${msg.reactions.some(r => r.emoji === emoji && r.user === 'You') ? 'active' : ''}`}
                            onClick={() => handleReaction(msg.id, emoji)}
                          >
                            {emoji} <span className="reaction-count">{count}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="message-input-container">
              {replyingTo && (
                <div className="replying-to">
                  <div className="reply-preview">
                    <span>Replying to {replyingTo.sender}</span>
                    <p>{replyingTo.text.substring(0, 50)}{replyingTo.text.length > 50 ? '...' : ''}</p>
                  </div>
                  <button 
                    className="cancel-reply-btn"
                    onClick={() => setReplyingTo(null)}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              
              <form className="message-form" onSubmit={handleSendMessage}>
                <div className="message-tools">
                  <button 
                    type="button" 
                    className="tool-btn"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Image size={20} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleFileUpload} 
                  />
                  <button 
                    type="button" 
                    className="tool-btn"
                    onClick={() => setShowPollModal(true)}
                  >
                    <BarChart2 size={20} />
                  </button>
                  <button 
                    type="button" 
                    className="tool-btn"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile size={20} />
                  </button>
                </div>

                {showEmojiPicker && (
                  <div className="emoji-picker-container">
                    <Picker 
                      data={data} 
                      onEmojiSelect={handleEmojiSelect}
                    />
                  </div>
                )}

                <input 
                  type="text" 
                  className="message-input" 
                  placeholder="Type your message..." 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                />
                <button type="submit" className="send-btn">
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      {showPollModal && (
        <PollCreator 
          onClose={() => setShowPollModal(false)}
          onCreatePoll={handleCreatePoll}
        />
      )}

      {/* {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateCommunity}
          type="community"
        />
      )} */}

      {showCommunityDetails && selectedCommunity && (
        <GroupDetailsPanel
          group={getCurrentCommunity()}
          onClose={() => setShowCommunityDetails(false)}
          onLeave={handleLeaveCommunity}
          onDelete={handleDeleteCommunity}
          onUpdate={handleUpdateCommunity}
          type="community"
        />
      )}
    </div>
  );
};

export default CommunityPage;