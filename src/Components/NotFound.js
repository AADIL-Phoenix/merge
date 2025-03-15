import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px', 
      maxWidth: '600px', 
      margin: '0 auto' 
    }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" style={{ 
        display: 'inline-block', 
        marginTop: '20px',
        padding: '10px 20px',
        background: '#007bff',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px'
      }}>
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
