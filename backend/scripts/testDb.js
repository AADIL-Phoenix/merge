const mongoose = require('mongoose');
const User = require('../models/User');

const testDbConnection = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/bookclub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');

    // Create a test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    // Save the user
    await testUser.save();
    console.log('Test user created successfully');

    // Verify we can retrieve the user
    const foundUser = await User.findOne({ email: 'test@example.com' });
    console.log('Retrieved user:', {
      name: foundUser.name,
      email: foundUser.email,
      id: foundUser._id
    });

    // Clean up - remove test user
    await User.deleteOne({ email: 'test@example.com' });
    console.log('Test user removed');

  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the test
console.log('Starting database connection test...');
testDbConnection();
