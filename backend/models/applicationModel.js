import mongoose from "mongoose";


// Schema for Review (with rating)
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, default: 'John Doe' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

// Reply Schema
const replySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    avatar: { type: String, default: "/images/logo.jpg" },
    reply: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 5000,
      trim: true,
    },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who is being replied to
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
    isOptimistic: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['active', 'flagged', 'deleted'],
      default: 'active',
    },
    linkPreview: {
      url: String,
      title: String,
      description: String,
      image: String,
    },
  },
  { timestamps: true }
);

// Comment Schema
const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    avatar: { type: String, default: "/images/logo.jpg" },
    comment: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 5000,
      trim: true,
    },
    replies: [replySchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
    isOptimistic: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['active', 'flagged', 'deleted'],
      default: 'active',
    },
    pinned: { type: Boolean, default: false },
    linkPreview: {
      url: String,
      title: String,
      description: String,
      image: String,
    },
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

// Enhanced Schema for Metrics
const metricsSchema = new mongoose.Schema({
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  purchases: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  repliesCount: { type: Number, default: 0 },
  commentLikes: { type: Number, default: 0 } // New metric for comment likes
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
  duration: { type: Number }, // in seconds
  size: { type: Number }, // in bytes
  format: { type: String }, // mp4, mov, etc.
  thumbnail: { type: String } // URL to generated thumbnail
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

    // Tags and Author Details
    tags: [{ type: String }],
    authorDetails: { type: authorDetailsSchema },

    // Collaborators and Versions
    collaborators: [collaboratorSchema],
    versions: [versionSchema],

    // Metrics
    metrics: { 
      type: metricsSchema, 
      default: () => ({
        views: 0, 
        likes: 0, 
        shares: 0, 
        downloads: 0, 
        purchases: 0,
        commentsCount: 0,
        repliesCount: 0,
        commentLikes: 0
      }) 
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
  return this.comments.reduce((total, comment) => total + (comment.replies?.length || 0), 0);
});

// Middleware for automatic counts and metrics
applicationSchema.pre('save', function(next) {
  // Update reviews count and rating
  if (this.isModified('reviews')) {
    this.numReviews = this.reviews.length;
    this.rating = this.reviews.length > 0 
      ? this.reviews.reduce((sum, review) => sum + review.rating, 0) / this.reviews.length
      : 0;
  }

  // Update comments metrics
  if (this.isModified('comments')) {
    this.metrics.commentsCount = this.comments.length;
    this.metrics.repliesCount = this.comments.reduce(
      (total, comment) => total + (comment.replies?.length || 0), 0
    );
  }

  // Update comment likes count
  if (this.isModified('comments.likes') || this.isModified('comments.replies.likes')) {
    let commentLikes = 0;
    this.comments.forEach(comment => {
      commentLikes += comment.likes?.length || 0;
      comment.replies?.forEach(reply => {
        commentLikes += reply.likes?.length || 0;
      });
    });
    this.metrics.commentLikes = commentLikes;
  }

  // Update likes count
  if (this.isModified('likes')) {
    this.metrics.likes = this.likes.length;
  }

  next();
});

// Indexes
applicationSchema.index({ name: 'text', description: 'text', tags: 'text' });
applicationSchema.index({ 'comments.comment': 'text', 'comments.replies.reply': 'text' });
applicationSchema.index({ 'metrics.likes': -1 }); // For sorting by popularity
applicationSchema.index({ 'metrics.commentsCount': -1 }); // For sorting by engagement

const Application = mongoose.model("Application", applicationSchema);

export default Application;