// components/PollMessage.js
import React from 'react';
import { BarChart2 } from 'lucide-react';

const PollMessage = ({ poll, onVote }) => {
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes.length, 0);
  
  // Calculate if the user has already voted
  const userVoted = poll.options.some(option => 
    option.votes.includes('You')
  );
  
  // Find which option the user voted for
  const userVotedOption = userVoted ? 
    poll.options.findIndex(option => option.votes.includes('You')) : -1;

  return (
    <div className="poll-message">
      <div className="poll-header">
        <BarChart2 size={18} />
        <h3 className="poll-question">{poll.question}</h3>
      </div>
      
      <div className="poll-options">
        {poll.options.map((option, index) => {
          const percentage = totalVotes > 0 
            ? Math.round((option.votes.length / totalVotes) * 100) 
            : 0;
          
          return (
            <div 
              key={index} 
              className={`poll-option ${userVotedOption === index ? 'selected' : ''}`}
              onClick={() => !userVoted && onVote(index)}
            >
              <div className="poll-option-text">
                {option.text}
                <span className="vote-count">
                  {option.votes.length > 0 && `${option.votes.length} ${option.votes.length === 1 ? 'vote' : 'votes'}`}
                </span>
              </div>
              
              <div className="poll-progress-container">
                <div 
                  className="poll-progress-bar" 
                  style={{ width: `${percentage}%` }}
                ></div>
                <span className="poll-percentage">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="poll-footer">
        <span className="poll-total-votes">
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
        </span>
        {userVoted && <span className="poll-voted">You voted</span>}
      </div>
    </div>
  );
};

export default PollMessage;