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
  name: { type: String, required: true },
  portfolioLink: { type: String, required: true },
  lastUpdate: { type: String, required: true },
  published: { type: String, required: true },
  highResolution: { type: Boolean, default: true },
  compatibleBrowsers: [{ type: String, required: true }],
  compatibleWith: { type: String, required: true },
  documentation: { type: String, required: true },
  layout: { type: String, required: true },
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
    demoLink: { type: String, required: true },
    documentationLink: { type: String, required: true },
    githubRepo: { type: String, required: true },
    supportDetails: { type: supportDetailsSchema, required: true },
    features: [{ type: String, required: true }],
    previews: [{ type: previewSchema, required: true }],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [{ type: reviewSchema }],
    tags: [{ type: String, required: true }],
    authorDetails: { type: authorDetailsSchema, required: true },
    collaborators: [{ type: collaboratorSchema }],
    versions: [{ type: versionSchema }],
    metrics: { type: metricsSchema, default: { views: 0, likes: 0, shares: 0, downloads: 0, purchases: 0 } },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
    isAvailable: { type: Boolean, default: true }, // Add this field to indicate availability
  },
  { timestamps: true } // Enable timestamps for the application
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;