import mongoose from "mongoose";

import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
 try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
 } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1)
 }
}


console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Loaded' : 'Missing!');

export default connectDB;