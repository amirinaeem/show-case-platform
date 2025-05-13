// models/conversationModel.js
import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  lastSeen: { type: Date, default: Date.now },
  isTyping: { type: Boolean, default: false }
});

const conversationSchema = new mongoose.Schema({
  participants: [participantSchema],
  isGroup: { type: Boolean, default: false },
  groupName: { type: String },
  groupPhoto: { type: String },
  groupAdmin: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

conversationSchema.virtual('unreadCount', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'conversation',
  count: true
});

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;