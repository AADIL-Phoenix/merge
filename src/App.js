import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from './context';

function App() {
  const navigate = useNavigate();
  const { user, isInitialized, isLoading } = useGlobalContext();
  
  useEffect(() => {
    // Once auth is initialized, redirect to appropriate page
    if (isInitialized) {
      if (user) {
        // If user has no profile, redirect to create-profile
        if (!user.hasProfile) {
          navigate('/create-profile', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [user, isInitialized, navigate]);
  
  // Show loading while checking auth
  if (!isInitialized || isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading application...</p>
      </div>
    );
  }
  
  // This component doesn't render anything as it just handles redirection
  return null;
}

export default App;