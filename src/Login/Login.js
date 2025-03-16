import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdPerson, IoMdLock, IoMdMail, IoMdArrowRoundForward, IoLogoGoogle, IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from 'react-icons/io';
import AuthService from './auth';
import { useGlobalContext } from '../context';
import './login.css';

const LoginRegistration = ({ initialView = 'login' }) => {
  const [activeForm, setActiveForm] = useState(initialView);
  const [showLogPassword, setShowLogPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useGlobalContext();
  
  // Form inputs state
  const [loginUsername, setLoginUsername] = useState('');
  const [logPassword, setLogPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  // Error and loading states
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = AuthService.isAuthenticated();
      if (isAuthenticated) {
        try {
          // Get user data
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
          
          // Redirect based on whether user has a profile or not
          if (userData.hasProfile) {
            navigate('/', { replace: true });
          } else {
            navigate('/create-profile', { replace: true });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    
    checkAuth();
  }, [navigate, setUser]);

  const handleFormSwitch = (form) => {
    setActiveForm(form);
    // Clear error messages when switching forms
    setLoginError('');
    setRegisterError('');
  };

  const toggleLogPassword = () => {
    setShowLogPassword(!showLogPassword);
  };

  const toggleRegPassword = () => {
    setShowRegPassword(!showRegPassword);
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginUsername || !logPassword) {
      setLoginError('Please enter both username and password');
      return;
    }
    
    setIsLoading(true);
    setLoginError('');
    
    try {
      const result = await AuthService.login(loginUsername, logPassword);
      
      if (result.success) {
        // Login successful
        setUser(result.data);
        
        // Redirect based on whether user has a profile
        if (result.data.hasProfile) {
          navigate('/', { replace: true });
        } else {
          navigate('/create-profile', { replace: true });
        }
      } else {
        // Login failed
        setLoginError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setLoginError('An error occurred during login. Please try again later.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!regEmail || !regUsername || !regPassword) {
      setRegisterError('Please fill out all fields');
      return;
    }
    
    setIsLoading(true);
    setRegisterError('');
    
    try {
      const result = await AuthService.register(regEmail, regUsername, regPassword);
      
      if (result.success) {
        // Registration successful
        setUser(result.data);
        
        // After registration, always redirect to create profile
        navigate('/create-profile', { replace: true });
      } else {
        // Registration failed
        setRegisterError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setRegisterError('An error occurred during registration. Please try again later.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-col">
        <div className="btn-box">
          <button 
            className={`btn ${activeForm === 'login' ? 'btn-1' : 'btn-2'}`} 
            onClick={() => handleFormSwitch('login')}
          >
            Sign In
          </button>
          <button 
            className={`btn ${activeForm === 'register' ? 'btn-1' : 'btn-2'}`} 
            onClick={() => handleFormSwitch('register')}
          >
            Sign Up
          </button>
        </div>

        {/* LOGIN FORM */}
        <form 
          className="form-box login-form" 
          style={{ display: activeForm === 'login' ? 'block' : 'none' }}
          onSubmit={handleLogin}
        >
          {/* Rest of the login form remains the same */}
          <div className="form-title">
            <span>Sign In</span>
          </div>
          <div className="form-inputs">
            {loginError && (
              <div className="error-message">
                {loginError}
              </div>
            )}
            <div className="input-box">
              <input 
                type="text" 
                className="inputs input-field" 
                placeholder="Username" 
                required 
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
              />
              <IoMdPerson className="icon" />
            </div>
            <div className="input-box">
              <input 
                type={showLogPassword ? "text" : "password"} 
                className="inputs input-field" 
                placeholder="Password" 
                required 
                value={logPassword}
                onChange={(e) => setLogPassword(e.target.value)}
              />
              <IoMdLock 
                className="icon" 
                onClick={toggleLogPassword} 
                style={{ cursor: 'pointer' }}
              />
            </div>
            <div className="forgot-pass">
              <a href="#">Forgot Password?</a>
            </div>
            <div className="input-box">
              <button 
                className="inputs submit-btn"
                type="submit"
                disabled={isLoading}
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                {!isLoading && <IoMdArrowRoundForward />}
              </button>
            </div>
          </div>
        </form>

        {/* REGISTER FORM */}
        <form 
          className="form-box register-form"
          style={{ display: activeForm === 'register' ? 'block' : 'none' }}
          onSubmit={handleRegister}
        >
          {/* Rest of the register form remains the same */}
          <div className="form-title">
            <span>Sign Up</span>
          </div>
          <div className="form-inputs">
            {registerError && (
              <div className="error-message">
                {registerError}
              </div>
            )}
            <div className="input-box">
              <input 
                type="email" 
                className="inputs input-field" 
                placeholder="Email" 
                required 
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
              <IoMdMail className="icon" />
            </div>
            <div className="input-box">
              <input 
                type="text" 
                className="inputs input-field" 
                placeholder="Username" 
                required 
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
              />
              <IoMdPerson className="icon" />
            </div>
            <div className="input-box">
              <input 
                type={showRegPassword ? "text" : "password"} 
                className="inputs input-field" 
                placeholder="Password" 
                required 
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
              <IoMdLock 
                className="icon" 
                onClick={toggleRegPassword}
                style={{ cursor: 'pointer' }}
              />
            </div>
            <div className="remember-me">
              <input 
                type="checkbox" 
                id="remember-me-check" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me-check">Remember me</label>
            </div>
            <div className="input-box">
              <button 
                className="inputs submit-btn"
                type="submit"
                disabled={isLoading}
              >
                <span>{isLoading ? 'Signing Up...' : 'Sign Up'}</span>
                {!isLoading && <IoMdArrowRoundForward />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginRegistration;