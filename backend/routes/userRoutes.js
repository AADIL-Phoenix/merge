const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/profile-photos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Sanitize filename
    const fileName = file.originalname.toLowerCase().replace(/[^a-z0-9.]/g, '-');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${fileName}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only allow 1 file per request
  },
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Define higher-level routes first
// Search users
router.get('/search', protect, async (req, res) => {
  console.log('Search route hit:', req.query);
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { 'readingPreferences.genres': { $regex: query, $options: 'i' } }
      ]
    }).select('name profilePhoto readingPreferences');

    console.log('Search results:', users.length);
    res.json(users);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get user profile by ID
router.get('/:id([0-9a-fA-F]{24})', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name profilePhoto')
      .populate('following', 'name profilePhoto');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get suggested users
router.get('/:id/suggested', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const suggestedUsers = await User.find({
      _id: { $ne: req.params.id },
      'readingPreferences.genres': { 
        $in: user.readingPreferences.genres 
      }
    })
    .select('name profilePhoto readingPreferences')
    .limit(5);

    res.json(suggestedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Follow user
router.post('/:id/follow', protect, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    currentUser.following.push(req.params.id);
    userToFollow.followers.push(req.user._id);

    await currentUser.save();
    await userToFollow.save();

    res.json({ message: 'Successfully followed user' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Unfollow user
router.post('/:id/unfollow', protect, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    currentUser.following = currentUser.following.filter(
      id => id.toString() !== req.params.id
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== req.user._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ message: 'Successfully unfollowed user' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user profile
router.patch('/:id', protect, async (req, res) => {
  try {
    console.log('Patch request params:', req.params);
    console.log('Current user:', req.user);

    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, bio } = req.body;
    console.log('Update data:', { name, bio });
    
    if (!name && !bio) {
      return res.status(400).json({ message: 'No update data provided' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio) user.bio = bio;

    await user.save();
    
    // Return the updated user without password
    const updatedUser = user.toObject();
    console.log('Updated user:', updatedUser);
    res.json(updatedUser);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update reading preferences
router.post('/:id/reading-preferences', protect, async (req, res) => {
  try {
    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { genre } = req.body;
    if (!genre) {
      return res.status(400).json({ message: 'Genre is required' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.readingPreferences.genres.includes(genre)) {
      user.readingPreferences.genres.push(genre);
      await user.save();
    }

    res.json(user.readingPreferences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update profile photo
router.post('/:id/photo', protect, upload.single('photo'), async (req, res) => {
  try {
    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old photo if it exists
    if (user.profilePhoto) {
      const oldPhotoPath = path.join(__dirname, '..', user.profilePhoto);
      try {
        // Only attempt to delete if file exists and is not the default profile photo
        if (fs.existsSync(oldPhotoPath) && !user.profilePhoto.includes('default-avatar')) {
          fs.unlinkSync(oldPhotoPath);
          console.log('Deleted old profile photo:', oldPhotoPath);
        }
      } catch (err) {
        console.error('Error deleting old profile photo:', err);
        // Continue with update even if delete fails
      }
    }

    // Set new profile photo path
    user.profilePhoto = `/uploads/profile-photos/${req.file.filename}`;
    await user.save();

    res.json({ 
      photoUrl: user.profilePhoto,
      message: 'Profile photo updated successfully'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
