// controllers/messengerController.js
import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import Message from '../models/messengerModel.js';
import { uploadToCloudinary } from '../utils/cloudinaryHelpers.js';
import fs from 'fs';
import path from 'path'



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
  const { receiverId, text } = req.body;
  const senderId = req.user._id;
  const senderName = req.user.name; 

  try {
    const newMessage = await Message.create({
      senderId,
      senderName, 
      receiverId,
      message: {
        text: text
      }
    });

    
    res.status(201).json({
      _id: newMessage._id,
      senderId: newMessage.senderId,
      senderName: newMessage.senderName, 
      receiverId: newMessage.receiverId,
      message: newMessage.message,
      status: newMessage.status,
      createdAt: newMessage.createdAt
    });
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


// @desc    Send a file message (image or other attachment)
// @route   POST /api/messenger/send-file-message
// @access  Private
const sendFileMessage = asyncHandler(async (req, res) => {
  console.log('Files received:', req.files); // Should show files now

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  try {
    const uploadedFiles = [];
    
    // Process each file
    for (const file of req.files) {
      console.log(`Uploading ${file.originalname} to Cloudinary...`);
      
      // Upload to Cloudinary
      const result = await uploadToCloudinary(file.path, 'messenger_attachments');
      
      // Add to uploaded files array
      uploadedFiles.push({
        url: result.secure_url,
        type: result.resource_type,
        fileType: path.extname(file.originalname).replace('.', ''),
        fileName: file.originalname,
        cloudinaryId: result.public_id
      });

      // Clean up temp file
      fs.unlinkSync(file.path);
    }

    // Create message in database
    const newMessage = await Message.create({
      senderId: req.user._id,
      senderName: req.body.senderName,
      receiverId: req.body.receiverId,
      message: {
        files: uploadedFiles
      }
    });

    res.status(201).json(newMessage);

  } catch (error) {
    console.error('File upload error:', error);
    
    // Clean up any temp files if error occurred
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    
    res.status(500).json({
      message: 'File upload failed',
      error: error.message
    });
  }
});

export { getFriends, messageSendDB, getMessage, sendFileMessage };