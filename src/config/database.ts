import mongoose from 'mongoose';
import { DB } from './environment';

export const connectDB = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

  try {
    await mongoose.connect(DB, options);

    console.log('Connected to the DB 🛰');
  } catch (error) {
    console.error(error)
  }
};
