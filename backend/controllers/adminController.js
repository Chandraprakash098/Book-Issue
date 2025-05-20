const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const { sendConfirmationEmail } = require('./studentController');

// Admin signup
const signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    let admin = await Admin.findOne({ username });
    if (admin) return res.status(400).json({ msg: 'Admin already exists' });

    admin = new Admin({
      username,
      password: await bcrypt.hash(password, 10),
    });

    await admin.save();

    const payload = { id: admin._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Admin login
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: admin._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all pending student requests
const getRequests = async (req, res) => {
  try {
    const students = await Student.find({ status: 'pending' });
    res.json(students);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Approve student request
const approveRequest = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    student.status = 'approved';
    await student.save();

    await sendConfirmationEmail(student);
    res.json({ msg: 'Request approved and email sent' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Reject student request
const rejectRequest = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    student.status = 'rejected';
    await student.save();
    res.json({ msg: 'Request rejected' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update admin email and password
const updateProfile = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ msg: 'Admin not found' });

    // Check if new username is already taken
    if (username && username !== admin.username) {
      const existingAdmin = await Admin.findOne({ username });
      if (existingAdmin) return res.status(400).json({ msg: 'Username already taken' });
      admin.username = username;
    }

    // Update password if provided
    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }

    await admin.save();
    res.json({ msg: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === 11000 && error.keyPattern.username) {
      return res.status(400).json({ msg: 'Username already taken' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { signup, login, getRequests, approveRequest, rejectRequest, updateProfile };