const dotenv = require('dotenv');

const cors= require('cors');

if (process.env.NODE_ENV !== 'production') {
  const dotenvResult = require('dotenv').config();
  if (dotenvResult.error) {
    console.error('Error loading .env file:', dotenvResult.error);
    process.exit(1);
  }
}




const express = require('express');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/student');
const adminRoutes = require('./routes/admin');
const feedbackRoutes = require('./routes/feedback');

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

// Routes
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));