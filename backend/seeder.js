import mongoose from "mongoose";
import dotenv from 'dotenv';
import colors from 'colors';
import users from "./data/users.js";
import applicationsData from './data/applicationsData.js';
import User from './models/userModel.js';
import Application from './models/applicationModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/mdb.js';

dotenv.config();

// Add connection error handling
connectDB().catch(err => {
  console.error('DB Connection Error:'.red.inverse, err);
  process.exit(1);
});

// Improved data import with transactions
const importData = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    await Order.deleteMany({ session });
    await Application.deleteMany({ session });
    await User.deleteMany({ session });

    const createdUsers = await User.insertMany(users, { session });
    const adminUser = createdUsers.find(u => u.isAdmin)?._id || createdUsers[0]._id;

    const sampleApplications = applicationsData.map(app => ({
      ...app,
      user: adminUser,
      // Add createdAt timestamp if not present
      createdAt: app.createdAt || new Date()
    }));

    await Application.insertMany(sampleApplications, { session });

    await session.commitTransaction();
    console.log('✅ Data Imported Successfully'.green.inverse);
    process.exit(0);

  } catch (error) {
    await session.abortTransaction();
    console.error('❌ Import Error:'.red.inverse, error);
    process.exit(1);
  } finally {
    session.endSession();
  }
};

// Improved data destruction
const destroyData = async () => {
  try {
    // Confirm before destructive operation
    const readline = (await import('readline')).createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise(resolve => {
      readline.question('⚠️  Are you sure you want to DELETE ALL DATA? (y/n) ', resolve);
    });

    if (answer.toLowerCase() !== 'y') {
      console.log('Operation cancelled'.yellow);
      process.exit(0);
    }

    await Promise.all([
      Order.deleteMany(),
      Application.deleteMany(),
      User.deleteMany()
    ]);

    console.log('🗑️  All Data Destroyed'.red.inverse);
    process.exit(0);

  } catch (error) {
    console.error('❌ Destruction Error:'.red.inverse, error);
    process.exit(1);
  }
};

// Add help text
if (process.argv[2] === '-h') {
  console.log(`
Usage:
  node seeder.js       - Import sample data
  node seeder.js -d    - Destroy all data
  node seeder.js -h    - Show this help
`);
  process.exit(0);
}

// Execute based on argument
process.argv[2] === '-d' ? destroyData() : importData();