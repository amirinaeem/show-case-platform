import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import applications from './data/applicationsData.js';
const port = process.env.PORT || 5000;
const app = express();


app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api/applications', (req, res) => {
    res.json(applications)
})

app.get('/api/applications/:id', (req, res) => {
    const application =applications.find(app => app._id === req.params.id);
    res.json(application)
})

app.listen(port, () => console.log(`Server running on port ${port}`));
