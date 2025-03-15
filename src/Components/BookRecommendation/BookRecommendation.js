import React, { useState, useEffect, useCallback } from 'react';
import BookList from '../BookList/BookList';
import Loader from '../Loader/Loader';
import BookApiService from '../BookApiService';
import './BookRecommendation.css';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const BookRecommendation = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching recommendations...'); // Debug log
      const result = await BookApiService.getRecommendations();
      console.log('API Response:', result); // Debug log

      if (result.status === 'success' && Array.isArray(result.data)) {
        setBooks(result.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        setRetryCount(prev => prev + 1);
        setTimeout(fetchBooks, RETRY_DELAY);
      } else {
        setError('Failed to load recommendations. Please try again later.');
        
        // Try fallback to top rated books
        try {
          const fallbackResult = await BookApiService.getTopRatedBooks(10);
          if (fallbackResult.status === 'success' && Array.isArray(fallbackResult.data)) {
            setBooks(fallbackResult.data);
            setError(null);
          }
        } catch (fallbackError) {
          console.error('Fallback request failed:', fallbackError);
          setError('Unable to load any book recommendations.');
        }
      }
    } finally {
      // Add a small delay to prevent flickering
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleRetry = useCallback(() => {
    setRetryCount(0);
    fetchBooks();
  }, [fetchBooks]);

  if (loading) {
    return (
      <div className="recommendations-container">
        <Loader message="Loading recommendations..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-container">
        <div className="error-container">
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={handleRetry}
            aria-label="Retry loading recommendations"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <h1 className="page-title">Recommended For You</h1>
      <div className="recommendations-content">
        {books && books.length > 0 ? (
          <BookList books={books} />
        ) : (
          <div className="no-recommendations">
            <p>No recommendations available at the moment.</p>
            <p>Try exploring our library to find books you might like!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(BookRecommendation);
