const express = require('express');
const router = express.Router();

const apiKeyMiddleware = require('../middleware/apiKeyMiddleware');
const { createData, getData } = require('../controllers/dataController');

// dynamic collections
router.post('/:collection', apiKeyMiddleware, createData);
router.get('/:collection', apiKeyMiddleware, getData);

module.exports = router;