const dotenv = require('dotenv');

// Load environment variables first
// const dotenvResult = dotenv.config();
// if (dotenvResult.error) {
//   console.error('Error loading .env file:', dotenvResult.error);
//   process.exit(1);
// }

if (process.env.NODE_ENV !== 'production') {
  const dotenvResult = require('dotenv').config();
  if (dotenvResult.error) {
    console.error('Error loading .env file:', dotenvResult.error);
    process.exit(1);
  }
}


// Log environment variables for debugging
// console.log('Cloudinary Config:', {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET ? '[REDACTED]' : undefined,
// });

const express = require('express');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/student');
const adminRoutes = require('./routes/admin');
const feedbackRoutes = require('./routes/feedback');

connectDB();

const app = express();
app.use(express.json());

// Routes
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));