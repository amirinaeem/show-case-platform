// controllers/messageController.js
import asyncHandler from '../middleware/asyncHandler.js';
import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Get all conversations for a user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    'participants.user': req.user._id
  })
  .populate('participants.user', 'name email avatar')
  .populate('lastMessage')
  .sort('-updatedAt');

  res.json(conversations);
});

// @desc    Create a new conversation
// @route   POST /api/messages/conversations
// @access  Private
const createConversation = asyncHandler(async (req, res) => {
  const { participants, isGroup, groupName, groupPhoto } = req.body;
  
  // Ensure participants includes the current user
  const allParticipants = [
    ...participants.map(id => ({ user: id })),
    { user: req.user._id }
  ];

  const conversation = await Conversation.create({
    participants: allParticipants,
    isGroup,
    groupName,
    groupPhoto,
    groupAdmin: isGroup ? req.user._id : null
  });

  res.status(201).json(conversation);
});

// @desc    Get messages in a conversation
// @route   GET /api/messages/conversations/:conversationId/messages
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const messages = await Message.find({ conversation: conversationId })
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('sender', 'name avatar')
    .populate('replyTo');

  res.json(messages.reverse()); // Return in chronological order
});

// @desc    Send a message
// @route   POST /api/messages/conversations/:conversationId/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { content, attachments, replyTo } = req.body;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Check if user is a participant
  const isParticipant = conversation.participants.some(
    p => p.user.toString() === req.user._id.toString()
  );
  if (!isParticipant) {
    res.status(403);
    throw new Error('Not authorized to send message in this conversation');
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: req.user._id,
    content,
    attachments,
    replyTo
  });

  // Update conversation's last message and timestamp
  conversation.updatedAt = Date.now();
  await conversation.save();

  // Populate sender info before sending response
  const populatedMessage = await Message.populate(message, {
    path: 'sender',
    select: 'name avatar'
  });

  res.status(201).json(populatedMessage);
});

// @desc    Upload attachment
// @route   POST /api/messages/upload-attachment
// @access  Private
const uploadAttachment = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  // Upload to Cloudinary or your storage service
  const result = await uploadToCloudinary(req.file.path, {
    folder: 'message-attachments',
    resource_type: 'auto'
  });

  res.json({
    url: result.secure_url,
    type: result.resource_type,
    size: result.bytes,
    duration: result.duration // For audio/video
  });
});

// @desc    Edit a message
// @route   PUT /api/messages/:messageId
// @access  Private
const editMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  const message = await Message.findOneAndUpdate(
    { _id: messageId, sender: req.user._id },
    { 
      content,
      isEdited: true,
      editedAt: Date.now()
    },
    { new: true }
  ).populate('sender', 'name avatar');

  if (!message) {
    res.status(404);
    throw new Error('Message not found or not authorized');
  }

  io.to(message.conversation.toString()).emit('messageEdited', message);
  res.json(message);
});

// @desc    Delete a message
// @route   DELETE /api/messages/:messageId
// @access  Private
const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findOneAndUpdate(
    { _id: messageId, sender: req.user._id },
    { $addToSet: { deletedFor: req.user._id } },
    { new: true }
  );

  if (!message) {
    res.status(404);
    throw new Error('Message not found or not authorized');
  }

  io.to(message.conversation.toString()).emit('messageDeleted', {
    messageId: message._id,
    deletedFor: message.deletedFor
  });

  res.json({ message: 'Message deleted' });
});

export {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  uploadAttachment,
  editMessage,
  deleteMessage
}
