import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../comp/nav/nav';
import clubImage from '../../images/club.jpg';
import topRatedImage from '../../images/top-rated.jpg';
import genreImage from '../../images/genre.jpg';
import './style.css';

const MainHome = () => {
  const [showScrollIcon, setShowScrollIcon] = useState(false);

  useEffect(() => {
    // Check if content height exceeds viewport
    const checkContentHeight = () => {
      const contentHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight;
      setShowScrollIcon(contentHeight > viewportHeight);
    };

    // Run on mount and when window resizes
    checkContentHeight();
    window.addEventListener('resize', checkContentHeight);

    // Cleanup
    return () => window.removeEventListener('resize', checkContentHeight);
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="main-wrapper">
      <Navbar />
      <main className="container">
        <div className="card_container">
          {/* Join a Club Card */}
          <Link to="/community" className="card-link">
            <article className="card_article">
              <img
                src={clubImage}
                alt="Join a Book Club"
                className="card_img"
              />
              <div className="card_data">
                <span className="card_description">Join a Club</span>
                <h2 className="card_title">Join a Club</h2>
              </div>
            </article>
          </Link>

          {/* Top Rated Books Card */}
          <article className="card_article">
            <img
              src={topRatedImage}
              alt="Top Rated Books"
              className="card_img"
            />
            <div className="card_data">
              <span className="card_description">Top Rated Books</span>
              <h2 className="card_title">Discover Best Books</h2>
              <Link to="/top-books" className="card_button">Click Here</Link>
            </div>
          </article>

          {/* Recommendations Card */}
          <article className="card_article">
            <img
              src={genreImage}
              alt="Book Recommendations"
              className="card_img"
            />
            <div className="card_data">
              <span className="card_description">Recommendations</span>
              <h2 className="card_title">Personalized for You</h2>
              <Link to="/recommendations" className="card_button">Click Here</Link>
            </div>
          </article>
        </div>

        {/* Scroll indicator that appears only when needed */}
        {showScrollIcon && (
          <div className="scroll-indicator" onClick={scrollToBottom}>
            <div className="scroll-arrow"></div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MainHome;
