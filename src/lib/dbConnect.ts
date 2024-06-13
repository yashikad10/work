import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI; 

    if (!mongoURI) {
      console.error('MongoDB URI not found in environment variables.');
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log('MongoDB connected...');
  } catch (err:any) {
    console.error(err.message);
    process.exit(1);
  }
};

export default dbConnect;
