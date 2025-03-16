import React, { useState, useEffect } from 'react';
import BookList from '../BookList/BookList';
import Loader from '../Loader/Loader';
import BookApiService from '../BookApiService';
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
        
        const result = await BookApiService.getTopRatedBooks(20);
        await loadingDelay; // Wait for minimal loading time

        if (result.status === 'success' && Array.isArray(result.data)) {
          setBooks(result.data);
        } else {
          setBooks([]);
          if (result.status === 'error') {
            throw new Error(result.message);
          }
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
        <Loader message="Loading top rated books..." />
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
            aria-label="Retry loading top rated books"
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