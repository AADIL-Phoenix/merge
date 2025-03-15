import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../nav/nav';
import './layout.css'; 

const Layout = () => {
  return (
    <div className="layout-container">
      <Navbar />
      <div className="content-container">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;