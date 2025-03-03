import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/mdb.js';
import applicationRoutes from './routes/applicationRoutes.js';

const port = process.env.PORT || 5000;

connectDB();
const app = express();


app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/applications', applicationRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
