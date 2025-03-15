import React, { useState, useEffect } from 'react';
import { FaTimes, FaHeart, FaBookmark, FaStar, FaChevronDown, FaBookOpen, FaShoppingCart, FaExternalLinkAlt } from "react-icons/fa";
import "./BookPreview.css";

const BookPreview = ({ bookId, bookTitle, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('preview');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookData, setBookData] = useState(null);
  const [expandDescription, setExpandDescription] = useState(false);
  const [chapterContent, setChapterContent] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [chapterLoading, setChapterLoading] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        // Fetch from Google Books API
        const googleResponse = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
        const googleData = await googleResponse.json();
        setBookData(googleData);

        // Track book view in our backend
        const token = localStorage.getItem('token');
        if (token) {
          await fetch(`/api/books/${bookId}/view`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }

        setIsLoading(false);
        
        // If there's preview available, fetch the first chapter automatically
        if (googleData.volumeInfo?.previewLink) {
          fetchChapterPreview(0);
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
        setIsLoading(false);
      }
    };

    fetchBookDetails();
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [bookId]);

  const handleAddToWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to add books to your wishlist');
        return;
      }

      const response = await fetch(`/api/books/user/collection/${bookId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Book added to your collection!');
      } else {
        throw new Error('Failed to add book to collection');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add book to collection. Please try again.');
    }
  };

  const handleAddToReadingList = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to add books to your reading list');
        return;
      }

      const response = await fetch(`/api/books/user/reading-list/${bookId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Book added to your reading list!');
      } else {
        throw new Error('Failed to add book to reading list');
      }
    } catch (error) {
      console.error('Error adding to reading list:', error);
      alert('Failed to add book to reading list. Please try again.');
    }
  };

  const fetchChapterPreview = async (chapterIndex) => {
    setChapterLoading(true);
    try {
      // In a real application, you would fetch actual chapter content from the API
      // For this example, we'll simulate different chapters with placeholder text
      const sampleChapters = [
        { 
          title: "Chapter 1", 
          content: "This is a preview of the first chapter. In a real implementation, this would contain the actual text from the book's first chapter as permitted by the publisher. This preview gives readers a taste of the book's style and content to help them decide if they want to purchase the full book."
        },
        {
          title: "Chapter 2",
          content: "This is a preview of the second chapter. The content shown here would typically be limited to what the publisher has allowed for preview purposes. After reading the preview, users can purchase the full book to continue reading."
        },
        {
          title: "Chapter 3",
          content: "This is a preview of the third chapter. Preview content is usually limited to a certain percentage of the book. To continue reading, please purchase the full book using the provided links."
        }
      ];
      
      // Simulate API delay
      setTimeout(() => {
        setChapterContent(sampleChapters[chapterIndex]);
        setCurrentChapter(chapterIndex);
        setChapterLoading(false);
      }, 800);
      
    } catch (error) {
      console.error('Error fetching chapter preview:', error);
      setChapterLoading(false);
    }
  };

  const getPurchaseLinks = () => {
    const { title, authors = [] } = bookData?.volumeInfo || {};
    const formattedTitle = encodeURIComponent(title);
    const formattedAuthor = encodeURIComponent(authors[0] || '');
    
    return [
      {
        name: "Amazon",
        url: `https://www.amazon.com/s?k=${formattedTitle}+${formattedAuthor}`
      },
      {
        name: "Barnes & Noble",
        url: `https://www.barnesandnoble.com/s/${formattedTitle}+${formattedAuthor}`
      },
      {
        name: "Books-A-Million",
        url: `https://www.booksamillion.com/search?query=${formattedTitle}+${formattedAuthor}`
      },
      {
        name: "Google Play Books",
        url: `https://play.google.com/store/search?q=${formattedTitle}+${formattedAuthor}&c=books`
      }
    ];
  };

  if (isLoading) {
    return (
      <div className="book-preview-overlay">
        <div className="book-preview-container">
          <div className="preview-loader">
            <div className="loader-spinner"></div>
            <div className="loader-text">Loading book details...</div>
          </div>
        </div>
      </div>
    );
  }

  const {
    title = bookTitle,
    authors = [],
    averageRating = 0,
    ratingsCount = 0,
    imageLinks = {},
    categories = [],
    publisher = 'Not available',
    publishedDate = 'Not available',
    pageCount = 'Not available',
    description = 'No description available',
    language = 'Not specified',
    industryIdentifiers = []
  } = bookData?.volumeInfo || {};

  const isbn = industryIdentifiers.find(id => id.type === 'ISBN_13')?.identifier || 
               industryIdentifiers.find(id => id.type === 'ISBN_10')?.identifier || 
               'Not available';

  return (
    <div className={`book-preview-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <button className="close-preview-btn" onClick={onClose}>
        <FaTimes />
      </button>

      <div className="preview-header">
        <div className="header-main">
          <h1 className="book-title">{title}</h1>
          <p className="book-author">by {authors.join(', ') || 'Unknown Author'}</p>
          <div className="rating-container">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i}
                  className={i < Math.floor(averageRating) ? 'star-filled' : 'star-empty'} 
                />
              ))}
            </div>
            <span className="rating-count">({ratingsCount} reviews)</span>
          </div>
        </div>
        <button 
          className="theme-toggle"
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="preview-content">
        <div className="preview-left">
          <div className="book-cover-container">
            <img 
              src={imageLinks.thumbnail || '/images/cover_not_found.jpg'} 
              alt={title}
              className="book-cover"
            />
          </div>
          <div className="action-buttons">
            <button className="action-btn wishlist" onClick={handleAddToWishlist}>
              <FaHeart /> Add to Wishlist
            </button>
            <button className="action-btn reading-list" onClick={handleAddToReadingList}>
              <FaBookmark /> Add to Reading List
            </button>
          </div>
          
          {/* Purchase Links Section */}
          <div className="purchase-section">
            <h3><FaShoppingCart /> Buy this book</h3>
            <div className="purchase-links">
              {getPurchaseLinks().map((link, index) => (
                <a 
                  key={index} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="purchase-link"
                >
                  {link.name} <FaExternalLinkAlt size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="preview-right">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              About
            </button>
            <button 
              className={`tab ${activeTab === 'read' ? 'active' : ''}`}
              onClick={() => setActiveTab('read')}
            >
              <FaBookOpen /> Read Preview
            </button>
            <button 
              className={`tab ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'preview' && (
              <div className="preview-tab">
                <h3>About this book</h3>
                <div className={`book-description ${expandDescription ? 'expanded' : ''}`}>
                  <p>{description}</p>
                </div>
                {description.length > 300 && (
                  <button 
                    className="expand-button"
                    onClick={() => setExpandDescription(!expandDescription)}
                  >
                    {expandDescription ? 'Show less' : 'Show more'} <FaChevronDown className={expandDescription ? 'rotate' : ''} />
                  </button>
                )}
              </div>
            )}
            
            {activeTab === 'read' && (
              <div className="read-preview-tab">
                <div className="chapter-navigation">
                  <h3>Preview Chapters</h3>
                  <div className="chapter-buttons">
                    {[0, 1, 2].map((index) => (
                      <button 
                        key={index}
                        onClick={() => fetchChapterPreview(index)}
                        className={`chapter-button ${currentChapter === index ? 'active' : ''}`}
                      >
                        Chapter {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="chapter-content-container">
                  {chapterLoading ? (
                    <div className="chapter-loading">
                      <div className="loader-spinner small"></div>
                      <p>Loading chapter preview...</p>
                    </div>
                  ) : chapterContent ? (
                    <div className="chapter-content">
                      <h4 className="chapter-title">{chapterContent.title}</h4>
                      <div className="chapter-text">
                        <p>{chapterContent.content}</p>
                        <div className="preview-notice">
                          <p>This is a preview. To continue reading, purchase the full book.</p>
                          <div className="preview-purchase-links">
                            {getPurchaseLinks().slice(0, 2).map((link, index) => (
                              <a 
                                key={index} 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="preview-purchase-link"
                              >
                                Buy on {link.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="no-preview-available">
                      <p>No preview is available for this book. Please consider purchasing to read the full content.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'details' && (
              <div className="details-tab">
                <div className="book-details">
                  <div className="detail-item">
                    <span className="detail-label">Genre:</span>
                    <span className="detail-value">{categories.join(', ') || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Publisher:</span>
                    <span className="detail-value">{publisher}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Published Date:</span>
                    <span className="detail-value">{publishedDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Pages:</span>
                    <span className="detail-value">{pageCount}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Language:</span>
                    <span className="detail-value">{language.toUpperCase()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">ISBN:</span>
                    <span className="detail-value">{isbn}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPreview;
