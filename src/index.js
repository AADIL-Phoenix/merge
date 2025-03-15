import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './context.js';
import router from './routes.js';
import './index.css';
import "./Community/components/styles/Community.css";

// Create root
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AppProvider>
    <RouterProvider router={router} />
  </AppProvider>
);
