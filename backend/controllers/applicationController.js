import asyncHandler from '../middleware/asyncHandler.js';
import Application from '../models/applicationModel.js';
import mongoose from 'mongoose';

// Helper functions
const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
};

const validateCommentText = (comment) => {
  if (!comment || typeof comment !== 'string' || !comment.trim()) {
    throw new Error('comment content is required and must be a non-empty string');
  }
  if (comment.length > 500) {
    throw new Error('Comment/reply cannot exceed 500 characters');
  }
};

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
  validateObjectId(req.params.id);
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
        metrics: {
          commentsCount: 0,
          repliesCount: 0,
          commentLikes: 0,
          shares: 0
        }
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
    const likeIndex = application.likes.indexOf(req.user._id);
    
    if (likeIndex === -1) {
      application.likes.push(req.user._id);
    } else {
      application.likes.splice(likeIndex, 1);
    }
    
    application.metrics.likes = application.likes.length;
    await application.save();
    res.status(200).json({ 
      message: 'Application like updated',
      likes: application.likes,
      metrics: application.metrics
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
  const appId = req.params.id;

  if (!comment || !comment.trim()) {
    res.status(400);
    throw new Error("Comment text is required");
  }

  const application = await Application.findById(appId);
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  const newComment = {
    _id: new mongoose.Types.ObjectId(), // Ensure we have an ID
    user: req.user._id,
    name: req.user.name,
    avatar: req.user.avatar || '/default-avatar.png',
    comment: comment.trim(),
    replies: [],
    likes: [],
    isEdited: false,
    isOptimistic: false,
    status: "active",
    pinned: false,
    createdAt: new Date()
  };

  application.comments.unshift(newComment);
  
  // Initialize metrics if they don't exist
  if (!application.metrics) {
    application.metrics = { commentsCount: 0 };
  }
  application.metrics.commentsCount = application.comments.length;
  
  await application.save();

  res.status(201).json({
    message: "Comment added successfully",
    comment: newComment,
    metrics: {
      commentsCount: application.metrics.commentsCount
    }
  });
});

// @desc    Edit a comment
// @route   PUT /api/applications/:id/comments/:commentId
// @access  Private
const editComment = asyncHandler(async (req, res) => {
  validateObjectId(req.params.id);
  validateObjectId(req.params.commentId);
  validateCommentText(req.body.newText);

  const application = await Application.findOneAndUpdate(
    { 
      _id: req.params.id,
      'comments._id': req.params.commentId,
      'comments.user': req.user._id
    },
    { 
      $set: { 
        'comments.$.comment': req.body.newText,
        'comments.$.isEdited': true,
        'comments.$.editedAt': new Date()
      } 
    },
    { new: true }
  );

  if (!application) {
    res.status(404);
    throw new Error('Comment not found or unauthorized');
  }

  const updatedComment = application.comments.id(req.params.commentId);
  res.status(200).json({
    message: "Comment updated",
    comment: updatedComment.toObject()
  });
});

// @desc    Delete a comment
// @route   DELETE /api/applications/:id/comments/:commentId
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  validateObjectId(req.params.id);
  validateObjectId(req.params.commentId);
  const application = await Application.findOneAndUpdate(
    { 
      _id: req.params.id,
      'comments._id': req.params.commentId,
      $or: [
        { 'comments.user': req.user._id },
        { user: req.user._id }
      ]
    },
    { 
      $pull: { comments: { _id: req.params.commentId } },
      $inc: { 
        'metrics.commentsCount': -1,
        'metrics.repliesCount': -application.comments.id(req.params.commentId).replies.length
      }
    },
    { new: true }
  );

  if (!application) {
    res.status(404);
    throw new Error('Comment not found or unauthorized');
  }

  res.status(200).json({
    message: "Comment deleted",
    metrics: application.metrics
  });
});

// @desc    Like a comment
// @route   POST /api/applications/:appId/comments/:commentId/like
// @access  Private
const likeComment = asyncHandler(async (req, res) => {
  const { appId, commentId } = req.params;
  validateObjectId(appId);
  validateObjectId(commentId);

  const application = await Application.findOne({
    _id: appId,
    'comments._id': commentId
  });

  if (!application) {
    res.status(404);
    throw new Error('Application or comment not found');
  }

  const comment = application.comments.id(commentId);
  const likeIndex = comment.likes.indexOf(req.user._id);

  let update;
  if (likeIndex === -1) {
    // Add like
    update = {
      $addToSet: { 'comments.$[comment].likes': req.user._id },
      $inc: { 'metrics.commentLikes': 1 }
    };
  } else {
    // Remove like
    update = {
      $pull: { 'comments.$[comment].likes': req.user._id },
      $inc: { 'metrics.commentLikes': -1 }
    };
  }

  const updatedApp = await Application.findOneAndUpdate(
    { _id: appId, 'comments._id': commentId },
    update,
    {
      arrayFilters: [{ 'comment._id': commentId }],
      new: true
    }
  );

  const updatedComment = updatedApp.comments.id(commentId);
  res.status(200).json({
    message: 'Comment like updated',
    likes: updatedComment.likes,
    metrics: updatedApp.metrics
  });
});

// @desc    Add reply to comment or reply
// @route   POST /api/applications/:id/comments/:commentId/reply
// @access  Private
const addReply = asyncHandler(async (req, res) => {
  // Validate inputs
  validateObjectId(req.params.id);
  validateObjectId(req.params.commentId);
  validateCommentText(req.body.reply);

  // Prepare reply data
  const replyData = {
    _id: new mongoose.Types.ObjectId(),
    user: req.user._id,
    name: req.user.name,
    avatar: req.user.avatar || '',
    reply: req.body.reply,
    replyTo: req.body.replyToId || null,
    isEdited: false,
    editedAt: null,
    likes: [],
    status: 'active',
    createdAt: new Date()
  };

  // Build update operation
  const updateOperation = {
    $push: {
      'comments.$[comment].replies': replyData
    },
    $inc: { 
      'metrics.repliesCount': 1
    }
  };

  // Execute update
  const application = await Application.findOneAndUpdate(
    { 
      _id: req.params.id,
      'comments._id': req.params.commentId 
    },
    updateOperation,
    {
      arrayFilters: [{ 'comment._id': req.params.commentId }],
      new: true,
      runValidators: true
    }
  ).lean();

  // Handle not found
  if (!application) {
    res.status(404);
    throw new Error('Application or comment not found');
  }

  // Find the newly added reply
  const comment = application.comments.find(c => c._id.toString() === req.params.commentId);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found after update');
  }

  // The reply will be the last one in the array
  const newReply = comment.replies[comment.replies.length - 1];

  // Prepare response
  res.status(201).json({
    message: "Reply added successfully",
    reply: {
      _id: newReply._id,
      user: newReply.user,
      name: newReply.name,
      avatar: newReply.avatar,
      reply: newReply.reply,
      replyTo: newReply.replyTo,
      likes: newReply.likes,
      isEdited: newReply.isEdited,
      createdAt: newReply.createdAt
    },
    metrics: {
      repliesCount: application.metrics?.repliesCount || 0
    }
  });
});

// @desc    Edit reply
// @route   PUT /api/applications/:id/comments/:commentId/replies/:replyId
// @access  Private
const editReply = asyncHandler(async (req, res) => {
  validateObjectId(req.params.id);
  validateObjectId(req.params.commentId);
  validateObjectId(req.params.replyId);
  validateCommentText(req.body.newText);

  const application = await Application.findOneAndUpdate(
    {
      _id: req.params.id,
      'comments._id': req.params.commentId,
      'comments.replies._id': req.params.replyId,
      'comments.replies.user': req.user._id
    },
    {
      $set: {
        'comments.$[comment].replies.$[reply].reply': req.body.newText,
        'comments.$[comment].replies.$[reply].isEdited': true,
        'comments.$[comment].replies.$[reply].editedAt': new Date()
      }
    },
    {
      arrayFilters: [
        { 'comment._id': req.params.commentId },
        { 'reply._id': req.params.replyId }
      ],
      new: true
    }
  );

  if (!application) {
    res.status(404);
    throw new Error('Reply not found or unauthorized');
  }

  const updatedReply = application.comments
    .id(req.params.commentId)
    .replies.id(req.params.replyId);

  res.status(200).json({ 
    message: 'Reply updated',
    reply: updatedReply
  });
});

// @desc    Delete reply
// @route   DELETE /api/applications/:id/comments/:commentId/replies/:replyId
// @access  Private
const deleteReply = asyncHandler(async (req, res) => {
  validateObjectId(req.params.id);
  validateObjectId(req.params.commentId);
  validateObjectId(req.params.replyId);

  const application = await Application.findOneAndUpdate(
    {
      _id: req.params.id,
      'comments._id': req.params.commentId,
      'comments.replies._id': req.params.replyId,
      $or: [
        { 'comments.replies.user': req.user._id },
        { user: req.user._id }
      ]
    },
    {
      $pull: {
        'comments.$[comment].replies': { _id: req.params.replyId }
      },
      $inc: { 'metrics.repliesCount': -1 }
    },
    {
      arrayFilters: [{ 'comment._id': req.params.commentId }],
      new: true
    }
  );

  if (!application) {
    res.status(404);
    throw new Error('Reply not found or unauthorized');
  }

  res.status(200).json({ 
    message: 'Reply removed',
    metrics: application.metrics
  });
});

// @desc    Share an application
// @route   POST /api/applications/:id/share
// @access  Public
const shareApplication = asyncHandler(async (req, res) => {
  validateObjectId(req.params.id);

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { shares: 1, 'metrics.shares': 1 }
    },
    { new: true }
  );

  if (application) {
    res.status(200).json({ 
      message: 'Application shared successfully',
      shares: application.shares,
      metrics: application.metrics
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
  likeComment,
  addReply, 
  editReply,
  deleteReply,
  shareApplication 
};