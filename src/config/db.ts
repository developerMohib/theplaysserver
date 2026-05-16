import mongoose from 'mongoose';

export const connectDatabase = async (db_url: string) => {
  try {
    if (!db_url) throw new Error('MongoDB URI missing');
    await mongoose.connect(db_url);
    console.log('Connected to database successfully');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
};

export default connectDatabase;
