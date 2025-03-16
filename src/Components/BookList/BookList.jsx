import React from 'react';
import Book from './Book';
import './BookList.css';

const BookList = ({ books }) => {
  console.log("BookList rendering with:", books);
  
  if (!books) {
    console.error("Books prop is undefined or null");
    return (
      <div className="no-books error">
        <p>Data error: Books information is missing.</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }
  
  if (books.length === 0) {
    console.log("Empty books array received");
    return (
      <div className="no-books">
        <p>No books found.</p>
        <p>Please try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="books-grid" role="list">
      {books.map((book) => {
        console.log("Rendering book:", book.id, book.title);
        return (
          <div key={book.id} role="listitem">
            <Book book={book} />
          </div>
        );
      })}
    </div>
  );
};

// Default props
BookList.defaultProps = {
  books: []
};

// For performance optimization
const areEqual = (prevProps, nextProps) => {
  // Check if the books array has changed
  if (prevProps.books.length !== nextProps.books.length) {
    return false;
  }

  // Check if any book's ID has changed
  return prevProps.books.every((book, index) => 
    book.id === nextProps.books[index].id
  );
};

export default React.memo(BookList, areEqual);