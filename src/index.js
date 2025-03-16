import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useGlobalContext } from './context.js';
import Layout from './comp/layout/layout';
import App from './App';
import './index.css';
import ChatsPage from './Components/Chats/ChatsPage';
import MainHome from './MainHomeComp/frontend/MainHome';
import BookList from "./Components/BookList/BookList";
import BookDetails from "./Components/BookDetails/BookDetails";
import Community from "./Community/components/CommunityPage.js";
import CreateProfile from "./Community/components/CreateProfile.js";
import UserProfile from "./Community/components/UserProfile.jsx";
import BookRecommendation from './Components/BookRecommendation/BookRecommendation.js';
import "./Community/components/styles/Community.css";
import Login from './Login/Login.js';
import NotFound from './Components/NotFound';
import SearchResults from './Components/SearchResults/SearchResults.jsx';

// Custom protected route component
const ProtectedRoute = ({ children }) => {
  const { user, isInitialized } = useGlobalContext();
  const token = localStorage.getItem('token');
  
  // Show loading while checking auth status
  if (!isInitialized) {
    return <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Verifying authentication...</p>
    </div>;
  }
  
  // Redirect to login if no user or token
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }
  
  // If user exists but no profile, redirect to create profile
  // (except when already on create-profile page)
  if (!user.hasProfile && window.location.pathname !== '/create-profile') {
    return <Navigate to="/create-profile" replace />;
  }
  
  return children;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProvider>
    <BrowserRouter>
      <Routes>
        {/* Application entry point */}
        <Route path="/app" element={<App />} />
        
        {/* Public routes */}
        <Route element={<Layout />}>
          <Route path="/login" element={<Login initialView="login" />} />
          <Route path="/register" element={<Login initialView="register" />} />
          
          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><MainHome /></ProtectedRoute>} />
          <Route path="/book" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
          <Route path="/chats" element={<ProtectedRoute><ChatsPage /> </ProtectedRoute>} />
          <Route path="/chats/:chatId" element={<ProtectedRoute><ChatsPage /> </ProtectedRoute>} />
          <Route path="/chats/group/:groupId" element={<ProtectedRoute><ChatsPage /> </ProtectedRoute>} />
          <Route path="/book/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="/create-profile" element={<ProtectedRoute><CreateProfile /></ProtectedRoute>} />
          <Route path="/community/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          {/* Protected recommendation routes */}
          <Route path="/recommendations/:type" element={<BookRecommendation />} />
          <Route path="/recommendations" element={<Navigate to="/recommendations/top-rated" replace />} />
          <Route path="/top-books" element={<Navigate to="/recommendations/top-rated" replace />} />
          
          {/* Redirect root to app entry point */}
          <Route path="" element={<Navigate to="/app" replace />} />
          
          {/* 404 Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AppProvider>
);