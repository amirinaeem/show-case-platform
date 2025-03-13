import mongoose from "mongoose";
import User from "./userModel.js";

// Schema for Review (embedded in Application)
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true } // Enable timestamps for reviews
);

// Schema for Collaborator (embedded in Application)
const collaboratorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    message: { type: String },
  },
  { timestamps: true } // Enable timestamps for collaborators
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
  name: { type: String, required: false }, // Make optional
  portfolioLink: { type: String, required: false }, // Make optional
  lastUpdate: { type: String, required: false }, // Make optional
  published: { type: String, required: false }, // Make optional
  highResolution: { type: Boolean, default: true },
  compatibleBrowsers: [{ type: String, required: false }], // Make optional
  compatibleWith: { type: String, required: false }, // Make optional
  documentation: { type: String, required: false }, // Make optional
  layout: { type: String, required: false }, // Make optional
});

// Schema for Previews (embedded in Application)
const previewSchema = new mongoose.Schema({
  type: { type: String, enum: ["image", "video"], required: true },
  url: { type: String, required: true },
  caption: { type: String, required: true },
});

// Schema for Support Details (embedded in Application)
const supportDetailsSchema = new mongoose.Schema({
  type: { type: String, required: true },
  duration: { type: String, required: true },
});

// Schema for Application
const applicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    platform: { type: String, enum: ["Web", "Mobile", "Desktop"], required: true },
    programmingLanguage: { type: String, required: true },
    framework: { type: String, required: true },
    database: { type: String, required: true },
    licenseType: { type: String, enum: ["Single License", "Multi-License", "Open Source"], required: true },
    price: { type: Number, required: true },
    demoLink: { type: String, required: false }, // Make optional
    documentationLink: { type: String, required: false }, // Make optional
    githubRepo: { type: String, required: false }, // Make optional
    supportDetails: { type: supportDetailsSchema, required: false }, // Make optional
    features: [{ type: String, required: false }], // Make optional
    previews: [{ type: previewSchema, required: false }], // Make optional
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [{ type: reviewSchema }],
    tags: [{ type: String, required: false }], // Make optional
    authorDetails: { type: authorDetailsSchema, required: false }, // Make optional
    collaborators: [{ type: collaboratorSchema }],
    versions: [{ type: versionSchema }],
    metrics: { type: metricsSchema, default: { views: 0, likes: 0, shares: 0, downloads: 0, purchases: 0 } },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isAvailable: { type: Boolean, default: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who liked the application
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who commented
        text: { type: String, required: true }, // Comment text
        createdAt: { type: Date, default: Date.now }, // Timestamp
      },
    ],
    shares: { type: Number, default: 0 }, // Number of shares
  },

  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;



