import asyncHandler from '../middleware/asyncHandler.js';
import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';
import Call from '../models/callModel.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

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
  conversation.lastMessage = message._id;
  conversation.updatedAt = Date.now();
  await conversation.save();

  // Populate sender info before sending response
  const populatedMessage = await Message.populate(message, {
    path: 'sender',
    select: 'name avatar'
  });

  // Emit socket event
  req.app.get('io').to(conversationId).emit('newMessage', populatedMessage);

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

  // Emit socket event
  req.app.get('io').to(message.conversation.toString()).emit('messageEdited', message);
  
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

  // Emit socket event
  req.app.get('io').to(message.conversation.toString()).emit('messageDeleted', {
    messageId: message._id,
    deletedFor: message.deletedFor
  });

  res.json({ message: 'Message deleted' });
});

// @desc    React to a message
// @route   POST /api/messages/:messageId/react
// @access  Private
const reactToMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { emoji } = req.body;

  const message = await Message.findOneAndUpdate(
    { _id: messageId },
    { 
      $pull: { reactions: { user: req.user._id } },
      $push: { reactions: { user: req.user._id, emoji } }
    },
    { new: true }
  ).populate('reactions.user', 'name avatar');

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  // Emit socket event
  req.app.get('io').to(message.conversation.toString()).emit('messageReacted', {
    messageId: message._id,
    reactions: message.reactions
  });

  res.json(message);
});

// @desc    Mark message as read
// @route   POST /api/messages/:messageId/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findByIdAndUpdate(
    messageId,
    { $addToSet: { readBy: req.user._id } },
    { new: true }
  );

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  res.json(message);
});

// @desc    Start a call
// @route   POST /api/messages/calls/start
// @access  Private
const startCall = asyncHandler(async (req, res) => {
  const { conversationId, type, participants } = req.body;

  const call = await Call.create({
    participants: [
      { user: req.user._id, status: 'joined' },
      ...participants.map(userId => ({ user: userId, status: 'calling' }))
    ],
    initiator: req.user._id,
    type,
    status: 'initiated',
    conversation: conversationId
  });

  // Emit socket event to participants
  participants.forEach(userId => {
    req.app.get('io').to(userId.toString()).emit('incomingCall', call);
  });

  res.status(201).json(call);
});

// @desc    End a call
// @route   POST /api/messages/calls/:callId/end
// @access  Private
const endCall = asyncHandler(async (req, res) => {
  const { callId } = req.params;
  const { duration } = req.body;

  const call = await Call.findByIdAndUpdate(
    callId,
    { 
      status: 'completed',
      endedAt: Date.now(),
      duration,
      $set: { 'participants.$[].status': 'completed' }
    },
    { new: true }
  );

  if (!call) {
    res.status(404);
    throw new Error('Call not found');
  }

  // Emit socket event to participants
  req.app.get('io').to(call.conversation.toString()).emit('callEnded', call);

  res.json(call);
});

// @desc    Get call status
// @route   GET /api/messages/calls/:callId/status
// @access  Private
const getCallStatus = asyncHandler(async (req, res) => {
  const { callId } = req.params;

  const call = await Call.findById(callId)
    .populate('participants.user', 'name avatar')
    .populate('initiator', 'name avatar');

  if (!call) {
    res.status(404);
    throw new Error('Call not found');
  }

  res.json(call);
});

export {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  uploadAttachment,
  editMessage,
  deleteMessage,
  reactToMessage,
  markAsRead,
  startCall,
  endCall,
  getCallStatus
};