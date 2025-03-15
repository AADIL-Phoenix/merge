import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import { useGlobalContext } from '../../context';
import './nav.css';

const Navbar = () => {
  const { setSearchTerm, setResultTitle, logout } = useGlobalContext();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    orderBy: 'relevance',
    printType: 'all',
    maxResults: 30
  });
  const dropdownRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuIconRef = useRef(null);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchTerm(searchQuery);
      setResultTitle(`Search results for "${searchQuery}"`);
      navigate('/books');
      setSearchQuery('');
      setShowFilters(false);
    }
  };

  // Toggle Dropdown Menu
  const toggleDropdownMenu = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Toggle Mobile Menu
  const toggleMobileMenu = () => {
    setIsMobileMenuActive(prev => !prev);
  };

  // Handle Click Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        toggleBtnRef.current && 
        !toggleBtnRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }

      if (
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target) &&
        menuIconRef.current && 
        !menuIconRef.current.contains(event.target)
      ) {
        setIsMobileMenuActive(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsMobileMenuActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <header>
      <div className="logo">
        <h1>Book Club Network</h1>
      </div>

      <div className="search-box">
        <form onSubmit={handleSearchSubmit}>
          <div className="search-input-wrapper">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, authors, genres" 
              aria-label="Search"
            />
            <button 
              type="button" 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Toggle filters"
            >
              <FontAwesomeIcon icon={faFilter} />
            </button>
            <button type="submit" aria-label="Search">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>

          {/* Add filter panel */}
          {showFilters && (
            <div className="search-filters">
              <div className="filter-group">
                <label>Sort By:</label>
                <select 
                  value={filters.orderBy}
                  onChange={(e) => setFilters({...filters, orderBy: e.target.value})}
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Type:</label>
                <select 
                  value={filters.printType}
                  onChange={(e) => setFilters({...filters, printType: e.target.value})}
                >
                  <option value="all">All</option>
                  <option value="books">Books</option>
                  <option value="magazines">Magazines</option>
                </select>
              </div>
            </div>
          )}
        </form>
      </div>

      <nav className="navbar">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/chats">Chats</Link></li>
          <li><button onClick={logout} className="nav-logout-btn">Logout</button></li>
        </ul>
      </nav>

      {/* Mobile Menu Toggle */}
      <div 
        ref={menuIconRef}
        className="menu-icon" 
        onClick={toggleMobileMenu}
      >
        <FontAwesomeIcon icon={isMobileMenuActive ? faXmark : faBars} />
      </div>

      {/* User Dropdown Toggle */}
      <div 
        ref={toggleBtnRef}
        className="toggle_btn" 
        onClick={toggleDropdownMenu}
      >
        <FontAwesomeIcon icon={isDropdownOpen ? faXmark : faBars} />
      </div>

      {/* Dropdown Menu */}
      <div 
        ref={dropdownRef}
        className={`dropdown_menu ${isDropdownOpen ? 'open' : ''}`}
      >
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/chats">Chats</Link></li>
          <li><button onClick={logout} className="logout-btn">Logout</button></li>
        </ul>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        ref={mobileMenuRef}
        className={`mobile-menu ${isMobileMenuActive ? 'active' : ''}`}
      >
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/chats">Chats</Link></li>
          <li><button onClick={logout} className="nav-logout-btn">Logout</button></li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
