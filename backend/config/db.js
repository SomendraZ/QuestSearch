import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected to: ${mongoose.connection.name}`);
  } catch (err) {
    console.error(`Error: ${err.message}\nStack: ${err.stack}`);
    process.exit(1);
  }
};

export default connectDB;
