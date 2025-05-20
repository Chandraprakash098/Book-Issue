const Feedback = require('../models/Feedback');

// Submit feedback
const submitFeedback = async (req, res) => {
  const { studentId, feedback } = req.body;
  try {
    const newFeedback = new Feedback({ studentId, feedback });
    await newFeedback.save();
    res.status(201).json({ msg: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all feedback
const getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('studentId', 'fullName email');
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { submitFeedback, getFeedback };