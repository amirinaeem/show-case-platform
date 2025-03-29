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
// @route   PUT /api/applications/:id
// @access  Private/Admin
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

    const updatedApplication = await application.save();
    res.status(200).json(updatedApplication);
  } else {
    res.status(404);
    throw new Error('Application not found');
  }
});

// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Private/Admin
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
// @route   POST /api/applications/:id/reviews
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
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    application.reviews.push(review);
    application.numReviews = application.reviews.length;

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

// @desc    Get top rated applications
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
    if (application.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'You already liked this application' });
    }

    application.likes.push(req.user._id);
    application.metrics.likes = application.likes.length;
    await application.save();
    res.status(200).json({ 
      message: 'Application liked successfully',
      likesCount: application.likes.length 
    });
  } else {
    res.status(404);
    throw new Error('Application not found');
  }
});

// @desc    Add comment to application
// @route   POST /api/applications/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;

  if (!comment?.trim()) {
    res.status(400);
    throw new Error('Comment text is required');
  }

  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  const newComment = {
    user: req.user._id,
    name: req.user.name,
    avatar: req.user.avatar || '',
    comment,
  };

  application.comments.push(newComment);
  await application.save();

  const savedComment = application.comments[application.comments.length - 1];

  res.status(201).json({
    message: "Comment added successfully",
    comment: savedComment,
    metrics: {
      commentsCount: application.metrics.commentsCount,
    }
  });
});

// @desc    Edit a comment
// @route   PUT /api/applications/:id/comments
// @access  Private
const editComment = asyncHandler(async (req, res) => {
  const { commentId, newText } = req.body;

  if (!newText?.trim()) {
    res.status(400);
    throw new Error('Comment text is required');
  }

  const application = await Application.findOneAndUpdate(
    { 
      _id: req.params.id,
      'comments._id': commentId,
      'comments.user': req.user._id
    },
    { 
      $set: { 
        'comments.$.comment': newText,
        'comments.$.isEdited': true,
        'comments.$.editedAt': Date.now()
      } 
    },
    { new: true }
  );

  if (!application) {
    res.status(404);
    throw new Error('Comment not found or unauthorized');
  }

  const updatedComment = application.comments.id(commentId);
  res.status(200).json({
    message: "Comment updated",
    comment: updatedComment
  });
});

// @desc    Delete a comment
// @route   DELETE /api/applications/:id/comments
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.body;

  const application = await Application.findOneAndUpdate(
    { 
      _id: req.params.id,
      'comments._id': commentId,
      $or: [
        { 'comments.user': req.user._id },
        { user: req.user._id }
      ]
    },
    { $pull: { comments: { _id: commentId } } },
    { new: true }
  );

  if (!application) {
    res.status(404);
    throw new Error('Comment not found or unauthorized');
  }

  res.status(200).json({
    message: "Comment deleted",
    metrics: {
      commentsCount: application.metrics.commentsCount
    }
  });
});

// @desc    Add reply to comment
// @route   POST /api/applications/:id/comments/reply
// @access  Private
const addReply = asyncHandler(async (req, res) => {
  const { reply } = req.body;
  const { id: appId, commentId } = req.params;

  if (!reply?.trim()) {
    res.status(400);
    throw new Error('Reply text is required');
  }

  const application = await Application.findByIdAndUpdate(
    appId,
    {
      $push: {
        'comments.$[comment].replies': {
          user: req.user._id,
          name: req.user.name,
          avatar: req.user.avatar || '',
          reply,
          createdAt: new Date(), // Store as Date object
          isEdited: false
        }
      }
    },
    {
      arrayFilters: [{ 'comment._id': commentId }],
      new: true
    }
  );

  if (!application) {
    res.status(404);
    throw new Error('Application or comment not found');
  }

  const parentComment = application.comments.id(commentId);
  const newReply = parentComment.replies[parentComment.replies.length - 1];

  res.status(201).json({
    message: "Reply added successfully",
    reply: newReply,
    metrics: {
      repliesCount: application.metrics.repliesCount
    }
  });
});

// @desc    Share an application
// @route   POST /api/applications/:id/share
// @access  Public
const shareApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (application) {
    application.shares += 1;
    application.metrics.shares = application.shares;
    await application.save();
    res.status(200).json({ 
      message: 'Application shared successfully',
      shares: application.shares 
    });
  } else {
    res.status(404);
    throw new Error('Application not found');
  }
});

export { 
  getApplications, 
  getApplicationById, 
  createApplication, 
  updateApplication, 
  deleteApplication, 
  createApplicationReview, 
  getTopApplications, 
  likeApplication, 
  addComment, 
  editComment, 
  deleteComment, 
  addReply, 
  shareApplication 
};