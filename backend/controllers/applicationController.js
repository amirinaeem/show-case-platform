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
    } = req.body;

    const application = new Application({
        name: name || 'Sample Name',
        image: image || 'SHCAPL-logo.jpg',
        description: description || 'Sample description',
        platform: platform || 'Web',
        programmingLanguage: programmingLanguage || 'JavaScript',
        framework: framework || 'React, Node.js',
        database: database || 'MongoDB',
        licenseType: licenseType || 'Single License',
        price: price || 0,
        demoLink: demoLink || '',
        documentationLink: documentationLink || '',
        githubRepo: githubRepo || '',
        supportDetails: supportDetails || { type: 'Email support', duration: '6 months' },
        features: features || [],
        previews: previews || [],
        authorDetails: authorDetails || {
            name: 'Sample Author',
            portfolioLink: '',
            lastUpdate: new Date().toISOString(),
            published: new Date().toISOString(),
            highResolution: false,
            compatibleBrowsers: [],
            compatibleWith: '',
            documentation: '',
            layout: '',
        },
        tags: tags || [],
        isAvailable: isAvailable || false,
        user: req.user._id, 
    });

    const createdApplication = await application.save();
    res.status(201).json(createdApplication);
});

export { getApplications, getApplicationById, createApplication };