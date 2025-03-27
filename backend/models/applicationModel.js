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

// Schema for Comment (without rating)
const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true }, // Changed to true
    comment: { 
      type: String, 
      required: true, // Changed to true
      minlength: 1, // Ensure not empty
      maxlength: 500 // Prevent overly long comments
    },
  },
  { timestamps: true }
);

// Schema for Collaborator (embedded in Application)
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

// Schema for Version (embedded in Application)
const versionSchema = new mongoose.Schema({
  versionNumber: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  changelog: [{ type: String, required: true }],
});

// Schema for Metrics (embedded in Application)
const metricsSchema = new mongoose.Schema({
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  purchases: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 } // Added for comments tracking
});

// Schema for Author Details (embedded in Application)
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

// Schema for Previews (embedded in Application)
const previewSchema = new mongoose.Schema({
  type: { type: String, enum: ["image", "video"], required: true },
  url: { type: String, required: true },
  caption: { type: String },
});

// Schema for Support Details (embedded in Application)
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

    // Comments (separate from reviews)
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
        commentsCount: 0
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

// Virtual for likes count
applicationSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Virtual for comments count (alternative to storing in metrics)
applicationSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

// Update metrics when comments are added
applicationSchema.pre('save', function(next) {
  if (this.isModified('comments')) {
    this.metrics.commentsCount = this.comments.length;
    this.numComments = this.comments.length;
  }
  next();
});

// Update rating and numReviews when reviews are modified
applicationSchema.pre('save', function(next) {
  if (this.isModified('reviews')) {
    this.numReviews = this.reviews.length;
    if (this.reviews.length > 0) {
      this.rating = this.reviews.reduce((sum, review) => sum + review.rating, 0) / this.reviews.length;
    } else {
      this.rating = 0;
    }
  }
  next();
});

// Create the Application model
const Application = mongoose.model("Application", applicationSchema);

export default Application;