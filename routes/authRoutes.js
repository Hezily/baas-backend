const express = require('express');
const router = express.Router();

// ✅ IMPORTANT: correct import
const { signup, login } = require('../controllers/authController');

// ✅ Routes (NO brackets)
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;