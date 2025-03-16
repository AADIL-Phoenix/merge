import React, { useEffect } from 'react';
import { useGlobalContext } from '../../context';
import Loading from '../Loader/Loader';
import BookList from '../BookList/BookList';
import './SearchResults.css';

const SearchResults = () => {
  const { books, loading, resultTitle } = useGlobalContext();

  useEffect(() => {
    // Scroll to top when search results load
    window.scrollTo(0, 0);
  }, [books]);

  return (
    <div className="search-results-container">
          <div className="search-results-header">
            <h2 className="section-title">{resultTitle}</h2>
            {books.length > 0 && (
              <p className="results-count">
                Found {books.length} {books.length === 1 ? 'book' : 'books'}
              </p>
            )}
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className="search-results-books">
              <BookList books={books} />
            </div>
          )}
        </div>
  );
};

export default SearchResults;