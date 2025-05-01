import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "your-mongodb-connection-string";

export const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection.asPromise();
  }

  try {
    return await mongoose.connect(MONGO_URI);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};
