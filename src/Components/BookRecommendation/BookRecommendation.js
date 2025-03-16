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
      
      // Try to get recommendations
      let result = await BookApiService.getRecommendations();
      console.log('API Response:', result); // Debug log

      // If the recommendations API fails, try direct fallback instead of relying on the service's internal fallback
      if (result.status !== 'success' || !Array.isArray(result.data) || result.data.length === 0) {
        console.log('Recommendations failed or returned empty, trying direct fallback');
        
        // Try a direct API call to Google Books
        const fallbackResponse = await fetch('https://www.googleapis.com/books/v1/volumes?q=bestseller&maxResults=10');
        
        if (!fallbackResponse.ok) {
          throw new Error(`Fallback API request failed: ${fallbackResponse.status}`);
        }
        
        const fallbackData = await fallbackResponse.json();
        
        if (fallbackData && Array.isArray(fallbackData.items) && fallbackData.items.length > 0) {
          // Format the data to match our expected structure
          const formattedBooks = fallbackData.items.map(book => ({
            id: book.id,
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors?.join(', ') || 'Unknown Author',
            description: book.volumeInfo.description || 'No description available',
            coverImage: book.volumeInfo.imageLinks?.thumbnail || null,
            rating: book.volumeInfo.averageRating || 0,
            publishedDate: book.volumeInfo.publishedDate || 'Unknown',
            pageCount: book.volumeInfo.pageCount || 'Unknown',
            categories: book.volumeInfo.categories || []
          }));
          
          setBooks(formattedBooks);
        } else {
          throw new Error('No books found in API response');
        }
      } else {
        // Use the recommendations result
        setBooks(result.data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        setRetryCount(prev => prev + 1);
        setTimeout(fetchBooks, RETRY_DELAY);
      } else {
        setError('Failed to load recommendations. Please try again later.');
        
        // Last resort: try a simple, different query
        try {
          console.log('Attempting last resort query');
          const lastResortResponse = await fetch('https://www.googleapis.com/books/v1/volumes?q=fiction');
          
          if (lastResortResponse.ok) {
            const lastResortData = await lastResortResponse.json();
            
            if (lastResortData && Array.isArray(lastResortData.items) && lastResortData.items.length > 0) {
              // Format the data
              const lastResortBooks = lastResortData.items.map(book => ({
                id: book.id,
                title: book.volumeInfo.title,
                author: book.volumeInfo.authors?.join(', ') || 'Unknown Author',
                description: book.volumeInfo.description || 'No description available',
                coverImage: book.volumeInfo.imageLinks?.thumbnail || null,
                rating: book.volumeInfo.averageRating || 0,
                publishedDate: book.volumeInfo.publishedDate || 'Unknown',
                pageCount: book.volumeInfo.pageCount || 'Unknown',
                categories: book.volumeInfo.categories || []
              }));
              
              setBooks(lastResortBooks);
              setError(null); // Clear error if we got books
            } else {
              throw new Error('No books found in last resort query');
            }
          } else {
            throw new Error(`Last resort query failed: ${lastResortResponse.status}`);
          }
        } catch (lastResortError) {
          console.error('Last resort request failed:', lastResortError);
          setError('Unable to load any book recommendations. Please check your internet connection and try again.');
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