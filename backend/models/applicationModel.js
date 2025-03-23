import mongoose from "mongoose";
import User from "./userModel.js";

// Schema for Review (embedded in Application)
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true }, 
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true } 
);

// Schema for Collaborator (embedded in Application)
const collaboratorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
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
});

// Schema for Author Details (embedded in Application)
const authorDetailsSchema = new mongoose.Schema({
  name: { type: String, required: false }, 
  portfolioLink: { type: String, required: false }, 
  lastUpdate: { type: String, required: false }, 
  published: { type: String, required: false }, 
  highResolution: { type: Boolean, default: true },
  compatibleBrowsers: [{ type: String, required: false }], 
  compatibleWith: { type: String, required: false }, 
  documentation: { type: String, required: false }, 
  layout: { type: String, required: false }, 
});

// Schema for Previews (embedded in Application)
const previewSchema = new mongoose.Schema({
  type: { type: String, enum: ["image", "video"], required: true },
  url: { type: String, required: true },
  caption: { type: String, required: false }, 
});

// Schema for Support Details (embedded in Application)
const supportDetailsSchema = new mongoose.Schema({
  type: { type: String, required: true },
  duration: { type: String, required: true },
});

// Schema for Application
const applicationSchema = new mongoose.Schema(
  {
    // Basic Information
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },

    // Technical Details
    platform: { type: String, enum: ["Web", "Mobile", "Desktop"], required: false }, 
    programmingLanguage: { type: String, required: true },
    framework: { type: String, required: true },
    database: { type: String, required: true },

    // Licensing and Pricing
    licenseType: { type: String, enum: ["Single License", "Multi-License", "Open Source"], required: true },
    price: { type: Number, required: true },

    // Links and Support
    demoLink: { type: String, required: false }, 
    documentationLink: { type: String, required: false }, 
    githubRepo: { type: String, required: false }, 
    supportDetails: { type: supportDetailsSchema, required: false }, 

    // Features and Previews
    features: [{ type: String, required: false }], 
    previews: [{ type: previewSchema, required: false }], 

    // Reviews and Ratings
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [{ type: reviewSchema, default: [] }],

    // Tags and Author Details
    tags: [{ type: String, required: false }], 
    authorDetails: { type: authorDetailsSchema, required: false }, 

    // Collaborators and Versions
    collaborators: [{ type: collaboratorSchema, default: [] }],
    versions: [{ type: versionSchema, default: [] }],

    // Metrics
    metrics: { type: metricsSchema, default: { views: 0, likes: 0, shares: 0, downloads: 0, purchases: 0 } },

    // User and Availability
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isAvailable: { type: Boolean, default: true },

    // Likes and Comments
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Shares
    shares: { type: Number, default: 0 },
  },
  { timestamps: true } 
);

// Create the Application model
const Application = mongoose.model("Application", applicationSchema);

export default Application;