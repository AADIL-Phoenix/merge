import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './PersonalChat.css';

const PersonalChat = ({ user, onBack }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    // Dummy data - replace with actual messages from backend
    {
      id: 1,
      sender: 'other',
      text: 'Hey! Have you read the new fantasy book I recommended?',
      time: '10:30 AM'
    },
    {
      id: 2,
      sender: 'me',
      text: 'Not yet, but it\'s next on my list! I heard great reviews about it.',
      time: '10:32 AM'
    }
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
      sender: 'me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="personal-chat-container">
      <div className="chat-header">
        <button className="back-button" onClick={onBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="user-info">
          <div className="user-avatar">
            {user.name.charAt(0)}
          </div>
          <h3>{user.name}</h3>
        </div>
      </div>

      <div className="messages-container">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}
          >
            <div className="message-content">
              <p>{msg.text}</p>
              <span className="message-time">{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
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

export default PersonalChat;
