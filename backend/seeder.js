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

connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Application.deleteMany();
        await User.deleteMany();
        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;
        const sampleApplications = applicationsData.map((app) => {
            return {...app, user: adminUser}
        });

        await Application.insertMany(sampleApplications);

        console.log('Data Imported!'.green.inverse);

        process.exit();

    } catch(error) {

        console.error(`${error}`.red.inverse);

        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Application.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();

    } catch(error) {
       
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
}

if(process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}