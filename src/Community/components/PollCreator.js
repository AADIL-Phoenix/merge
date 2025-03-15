// components/PollCreator.js
import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const PollCreator = ({ onClose, onCreatePoll }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  
  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };
  
  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };
  
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      return;
    }
    
    // Filter out empty options
    const validOptions = options.filter(opt => opt.trim());
    
    if (validOptions.length < 2) {
      return;
    }
    
    onCreatePoll(question, validOptions);
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-container poll-creator">
        <div className="modal-header">
          <h2>Create a Poll</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Question</label>
            <input
              type="text"
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Options</label>
            {options.map((option, index) => (
              <div key={index} className="option-input">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
                {options.length > 2 && (
                  <button 
                    type="button" 
                    className="remove-option-btn"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            
            {options.length < 10 && (
              <button 
                type="button" 
                className="add-option-btn"
                onClick={handleAddOption}
              >
                <Plus size={16} /> Add Option
              </button>
            )}
          </div>
          
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="create-btn"
              disabled={!question.trim() || options.filter(opt => opt.trim()).length < 2}
            >
              Create Poll
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PollCreator;