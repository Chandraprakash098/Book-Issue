const express = require('express');
const router = express.Router();
const { signup, login, getRequests, approveRequest, rejectRequest,updateProfile  } = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Admin signup
router.post('/signup', signup);

// Admin login
router.post('/login', login);

// Get all pending student requests
router.get('/requests', auth, getRequests);

// Approve student request
router.put('/approve/:id', auth, approveRequest);

// Reject student request
router.put('/reject/:id', auth, rejectRequest);

router.put('/update-profile', auth, updateProfile);

module.exports = router;