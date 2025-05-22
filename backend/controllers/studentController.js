const Student = require('../models/Student');
const cloudinary = require('../config/cloudinary');
const nodemailer = require('nodemailer');

// Submit student form
const submitForm = async (req, res) => {
  try {
    const {
      fullName, fatherName, mobileNo, email, address, landmark, city, state, country,
      pincode, dob, runningStandard, previousStandard, schoolName, booksRequested
    } = req.body;

    // Check if email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ msg: 'This email has already been used to submit a form' });
    }

    // Log Cloudinary config before upload
    console.log('Cloudinary config before upload:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? '[REDACTED]' : undefined,
    });

    // Upload result to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'student_results',resource_type: 'raw', },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const student = new Student({
      fullName, fatherName, mobileNo, email, address, landmark, city, state, country,
      pincode, dob, runningStandard, previousStandard, schoolName, booksRequested,
      resultUrl: result.secure_url,
    });

    await student.save();
    res.status(201).json({ msg: 'Form submitted successfully', studentId: student._id });
  } catch (error) {
    console.error('Submit form error:', error);
    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(400).json({ msg: 'This email has already been used to submit a form' });
    }
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Email setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth : {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send confirmation email
const sendConfirmationEmail = async (student) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: student.email,
    subject: 'Book Issue Confirmation',
    html: `
      <h2>Book Issue Confirmed</h2>
      <p>Dear ${student.fullName},</p>
      <p>Your request for ${student.booksRequested} book(s) has been approved.</p>
      <p>Thank you!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { submitForm, sendConfirmationEmail };