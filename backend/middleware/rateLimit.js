const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000, // default 15 minutes
  max: process.env.RATE_LIMIT_MAX, // limit each IP to 100 requests per windowMs
  message: {
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
