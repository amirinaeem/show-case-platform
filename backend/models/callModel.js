import mongoose from 'mongoose';

const callSchema = new mongoose.Schema({
  participants: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    joinedAt: { type: Date, default: Date.now },
    leftAt: { type: Date },
    status: {
      type: String,
      enum: ['calling', 'joined', 'declined', 'missed'],
      default: 'calling'
    }
  }],
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['audio', 'video'],
    required: true
  },
  status: {
    type: String,
    enum: ['initiated', 'ongoing', 'completed', 'declined'],
    default: 'initiated'
  },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  duration: { type: Number }, // in seconds
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  }
}, {
  timestamps: true
});

const Call = mongoose.model('Call', callSchema);
export default Call;