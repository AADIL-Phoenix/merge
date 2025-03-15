import axios from 'axios';

// Register user
export const register = async (userData) => {
  try {
    const response = await axios.post('/api/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    }
  } catch (err) {
    throw err.response?.data?.message || 'Registration failed';
  }
};

// Login user
export const login = async (userData) => {
  try {
    const response = await axios.post('/api/auth/login', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    }
  } catch (err) {
    throw err.response?.data?.message || 'Login failed';
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await axios.get('/api/auth/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    localStorage.removeItem('token');
    return null;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
};

// Set auth token
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};
