const express = require('express');
const router = express.Router();
const { submitForm } = require('../controllers/studentController');
const upload = require('../middleware/upload');

// Submit student form
router.post('/submit', upload.single('result'), submitForm);

module.exports = router;