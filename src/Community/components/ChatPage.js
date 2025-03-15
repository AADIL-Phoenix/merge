// pages/ChatPage.js
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

const ChatPage = () => {
  // State variables
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const fileInputRef = useRef(null);
  
  // Add messages state
  const [chatMessages, setChatMessages] = useState({
    'Sarah Johnson': [
      { 
        id: 1, 
        text: 'Would you like to join our book club?', 
        sender: 'Sarah Johnson', 
        time: '9:15 AM',
        reactions: []
      }
    ],
    'Priya Sharma': [
      { 
        id: 1, 
        text: 'I really enjoyed that recommendation!', 
        sender: 'Priya Sharma', 
        time: 'Yesterday',
        reactions: []
      }
    ],
    'Book Club Reading Group': [
      { 
        id: 1, 
        text: 'Next meeting is scheduled for Thursday at 7PM.', 
        sender: 'Admin', 
        time: '10:30 AM',
        reactions: []
      }
    ]
  });

  // Add groups state
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "Book Club Reading Group",
      description: "Weekly book discussions and reading sessions",
      members: [
        { id: 1, name: "Sarah Johnson", role: "admin" },
        { id: 2, name: "You", role: "member", active: true },
      ],
      image: null
    },
    {
      id: 2,
      name: "Sarah Johnson",
      description: "Personal chat",
      members: [
        { id: 1, name: "Sarah Johnson", role: "member" },
        { id: 2, name: "You", role: "member", active: true },
      ],
      isPersonal: true,
      image: null
    },
    {
      id: 3,
      name: "Priya Sharma",
      description: "Personal chat",
      members: [
        { id: 1, name: "Priya Sharma", role: "member" },
        { id: 2, name: "You", role: "member", active: true },
      ],
      isPersonal: true,
      image: null
    }
  ]);

  // Add the handleUpdateGroup function
  const handleUpdateGroup = (updatedGroup) => {
    setGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
  };

  // Handle chat selection
  const handleChatClick = (chatName) => {
    setSelectedChat(chatName);
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

    setChatMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
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
        setChatMessages(prev => ({
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), newMessage]
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
      setChatMessages(prev => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), newMessage]
      }));
    }
  };

  const handleReaction = (messageId, emoji) => {
    setChatMessages(prev => ({
      ...prev,
      [selectedChat]: prev[selectedChat].map(msg => {
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

    setChatMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newPoll]
    }));
    setShowPollModal(false);
  };

  const handleVote = (messageId, optionIndex) => {
    setChatMessages(prev => ({
      ...prev,
      [selectedChat]: prev[selectedChat].map(msg => {
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

  const handleLeaveGroup = (groupId) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          members: g.members.map(m => 
            m.name === "You" ? { ...m, active: false } : m
          )
        };
      }
      return g;
    }));
  };

  const handleDeleteGroup = (groupId) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
    setSelectedChat(null);
  };

  // Get current group
  const getCurrentGroup = () => {
    return groups.find(g => g.name === selectedChat);
  };

  const handleCreateGroup = (newGroup) => {
    const groupToAdd = {
      ...newGroup,
      id: Date.now(),
      members: [
        { id: 1, name: "You", role: "admin", active: true },
      ]
    };
    
    setGroups(prev => [...prev, groupToAdd]);
    
    // Add empty messages array for this group
    setChatMessages(prev => ({
      ...prev,
      [newGroup.name]: []
    }));
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Chats</h2>
          <button 
            className="new-group-btn"
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
            placeholder="Search..." 
          />
        </div>

        <div className="list-container">
          {groups.map((group) => (
            <div 
              key={group.id} 
              className={`list-item ${selectedChat === group.name ? 'active' : ''}`}
              onClick={() => handleChatClick(group.name)}
            >
              <div className="list-item-avatar">
                {group.image ? (
                  <img src={group.image} alt={group.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {group.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="list-item-info">
                <div className="list-item-name">{group.name}</div>
                {!group.isPersonal && (
                  <div className="list-item-members">
                    {group.members.length} members
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-area">
        {!selectedChat ? (
          <div className="welcome-screen">
            <h1>Welcome to Book Club Chat</h1>
            <p>Select a chat to start messaging</p>
          </div>
        ) : (
          <>
            <ChatHeader 
              selectedChat={selectedChat}
              onShowDetails={() => setShowGroupDetails(true)}
              group={getCurrentGroup()}
            />
            <div className="messages-container">
              {chatMessages[selectedChat]?.map((msg) => (
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
                        onVote={handleVote}
                      />
                    )}

                    {msg.text && <div className="message-text">{msg.text}</div>}
                    <div className="message-info">
                      <span className="message-sender">{msg.sender}</span>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  </div>

                  <div className="message-actions">
                    <button 
                      className="action-button"
                      onClick={() => setReplyingTo(msg)}
                    >
                      <Reply size={16} />
                    </button>
                    <div className="reaction-buttons">
                      {['👍', '❤️', '😄', '😮', '😢', '👏'].map(emoji => (
                        <button
                          key={emoji}
                          className={`reaction-button ${msg.reactions.some(r => r.emoji === emoji) ? 'active' : ''}`}
                          onClick={() => handleReaction(msg.id, emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {msg.reactions.length > 0 && (
                    <div className="message-reactions">
                      {msg.reactions.map((reaction, index) => (
                        <span key={index} className="reaction">
                          {reaction.emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {replyingTo && (
              <div className="reply-container">
                <div className="reply-preview">
                  <span>Replying to {replyingTo.sender}</span>
                  <p>{replyingTo.text}</p>
                </div>
                <button 
                  className="cancel-reply"
                  onClick={() => setReplyingTo(null)}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {getCurrentGroup()?.members.find(m => m.name === "You")?.active ? (
              <form className="input-container" onSubmit={handleSendMessage}>
                <div className="input-actions">
                  <button 
                    type="button" 
                    className="action-button"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <button 
                    type="button" 
                    className="action-button"
                    onClick={() => setShowPollModal(true)}
                  >
                    <BarChart2 size={20} />
                  </button>
                  <button 
                    type="button" 
                    className="action-button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile size={20} />
                  </button>
                </div>
                
                <input
                  type="text"
                  className="message-input" 
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" className="send-button">
                  <Send size={20} />
                </button>
              </form>
            ) : (
              <div className="left-group-message">
                You can no longer send messages to this group
              </div>
            )}

            {showEmojiPicker && (
              <div className="emoji-picker-container">
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  theme="dark"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Group Details Panel */}
      {showGroupDetails && selectedChat && (
        <>
          <div className="panel-overlay" onClick={() => setShowGroupDetails(false)} />
          <div className="group-details-panel">
            <GroupDetailsPanel
              group={getCurrentGroup()}
              onClose={() => setShowGroupDetails(false)}
              onUpdateGroup={handleUpdateGroup}
              onLeaveGroup={handleLeaveGroup}
              onDeleteGroup={handleDeleteGroup}
            />
          </div>
        </>
      )}

      {showPollModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <PollCreator
              onSubmit={handleCreatePoll}
              onClose={() => setShowPollModal(false)}
            />
          </div>
        </div>
      )}

      {/* {showCreateModal && (
        <CreateGroupModal
          type="Group"
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateGroup}
        />
      )} */}
    </div>
  );
};

export default ChatPage;