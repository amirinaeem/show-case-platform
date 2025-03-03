import express from 'express';
const router = express.Router();
import asyncHandler from '../middleware/asyncHandler.js';
import Application from '../models/applicationModel.js';
import mongoose from 'mongoose'; 


router.get('/', asyncHandler(async (req, res) => {
    const applications = await Application.find({});
    res.json(applications);
}));


router.get('/:id', asyncHandler(async (req, res) => {
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid application ID' });
    }

    const application = await Application.findById(req.params.id);

    if (application) {
        return res.json(application);
    }

    res.status(404).json({ message: 'Application not found' });
}));

export default router;