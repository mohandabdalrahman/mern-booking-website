import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRoute from './routes/auth.js';
import hotelsRoute from './routes/hotels.js';
import roomsRoute from './routes/rooms.js';
import usersRoute from './routes/users.js';

const PORT = process.env.PORT || 5000;
dotenv.config();

// connect database
const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected To MongoDB`);
  } catch (error) {
    throw error;
  }
};
mongoose.set('strictQuery', true);

mongoose.connection.on('disconnected', () => {
  console.log(`MongoDB DisConnected`);
});

const app = express();

// MiddleWares
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/rooms', roomsRoute);
app.use('/api/hotels', hotelsRoute);

// Error middleware
app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMessage = err.message || 'Something went wrong';
  return res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMessage,
    stack: err.stack
  });
});

app.listen(PORT, () => {
  connectDatabase();
  console.log(`App listen on port ${PORT}`);
});