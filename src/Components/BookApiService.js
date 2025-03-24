const handleResponse = async (response) => {
  if (!response.ok) {
    const errorMessage = `HTTP error! status: ${response.status}`;
    console.log('API Error Response:', response.status, response.statusText);
    
    try {
      // Try to parse error message from JSON if available
      const errorData = await response.json();
      throw new Error(errorData.message || errorMessage);
    } catch (parseError) {
      // If JSON parsing fails, use default error message
      throw new Error(errorMessage);
    }
  }
  
  try {
    return await response.json();
  } catch (error) {
    console.error('Error parsing JSON response:', error);
    throw new Error('Invalid JSON response from server');
  }
};

const BookApiService = {
  // Configuration flag to determine which API to use
  useGoogleApi: true, // Set to false to use your custom API

  async getBooks(params = {}) {
    try {
      if (this.useGoogleApi) {
        // Build query for Google Books API
        const query = params.query || 'harry potter';
        let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
        
        // Add filters if they exist
        if (params.orderBy) {
          url += `&orderBy=${params.orderBy}`;
        }
        if (params.printType) {
          url += `&printType=${params.printType}`;
        }
        if (params.maxResults) {
          url += `&maxResults=${params.maxResults}`;
        }
        
        console.log('Sending request to:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        const result = await handleResponse(response);
        console.log('Books API response:', result);
        
        // Format Google Books API response
        const formattedBooks = result.items?.map(book => ({
          id: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors?.join(', ') || 'Unknown Author',
          description: book.volumeInfo.description || 'No description available',
          coverImage: book.volumeInfo.imageLinks?.thumbnail || null,
          rating: book.volumeInfo.averageRating || 0,
          publishedDate: book.volumeInfo.publishedDate,
          pageCount: book.volumeInfo.pageCount,
          categories: book.volumeInfo.categories || []
        })) || [];
        
        return {
          status: 'success',
          data: formattedBooks
        };
      } else {
        // Use custom API
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books?${queryString}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        const data = await handleResponse(response);
        return {
          status: 'success',
          data: data.data || []
        };
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      return {
        status: 'error',
        message: error.message
      };
    }
  },

  async getTopRatedBooks(limit = 10) {
    try {
      if (this.useGoogleApi) {
        // Use Google Books API
        const query = 'bestseller';
        
        console.log('Sending top rated request to:', `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
        
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        const result = await handleResponse(response);
        console.log('Top rated books response:', result);
        
        // Format and sort by rating
        const formattedBooks = result.items?.map(book => ({
          id: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors?.join(', ') || 'Unknown Author',
          description: book.volumeInfo.description || 'No description available',
          coverImage: book.volumeInfo.imageLinks?.thumbnail || null,
          rating: book.volumeInfo.averageRating || 0,
          publishedDate: book.volumeInfo.publishedDate,
          pageCount: book.volumeInfo.pageCount,
          categories: book.volumeInfo.categories || []
        })) || [];
        
        // Sort by rating (descending) and limit results
        const topRated = formattedBooks
          .sort((a, b) => b.rating - a.rating)
          .slice(0, limit);
        
        return {
          status: 'success',
          data: topRated
        };
      } else {
        // Use custom API
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/top-rated?limit=${limit}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        const data = await handleResponse(response);
        return {
          status: 'success',
          data: data.data || []
        };
      }
    } catch (error) {
      console.error('Error fetching top rated books:', error);
      return {
        status: 'error',
        message: error.message
      };
    }
  },

  async getBookById(id) {
    try {
      if (this.useGoogleApi) {
        // Use Google Books API
        console.log('Fetching book details for ID:', id);
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        const book = await handleResponse(response);
        console.log('Book details response:', book);
        
        // Format Google Books API response
        const formattedBook = {
          id: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors?.join(', ') || 'Unknown Author',
          description: book.volumeInfo.description || 'No description available',
          coverImage: book.volumeInfo.imageLinks?.thumbnail || null,
          rating: book.volumeInfo.averageRating || 0,
          publishedDate: book.volumeInfo.publishedDate,
          pageCount: book.volumeInfo.pageCount,
          categories: book.volumeInfo.categories || [],
          publisher: book.volumeInfo.publisher,
          language: book.volumeInfo.language,
          previewLink: book.volumeInfo.previewLink,
          isbn: book.volumeInfo.industryIdentifiers?.[0]?.identifier
        };
        
        return {
          status: 'success',
          data: formattedBook
        };
      } else {
        // Use custom API
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/${id}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        const data = await handleResponse(response);
        return {
          status: 'success',
          data: data.data
        };
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
      return {
        status: 'error',
        message: error.message
      };
    }
  },

  async getRecommendations() {
    try {
      if (this.useGoogleApi) {
        // Use Google Books API for recommendations
        const query = 'popular fiction';
        
        console.log('Sending recommendations request to:', `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
        
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        const result = await handleResponse(response);
        console.log('Recommendations response:', result);
        
        // Format Google Books API response
        const formattedBooks = result.items?.map(book => ({
          id: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors?.join(', ') || 'Unknown Author',
          description: book.volumeInfo.description || 'No description available',
          coverImage: book.volumeInfo.imageLinks?.thumbnail || null,
          rating: book.volumeInfo.averageRating || 0,
          publishedDate: book.volumeInfo.publishedDate,
          pageCount: book.volumeInfo.pageCount,
          categories: book.volumeInfo.categories || []
        })) || [];
        
        return {
          status: 'success',
          data: formattedBooks
        };
      } else {
        // Use custom API for personalized recommendations
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recommendations/personalized`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        const data = await handleResponse(response);
        return {
          status: 'success',
          data: data.data || []
        };
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      
      // Fallback mechanism
      try {
        if (this.useGoogleApi) {
          // Fallback to another Google Books query
          console.log('Attempting fallback query');
          const fallbackResponse = await fetch('https://www.googleapis.com/books/v1/volumes?q=bestseller', {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            }
          });
          
          const fallbackResult = await handleResponse(fallbackResponse);
          
          const fallbackBooks = fallbackResult.items?.map(book => ({
            id: book.id,
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors?.join(', ') || 'Unknown Author',
            description: book.volumeInfo.description || 'No description available',
            coverImage: book.volumeInfo.imageLinks?.thumbnail || null,
            rating: book.volumeInfo.averageRating || 0,
            publishedDate: book.volumeInfo.publishedDate,
            pageCount: book.volumeInfo.pageCount,
            categories: book.volumeInfo.categories || []
          })) || [];
          
          return {
            status: 'success',
            data: fallbackBooks
          };
        } else {
          // Fallback to top rated books for custom API
          return this.getTopRatedBooks(10);
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        return {
          status: 'error',
          message: 'Unable to fetch any book data'
        };
      }
    }
  }
};

export default BookApiService;
