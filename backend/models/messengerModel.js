import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, default: 'image' },
  fileType: { type: String, required: true },
  fileName: { type: String, required: true },
  cloudinaryId: { type: String, required: true }
}, { _id: false });  // Important: Disable _id for subdocuments

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
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
    files: {
      type: [fileSchema],  // Use the defined fileSchema
      default: []
    }
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'seen'],
    default: 'sent'
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;