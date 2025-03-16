// AuthService.js - Authentication service for React applications

class AuthService {
  // Store user data in localStorage
  static storeUser(userData, token) {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  }

  // Get user data from localStorage
  static getUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    }
    return null;
  }

  // Clear user data from localStorage
  static clearStorage() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  // Check if user is authenticated
  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Login user
  static async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        this.storeUser(data.user, data.token);
        return {
          success: true,
          data: { user: data.user, token: data.token }
        };
      } else {
        return {
          success: false,
          error: data.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'An error occurred during login'
      };
    }
  }

  // Register user
  static async register(name, email, password) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        this.storeUser(data.user, data.token);
        return {
          success: true,
          data: { user: data.user, token: data.token }
        };
      } else {
        return {
          success: false,
          error: data.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'An error occurred during registration'
      };
    }
  }

  // Get current user info
  static async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return { success: false };
      }
      
      const response = await fetch('/api/auth/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const user = await response.json();
        this.storeUser(user, token);
        return {
          success: true,
          data: { user }
        };
      } else {
        this.clearStorage();
        return { success: false };
      }
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        error: 'Failed to verify authentication'
      };
    }
  }

  // Logout user
  static async logout() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      this.clearStorage();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: 'Logout failed'
      };
    }
  }
}

export default AuthService;
