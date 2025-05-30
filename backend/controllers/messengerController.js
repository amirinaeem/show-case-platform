// controllers/messengerController.js
import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';

const getFriends = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching friends...');
    const friends = await User.find({}).select('-password');
    
    
    res.status(200).json({ 
      success: true,
      friends 
    });
    
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
});

export { getFriends };