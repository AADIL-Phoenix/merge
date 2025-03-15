import React from 'react';
import './Loader.css';

const Loader = ({ message = 'Loading books...' }) => {
  return (
    <div className="loader-container" role="alert" aria-busy="true">
      <div className="book">
        <div className="book__page"></div>
        <div className="book__page"></div>
        <div className="book__page"></div>
      </div>
      <div className="loading-text" aria-label={message}>
        {message}
      </div>
    </div>
  );
};

export default React.memo(Loader);
