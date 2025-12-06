import mongoose from "mongoose";

const URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected");
    });
    await mongoose.connect(`${URI}/quickshow`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
