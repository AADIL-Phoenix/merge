import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faArrowLeft, faUsers, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import './GroupChat.css';

const GroupChat = ({ group, onBack }) => {
  const [message, setMessage] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const [messages, setMessages] = useState([
    // Dummy data - replace with actual messages from backend
    {
      id: 1,
      sender: { id: 2, name: 'Alice Johnson' },
      text: 'What did everyone think about the plot twist?',
      time: '10:30 AM'
    },
    {
      id: 2,
      sender: { id: 1, name: 'Current User' },
      text: 'I was completely surprised! Did not see that coming.',
      time: '10:32 AM'
    }
  ]);

  const [members] = useState([
    // Dummy data - replace with actual group members from backend
    { id: 1, name: 'Current User', role: 'admin' },
    { id: 2, name: 'Alice Johnson', role: 'member' },
    { id: 3, name: 'Bob Wilson', role: 'member' },
    { id: 4, name: 'Carol Smith', role: 'member' }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: { id: 1, name: 'Current User' },
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="group-chat-container">
      <div className="chat-header">
        <div className="header-left">
          <button className="back-button" onClick={onBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="group-info">
            <div className="group-avatar">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className="group-details">
              <h3>{group.name}</h3>
              <span>{members.length} members</span>
            </div>
          </div>
        </div>
        <button 
          className="members-button"
          onClick={() => setShowMembers(!showMembers)}
        >
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
      </div>

      <div className="chat-content">
        <div className="messages-container">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`message ${msg.sender.id === 1 ? 'sent' : 'received'}`}
            >
              {msg.sender.id !== 1 && (
                <div className="message-sender">{msg.sender.name}</div>
              )}
              <div className="message-content">
                <p>{msg.text}</p>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {showMembers && (
          <div className="members-sidebar">
            <h3>Group Members</h3>
            <div className="members-list">
              {members.map(member => (
                <div key={member.id} className="member-item">
                  <div className="member-avatar">
                    {member.name.charAt(0)}
                  </div>
                  <div className="member-info">
                    <span className="member-name">{member.name}</span>
                    <span className="member-role">{member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <form className="message-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" disabled={!message.trim()}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
};

export default GroupChat;
