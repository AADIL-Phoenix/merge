const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`
    }));
    throw new Error(error.message || 'Network response was not ok');
  }
  return response.json();
};

const BookApiService = {
  async getBooks(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/books?${queryString}`, {
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
      const response = await fetch(`/api/books/top-rated?limit=${limit}`, {
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
      const response = await fetch(`/api/books/${id}`, {
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
      // Get personalized recommendations
      const response = await fetch('/api/recommendations/personalized', {
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
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Fallback to top rated books
      return this.getTopRatedBooks(10);
    }
  }
};

export default BookApiService;
