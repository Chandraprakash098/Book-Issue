const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedback } = require('../controllers/feedbackController');
const auth = require('../middleware/auth');

// Submit feedback
router.post('/submit', submitFeedback);

// Get all feedback (admin only)
router.get('/feedback', auth, getFeedback);

module.exports = router;