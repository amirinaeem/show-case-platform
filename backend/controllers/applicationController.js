import { application } from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import Application from '../models/applicationModel.js';
import mongoose from 'mongoose';

// @desc    Fetch all applications
// @route   GET /api/applications
// @access  Public
const getApplications = asyncHandler(async (req, res) => {
    const applications = await Application.find({});
    res.json(applications);
});

// @desc    Fetch a single application by ID
// @route   GET /api/applications/:id
// @access  Public
const getApplicationById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid application ID' });
    }

    const application = await Application.findById(req.params.id);

    if (application) {
        return res.json(application);
    } else {
        res.status(404);
        throw new Error('Application not found');
    }
});

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private/Admin
const createApplication = asyncHandler(async (req, res) => {

    const application = new Application({
        name: 'cyber solution',
        image:  '/images/sample/SHCAPL-logo.jpg',
        description: `If you want to keep all fields as required, you need to provide default values for them when creating a new application. Here's how you can update If you want to keep all fields as required, you need to provide default values for them when creating a new application. Here's how you can updateIf you want to keep all fields as required, you need to provide default values for them when creating a new application. Here's how you can updateIf you want to keep all fields as required, you need to provide default values for them when creating a new application. Here's how you can updateIf you want to keep all fields as required, you need to provide default values for them when creating a new application. Here's how you can update`,
        platform: 'Web',
        programmingLanguage:  'JavaScript',
        framework: 'React, Node.js',
        database: 'MongoDB',
        licenseType: 'Single License',
        price: 0,
        demoLink: '',
        documentationLink: '',
        githubRepo: '',
        supportDetails: { type: 'Email support', duration: '6 months' },
        features:  [ "Responsive design",
          "Product search and filtering",
          "Shopping cart and checkout"],
      previews: [{
        type: 'video',
        url: '/videos/video4.mov',
        caption: 'Full Demo'
        }],
        authorDetails:  {
            name: 'Sample Author',
            portfolioLink: '',
            lastUpdate: new Date().toISOString(),
            published: new Date().toISOString(),
            highResolution: false,
            compatibleBrowsers: ["IE11", "Firefox", "Safari", "Opera", "Chrome"],
            compatibleWith: '',
            documentation: '',
            layout: '',
        },
        tags: ["ecommerce", "react", "nodejs", "mongodb"],
        isAvailable:  false,
      user: req.user._id,
      likes: [],
      comments: [],
      shares: 0,
    });

    const createdApplication = await application.save();
    res.status(201).json(createdApplication);
});


// @desc    Update an application
// @route   GET /api/applications/:id
// @access  Private/Adin
const updateApplication = asyncHandler(async (req, res) => {
  const {
    name,
    image,
    description,
    platform,
    programmingLanguage,
    framework,
    database,
    licenseType,
    price,
    demoLink,
    documentationLink,
    githubRepo,
    supportDetails,
    features,
    previews,
    authorDetails,
    tags,
    isAvailable,
    likes,
    comments,
    shares,
    rating,
    numReviews,
    reviews,
    collaborators,
    versions,
    metrics,
  } = req.body;

  const application = await Application.findById(req.params.id);

  if (application) {
    // Update all fields
    application.name = name || application.name;
    application.image = image || application.image;
    application.description = description || application.description;
    application.platform = platform || application.platform;
    application.programmingLanguage = programmingLanguage || application.programmingLanguage;
    application.framework = framework || application.framework;
    application.database = database || application.database;
    application.licenseType = licenseType || application.licenseType;
    application.price = price || application.price;
    application.demoLink = demoLink || application.demoLink;
    application.documentationLink = documentationLink || application.documentationLink;
    application.githubRepo = githubRepo || application.githubRepo;
    application.supportDetails = supportDetails || application.supportDetails;
    application.features = features || application.features;
    application.previews = previews || application.previews;
    application.authorDetails = authorDetails || application.authorDetails;
    application.tags = tags || application.tags;
    application.isAvailable = isAvailable || application.isAvailable;
    application.likes = likes || application.likes;
    application.comments = comments || application.comments;
    application.shares = shares || application.shares;
    application.rating = rating || application.rating;
    application.numReviews = numReviews || application.numReviews;
    application.reviews = reviews || application.reviews;
    application.collaborators = collaborators || application.collaborators;
    application.versions = versions || application.versions;
    application.metrics = metrics || application.metrics;

    // Save the updated application
    const updatedApplication = await application.save();
    res.status(200).json(updatedApplication);
  } else {
    res.status(404);
    throw new Error('Application not found');
  }
});



// @desc    Delete an application
// @route   Delete/api/applications/:id
// @access  Private/Adin
const deleteApplication = asyncHandler(async (req, res) => {

  const application = await Application.findById(req.params.id);

  if (application) {
    await Application.deleteOne({ _id: application._id });
    res.status(200).json({message: 'Application Deleted'})
  } else {
    res.status(404);
    throw new Error('Application not found');
  }
});


// @desc    Like an application
// @route   POST /api/applications/:id/like
// @access  Private
const likeApplication = asyncHandler(async (req, res) => {
    const application = await Application.findById(req.params.id);
  
    if (application) {
      // Check if the user already liked the application
      if (application.likes.includes(req.user._id)) {
        return res.status(400).json({ message: 'You already liked this application' });
      }
  
      // Add the user to the likes array
      application.likes.push(req.user._id);
      await application.save();
      res.status(200).json({ message: 'Application liked successfully' });
    } else {
      res.status(404);
      throw new Error('Application not found');
    }
  });

// @desc    Add a comment to an application
// @route   POST /api/applications/:id/comment
// @access  Private
const addComment = asyncHandler(async (req, res) => {
    const { text } = req.body;
  
    const application = await Application.findById(req.params.id);
  
    if (application) {
      const comment = {
        user: req.user._id,
        text,
      };
  
      application.comments.push(comment);
      await application.save();
      res.status(201).json({ message: 'Comment added successfully', comment });
    } else {
      res.status(404);
      throw new Error('Application not found');
    }
});
  

// @desc    Share an application
// @route   POST /api/applications/:id/share
// @access  Public
const shareApplication = asyncHandler(async (req, res) => {
    const application = await Application.findById(req.params.id);
  
    if (application) {
      application.shares += 1;
      await application.save();
      res.status(200).json({ message: 'Application shared successfully' });
    } else {
      res.status(404);
      throw new Error('Application not found');
    }
  });



export { getApplications, getApplicationById, createApplication, likeApplication, addComment, shareApplication, updateApplication, deleteApplication };