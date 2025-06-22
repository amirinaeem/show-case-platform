import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    avatar: { 
      type: String, 
      default: "/SHCAPL-logo.jpg" 
    },
    password: { 
      type: String, 
      required: true,
      select: false,
    },
    isAdmin: { 
      type: Boolean, 
      default: false 
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'away'],
      default: 'offline'
    },
    isOnline: { 
      type: Boolean, 
      default: false 
    },
    lastSeen: { 
      type: Date,
      default: null 
    },
    socketId: { 
      type: String,
      default: null 
    }
  },
  { 
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.password; // Remove password when returning as JSON
        return ret;
      }
    }
  }
);

// Password comparison method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update status when user goes offline
userSchema.methods.setOffline = function() {
  this.status = 'offline';
  this.isOnline = false;
  this.lastSeen = new Date();
  return this.save();
};

// Update status when user comes online
userSchema.methods.setOnline = function(socketId) {
  this.status = 'online';
  this.isOnline = true;
  this.socketId = socketId;
  this.lastSeen = null;
  return this.save();
};

// Keep this index; it's not redundant
userSchema.index({ status: 1 });

const User = mongoose.model("User", userSchema);
export default User;
