import mongoose from "mongoose";
import User from "./userModel.js";

// Schema for Review (with rating)
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

// Schema for Reply (nested in Comment)
const replySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    avatar: { type: String, default: "" },
    reply: { 
      type: String, 
      required: true,
      minlength: 1,
      maxlength: 500
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
    status: {
      type: String,
      enum: ["active", "flagged", "deleted"],
      default: "active"
    }
  },
  { timestamps: true }
);

// Enhanced Schema for Comment
const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    avatar: { type: String, default: "" },
    comment: { 
      type: String, 
      required: true,
      minlength: 1,
      maxlength: 500
    },
    replies: [replySchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
    status: {
      type: String,
      enum: ["active", "flagged", "deleted"],
      default: "active"
    },
    pinned: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Schema for Collaborator
const collaboratorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "pending" 
    },
    message: { type: String },
  },
  { timestamps: true }
);

// Schema for Version
const versionSchema = new mongoose.Schema({
  versionNumber: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  changelog: [{ type: String, required: true }],
});

// Schema for Metrics
const metricsSchema = new mongoose.Schema({
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  purchases: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  repliesCount: { type: Number, default: 0 }
});

// Schema for Author Details
const authorDetailsSchema = new mongoose.Schema({
  name: { type: String },
  portfolioLink: { type: String },
  lastUpdate: { type: String },
  published: { type: String },
  highResolution: { type: Boolean, default: true },
  compatibleBrowsers: [{ type: String }],
  compatibleWith: { type: String },
  documentation: { type: String },
  layout: { type: String },
});

// Schema for Previews
const previewSchema = new mongoose.Schema({
  type: { type: String, enum: ["image", "video"], required: true },
  url: { type: String, required: true },
  caption: { type: String },
});

// Schema for Support Details
const supportDetailsSchema = new mongoose.Schema({
  type: { type: String, required: true },
  duration: { type: String, required: true },
});

// Main Application Schema
const applicationSchema = new mongoose.Schema(
  {
    // Basic Information
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },

    // Technical Details
    platform: { 
      type: String, 
      enum: ["Web", "Mobile", "Desktop"], 
      required: false 
    },
    programmingLanguage: { type: String, required: true },
    framework: { type: String, required: true },
    database: { type: String, required: true },

    // Licensing and Pricing
    licenseType: { 
      type: String, 
      enum: ["Single License", "Multi-License", "Open Source"], 
      required: true 
    },
    price: { type: Number, required: true },

    // Links and Support
    demoLink: { type: String },
    documentationLink: { type: String },
    githubRepo: { type: String },
    supportDetails: { type: supportDetailsSchema },

    // Features and Previews
    features: [{ type: String }],
    previews: [{ type: previewSchema }],

    // Reviews and Ratings
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],

    // Enhanced Comments System
    comments: [commentSchema],
    numComments: { type: Number, default: 0 },

    // Tags and Author Details
    tags: [{ type: String }],
    authorDetails: { type: authorDetailsSchema },

    // Collaborators and Versions
    collaborators: [collaboratorSchema],
    versions: [versionSchema],

    // Metrics
    metrics: { 
      type: metricsSchema, 
      default: { 
        views: 0, 
        likes: 0, 
        shares: 0, 
        downloads: 0, 
        purchases: 0,
        commentsCount: 0,
        repliesCount: 0
      } 
    },

    // User and Availability
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    isAvailable: { type: Boolean, default: true },

    // Likes
    likes: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      default: [] 
    }],

    // Shares
    shares: { type: Number, default: 0 },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
  }
);

// Virtuals
applicationSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

applicationSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

applicationSchema.virtual('repliesCount').get(function() {
  return this.comments.reduce((total, comment) => total + comment.replies.length, 0);
});

// Middleware for automatic counts
applicationSchema.pre('save', function(next) {
  // Update reviews count and rating
  if (this.isModified('reviews')) {
    this.numReviews = this.reviews.length;
    if (this.reviews.length > 0) {
      this.rating = this.reviews.reduce((sum, review) => sum + review.rating, 0) / this.reviews.length;
    } else {
      this.rating = 0;
    }
  }

  // Update comments metrics
  if (this.isModified('comments')) {
    this.numComments = this.comments.length;
    this.metrics.commentsCount = this.comments.length;
    this.metrics.repliesCount = this.comments.reduce((total, comment) => total + comment.replies.length, 0);
  }

  // Update replies count if any comment's replies are modified
  if (this.isModified('comments.replies')) {
    this.metrics.repliesCount = this.comments.reduce((total, comment) => total + comment.replies.length, 0);
  }

  next();
});

// Indexes
applicationSchema.index({ name: 'text', description: 'text', tags: 'text' });
commentSchema.index({ comment: 'text' });
replySchema.index({ reply: 'text' });

const Application = mongoose.model("Application", applicationSchema);

export default Application;