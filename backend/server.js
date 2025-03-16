require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { connectDB, disconnectDB } = require('./config/db');
const limiter = require('./middleware/rateLimit');

const app = express();

// Connect Database
(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    process.exit(1);
  }
})();

// Initialize Middleware
app.use(limiter);
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    query: req.query,
    body: req.path.includes('photo') ? '<<file upload>>' : req.body
  });
  next();
});

// Configure static file serving for uploads
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath, {
  maxAge: '1d',
  fallthrough: false
}));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/profile', require('./routes/profile'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  res.status(500).json({ 
    message: 'Something broke!', 
    error: err.message,
    path: req.path
  });
});


// Catch-all route handler for any requests to an unknown route
app.use((req, res) => {
  console.log(`404: Route not found - ${req.method} ${req.path}`);
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown handling
const shutdown = async () => {
  try {
    console.log('Starting graceful shutdown...');
    
    // Close server first
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
    console.log('Server closed');

    // Disconnect from database
    await disconnectDB();
    console.log('Graceful shutdown completed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle various shutdown signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  shutdown();
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdown();
});
