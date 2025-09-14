// backend/config/mdb.js

import mongoose from 'mongoose';
import { env } from '../../env.js';  // Import validated env instead of using dotenv here

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// Extra debug log
console.log('MONGODB_URI:', env.MONGODB_URI ? 'Loaded' : 'Missing!');

export default connectDB;
