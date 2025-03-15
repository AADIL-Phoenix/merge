import React from 'react';
import { Link } from 'react-router-dom';
import './BookList.css';

const Book = ({ book }) => {
  const {
    id,
    title,
    author,
    coverImage,
    averageRating,
    ratingsCount,
    genre
  } = book;

  // Convert rating to stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="star full">★</span>);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    // Add empty stars to make total of 5
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  const defaultCoverImage = 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1000&auto=format&fit=crop';

  return (
    <div className="book-card">
      <div className="book-image">
        <img
          src={coverImage || defaultCoverImage}
          alt={title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultCoverImage;
          }}
        />
      </div>
      <div className="book-info">
        <Link to={`/books/${id}`} className="book-title" title={title}>
          {title}
        </Link>
        <p className="book-author" title={author}>by {author}</p>
        <div className="book-rating">
          <div className="stars" title={`${averageRating} out of 5 stars`}>
            {renderStars(averageRating)}
          </div>
          <span className="rating-count">
            ({ratingsCount.toLocaleString()} {ratingsCount === 1 ? 'rating' : 'ratings'})
          </span>
        </div>
        {genre && genre.length > 0 && (
          <div className="book-genres">
            {genre.slice(0, 3).map((g, index) => (
              <span key={index} className="genre-tag">
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Book;
