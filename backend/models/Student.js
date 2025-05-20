const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  fatherName: { type: String, required: true },
  mobileNo: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  landmark: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true },
  dob: { type: Date, required: true },
  runningStandard: { type: String, required: true },
  previousStandard: { type: String, required: true },
  schoolName: { type: String, required: true },
  booksRequested: { type: Number, required: true },
  resultUrl: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Student', studentSchema);