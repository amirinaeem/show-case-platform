import asyncHandler from '../middleware/asyncHandler.js';
import Application from '../models/applicationModel.js';
import mongoose from 'mongoose';

// Helper functions
const validateObjectId = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id) && 
         (new mongoose.Types.ObjectId(id)).toString() === id;
};

const validateCommentText = (comment) => {
  if (!comment || typeof comment !== 'string' || !comment.trim()) {
    throw new Error('comment content is required and must be a non-empty string');
  }
  if (comment.length > 5000) {
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
      metrics: {
        ...application.metrics,
        likes: application.likes.length
      }
    });
  } else {
    res.status(404);
    throw new Error('Application not found');
  }
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
    avatar: req.user.avatar || '/SHCAPL-logo.jpg',
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
    _id: newComment._id,
    user: newComment.user,
    name: newComment.name,
    avatar: newComment.avatar,
    comment: newComment.comment,
    replies: [],
    likes: [],
    isEdited: false,
    status: "active",
    createdAt: newComment.createdAt,
    metrics: {
      commentsCount: application.metrics.commentsCount
    }
  });
});

// @desc    Edit a comment
// @route   PUT /api/applications/:id/comments/:commentId/edit
// @access  Private
const editComment = asyncHandler(async (req, res) => {
  const { id: appId, commentId } = req.params;
  const { newText } = req.body;

  // Validate Object IDs
  validateObjectId(appId);
  validateObjectId(commentId);

  // Find the application
  const application = await Application.findById(appId);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Find the comment by ID in subdocument array
  const comment = application.comments.id(commentId);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Update fields directly on the subdocument
  comment.comment = newText;
  comment.isEdited = true;
  comment.editedAt = Date.now();

  await application.save();

  res.status(200).json({
    _id: comment._id,
    comment: comment.comment,
    isEdited: comment.isEdited,
    editedAt: comment.editedAt
  });
});


// @desc    Delete a comment
// @route   DELETE /api/applications/:id/comments/:commentId
// @access  Private

const deleteComment = asyncHandler(async (req, res) => {
  const { id, commentId } = req.params;
  try {
    
    const application = await Application.findOne({
      _id: id,
      'comments._id': commentId
    });

    if (!application) {
      console.log('Application not found:', id);
      return res.status(404).json({ message: 'Application not found' });
    }

    const commentIndex = application.comments.findIndex(
      c => c._id.toString() === commentId
    );

    if (commentIndex === -1) {
      console.log('Comment not found in application:', {
        searchedId: commentId,
        existingIds: application.comments.map(c => c._id.toString())
      });
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Remove the comment
    application.comments.pull({ _id: commentId });
    
    // Update metrics
    if (application.metrics?.commentsCount) {
      application.metrics.commentsCount--;
    }

    await application.save();

    res.status(200).json({
      message: "Comment deleted successfully",
      deletedCommentId: commentId
    });

  } catch (error) {
    console.error('Deletion error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});


// @desc    Reply to Comment
// @route   POST /api/applications/:id/comments/:commentId/replyComment
// @access  Private
const replyToComment = asyncHandler(async (req, res) => {
  const { id: appId, commentId } = req.params;
  const { reply } = req.body;

  // Validate inputs
  if (!mongoose.Types.ObjectId.isValid(appId) || !mongoose.Types.ObjectId.isValid(commentId)) {
    res.status(400);
    throw new Error("Invalid ID format");
  }

  if (!reply || !reply.trim()) {
    res.status(400);
    throw new Error("Reply text is required");
  }

  const application = await Application.findById(appId);
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  // Find the comment to reply to
  const comment = application.comments.id(commentId);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  // Verify the original comment user exists
  if (!comment.user) {
    res.status(404);
    throw new Error("Original comment author not found");
  }

  // Create new reply
  const newReply = {
    _id: new mongoose.Types.ObjectId(),
    user: req.user._id, // Current authenticated user
    name: req.user.name,
    avatar: req.user.avatar || '/SHCAPL-logo.jpg',
    reply: reply.trim(),
    replyTo: comment.user || null, // Original comment author
    likes: [],
    isEdited: false,
    status: "active",
    createdAt: new Date()
  };

  // Add the reply
  comment.replies.unshift(newReply);
  
  // Update metrics
  application.metrics = application.metrics || { commentsCount: 0, repliesCount: 0 };
  application.metrics.repliesCount = (application.metrics.repliesCount || 0) + 1;
  
  await application.save();

  // Return the parent comment with updated replies
  res.status(201).json(newReply);
})

// @desc    Like or unlike a comment
// @route   POST /api/applications/:id/comments/:commentId/likeComment
// @access  Private
const likeComment = asyncHandler(async (req, res) => {
  const { id: appId, commentId } = req.params;
  const userId = req.user._id;

  // Validate inputs
  if (!mongoose.Types.ObjectId.isValid(appId) || 
      !mongoose.Types.ObjectId.isValid(commentId)) {
    res.status(400);
    throw new Error("Invalid ID format");
  }

  const application = await Application.findById(appId);
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  const comment = application.comments.id(commentId);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  // Check if user already liked the comment
  const likeIndex = comment.likes.findIndex(
    (id) => id.toString() === userId.toString()
  );
  const isLiked = likeIndex !== -1;

  // Toggle like status
  if (isLiked) {
    comment.likes.splice(likeIndex, 1);
  } else {
    comment.likes.push(userId);
  }

  // Save only the comment changes (no metrics update needed for individual likes)
  await application.save();

  res.status(200).json({
    success: true,
    action: isLiked ? "unliked" : "liked",
    commentId: comment._id,
    likes: comment.likes,
    likeCount: comment.likes.length
  });
});

// @desc    Like or unlike a reply
// @route   POST /api/applications/:id/comments/:commentId/replies/:replyId/like
// @access  Private
const likeToReply = asyncHandler(async (req, res) => {
  const { id: appId, commentId, replyId } = req.params;
  const userId = req.user._id;

  // Validate inputs
  if (!mongoose.Types.ObjectId.isValid(appId) || 
      !mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(replyId)) {
    res.status(400);
    throw new Error("Invalid ID format");
  }

  const application = await Application.findById(appId);
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  const comment = application.comments.id(commentId);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  // Correct way to find the reply
  const reply = comment.replies.id(replyId);
  if (!reply) {
    res.status(404);
    throw new Error("Reply not found"); // Fixed error message
  }

  // Check if user already liked the reply
  const likeIndex = reply.likes.indexOf(userId);
  const isLiked = likeIndex !== -1;

  // Toggle like status
  if (isLiked) {
    reply.likes.splice(likeIndex, 1);
  } else {
    reply.likes.push(userId);
  }

  await application.save();

  res.status(200).json({
    _id: comment._id,      
    replyId: reply._id,     
    replyLikes: reply.likes || [], 
    comments: application.comments.map(c => ({
      ...c.toObject(),
      replies: c.replies || [] 
    }))
  });
});

const editReply = asyncHandler(async (req, res) => {
  const { id: appId, commentId, replyId } = req.params;
  const { newText } = req.body;

  // Validate Object IDs
  validateObjectId(appId);
  validateObjectId(commentId);
  validateObjectId(replyId);

  // Find the application
  const application = await Application.findById(appId);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Find the comment
  const comment = application.comments.id(commentId);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Find the reply
  const reply = comment.replies.id(replyId);
  if (!reply) {
    res.status(404);
    throw new Error('Reply not found');
  }

  // Update the reply
  reply.reply = newText;
  reply.isEdited = true;
  reply.editedAt = Date.now();

  // Save the application
  const updatedApplication = await application.save();

  // Find and return the updated reply
  const updatedComment = updatedApplication.comments.id(commentId);
  const updatedReply = updatedComment.replies.id(replyId);

  res.status(200).json({
    _id: commentId,
    replyId: replyId,
    updatedReplyText: updatedReply.reply,
    isEdited: updatedReply.isEdited,
    editedAt: updatedReply.editedAt
  });
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
  shareApplication,
  addComment, 
  editComment, 
  deleteComment,
  replyToComment,
  likeComment,
  likeToReply,
  editReply
};