import asyncHandler from '../middleware/asyncHandler.js';
import Application from '../models/applicationModel.js';
import mongoose from 'mongoose'; 


// @desc  Fetch all applications
// @desc  Get /api/applications
// @access  Public
const getApplications = asyncHandler(async(req, res) => {
    const applications = await Application.find({});
    res.json(applications)
});

// @desc  Fetch a application
// @desc  Get /api/applications
// @access  Public
const getApplicationById = asyncHandler(async(req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid application ID' });
    }

    const application = await Application.findById(req.params.id);

    if (application) {
        return res.json(application);
    } else {
        res.status(404);
        throw new Error('Resource not found')
    }
})

export {getApplications, getApplicationById };
