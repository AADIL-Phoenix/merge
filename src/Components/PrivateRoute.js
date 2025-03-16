import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../context';

const PrivateRoute = ({ children }) => {
    const { user, isInitialized } = useGlobalContext();

    // Show loading indicator while checking auth state
    if (!isInitialized) {
        return <div>Loading...</div>;
    }

    // Redirect to login if user is not authenticated
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Render the protected component
    return children;
};

export default PrivateRoute;
