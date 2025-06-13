// backend/models/messageModel.js
import mongoose from 'mongoose';


const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {  // Add this new field
    type: String,
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    text: {
      type: String,
      default: ''
    },
    files: [{
      url: String,
      type: String,
      fileType: String,
      fileName: String,
      cloudinaryId: String,
    }]
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'seen'],
    default: 'sent'
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema, 'messages');

export default Message;