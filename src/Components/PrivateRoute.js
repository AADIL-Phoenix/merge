import React from 'react';
import './PrivateRoute.css';
import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../context';

const PrivateRoute = ({ children }) => {
  const { user, isInitialized } = useGlobalContext();
  
  // Show loading while checking auth status
  if (!isInitialized) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Render protected route content
  return children;
};

export default PrivateRoute;
