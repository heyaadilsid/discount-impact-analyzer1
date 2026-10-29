import mongoose from 'mongoose';

// Disable command buffering globally so Mongoose immediately rejects instead of hanging for 10s
mongoose.set('bufferCommands', false);

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host} / Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB] Atlas not connected (${error.message}). Resilient local storage is active.`);
  }
};
