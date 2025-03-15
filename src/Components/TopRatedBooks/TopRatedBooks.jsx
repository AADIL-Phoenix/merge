import React, { useState, useEffect } from 'react';
import BookList from '../BookList/BookList';
import Loader from '../Loader/Loader';
import './TopRatedBooks.css';

const TopRatedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopRatedBooks = async () => {
      try {
        // Adding a minimal delay to prevent flickering
        const loadingDelay = new Promise(resolve => setTimeout(resolve, 500));
        
        const response = await fetch('/api/books?sort=rating&order=desc&limit=20');
        if (!response.ok) {
          throw new Error('Failed to fetch top rated books');
        }

        const data = await response.json();
        await loadingDelay; // Wait for minimal loading time

        if (data.status === 'success' && Array.isArray(data.data)) {
          setBooks(data.data);
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error('Error fetching top rated books:', error);
        setError('Failed to load top rated books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedBooks();
  }, []);

  if (loading) {
    return (
      <div className="top-rated-container">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="top-rated-container">
        <div className="error-container">
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="top-rated-container">
      <h1 className="page-title">Top Rated Books</h1>
      <div className="top-rated-content">
        {books.length > 0 ? (
          <BookList books={books} />
        ) : (
          <div className="no-books-message">
            <p>No top rated books available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopRatedBooks;
