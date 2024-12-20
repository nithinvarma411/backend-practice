import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
    try {

        const connections = await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connections.connection.host}`);
        
    } catch (error) {
        console.error("error in connection :", error)
        console.log(`${process.env.DB_URI}`)
    }
}

export default connectDB
