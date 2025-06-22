// controllers/messengerController.js
import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import Message from '../models/messengerModel.js';




// @desc    Get friends list
// @route   GET /api/messenger/friends
// @access  Private
const getFriends = asyncHandler(async (req, res) => {
  try {
    const friends = await User.find({ _id: { $ne: req.user._id } }).select('-password');
    res.status(200).json(friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// @desc    Send a message
// @route   POST /api/messenger/send-message
// @access  Private
// controllers/messengerController.js

const messageSendDB = asyncHandler(async (req, res) => {
  const { receiverId, text = '', files = [] } = req.body;
  const senderId = req.user._id;
  const senderName = req.user.name;

  try {
    const messageData = {
      senderId,
      senderName,
      receiverId,
      message: {
        text
      }
    };

    if (files.length > 0) {
      messageData.message.files = files.map(file => ({
        url: file.url,
        type: file.type || file.mimetype || 'file',
        fileType: file.fileType || file.mimetype || 'application/octet-stream',
        fileName: file.fileName || file.originalname || 'file',
        cloudinaryId: file.public_id || file.cloudinaryId
      }));
    }

    const newMessage = await Message.create(messageData);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});


// @desc    Get message
// @route   GET /api/messenger/get-message:id
// @access  Private
// controllers/messengerController.js
const getMessage = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id; 
  const selectedFdId = req.params.id;
  
  try {
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: selectedFdId },
        { senderId: selectedFdId, receiverId: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});




export { getFriends, messageSendDB, getMessage };