import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log("Database Connected");
        
    })

    await mongoose.connect(`${process.env.MONGODB_URL}/BgRemoval`)

}

export default connectDB