import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from './auth';
import { useGlobalContext } from '../context';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const { setUser, user } = useGlobalContext();
  const [view, setView] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (view === 'register') {
        // Validation for registration
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        if (!formData.name.trim()) {
          throw new Error('Name is required');
        }
        if (!formData.email.trim()) {
          throw new Error('Email is required');
        }

        const response = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        if (response.user) {
          setUser(response.user);
          navigate('/', { replace: true });
        } else {
          throw new Error('Registration failed');
        }
      } else {
        // Login
        if (!formData.email.trim() || !formData.password) {
          throw new Error('Email and password are required');
        }

        const response = await login({
          email: formData.email,
          password: formData.password
        });
        
        if (response.user) {
          setUser(response.user);
          navigate('/', { replace: true });
        } else {
          throw new Error('Invalid credentials');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-tabs">
          <button
            className={`tab-btn ${view === 'login' ? 'active' : ''}`}
            onClick={() => setView('login')}
          >
            Sign In
          </button>
          <button
            className={`tab-btn ${view === 'register' ? 'active' : ''}`}
            onClick={() => setView('register')}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>{view === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          
          {error && <div className="error-message">{error}</div>}

          {view === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required={view === 'register'}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {view === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required={view === 'register'}
              />
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : view === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
