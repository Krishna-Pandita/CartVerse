import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");             // console message to indicate connection status

    await mongoose.connect(process.env.MONGO_URI, {      //connects backend server to mongodb
      serverSelectionTimeoutMS: 5000, //                 //wait max 5 seconds for connection 
    });

    console.log("MongoDB connected successfully ");

  } catch (error) {
    console.log(" FULL ERROR:", error); // 
    process.exit(1);  //1 means error exit 
  }
};

export default connectDB;