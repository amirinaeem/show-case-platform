
import asyncHandler from '../middleware/asyncHandler.js';
import Application from '../models/applicationModel.js';
import mongoose from 'mongoose';

// @desc    Fetch all applications
// @route   GET /api/applications
// @access  Public
const getApplications = asyncHandler(async (req, res) => {
  const pageSize = 5;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};
  const count = await Application.countDocuments({...keyword});
  const applications = await Application.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1));
  res.json({applications, page, pages: Math.ceil(count / pageSize)})
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


// @desc    Create a review
// @route   PUT/api/applications/:id
// @access  Private
const createApplicationReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const application = await Application.findById(req.params.id);

  if (application) {
    const alreadyReviewed = application.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Application already reviewed");
    }

    const review = {
      user: req.user._id,
      name: req.user.name, // Ensure this matches the schema
      rating: Number(rating),
      comment,
    };

    application.reviews.push(review);
    application.numReviews = application.reviews.length;

    // Calculate the new average rating
    application.rating =
      application.reviews.reduce((acc, review) => acc + review.rating, 0) /
      application.reviews.length;

    await application.save();
    res.status(201).json({ message: "Review added successfully" });
  } else {
    res.status(404);
    throw new Error("Application not found");
  }
});


// @desc    Get top rated products
// @route   GET /api/applications/top
// @access  Public
const getTopApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({}).sort({ rating: -1 }).limit(3);
  res.status(200).json(applications)
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

// @desc    add comment
// @route   PUT/api/applications/:id
// @access  public
const addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;

  if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
    res.status(400);
    throw new Error('Comment text is required');
  }

  const application = await Application.findById(req.params.id);

  if (application) {
    const newComment = {
      user: req.user._id,
      name: req.user.name, 
      comment,
    };

    application.comments.push(newComment);
    
    await application.save();

    res.status(201).json({ 
      message: "Comment added successfully", 
      comment: {
        _id: newComment._id,
        user: newComment.user,
        name: newComment.name,
        comment: newComment.comment, // Make sure this is 'comment' not 'text'
        createdAt: newComment.createdAt
      }
    });

  } else {
    res.status(404);
    throw new Error("Application not found");
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



export { getApplications, getApplicationById, createApplication, likeApplication, addComment, shareApplication, updateApplication, deleteApplication, createApplicationReview, getTopApplications };