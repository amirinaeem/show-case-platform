// models/messageModel.js
import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['image', 'video', 'audio', 'file', 'location'], 
    required: true 
  },
  name: { type: String },
  size: { type: Number },
  duration: { type: Number } // For audio/video
});

const messageSchema = new mongoose.Schema({
  conversation: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Conversation', 
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { type: String },
  attachments: [attachmentSchema],
  readBy: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  isEdited: { type: Boolean, default: false },
  editedAt: { type: Date },
  deletedFor: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  replyTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Message' 
  },
  reactions: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    emoji: { type: String }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

messageSchema.index({ content: 'text' });

const Message = mongoose.model('Message', messageSchema);
export default Message;