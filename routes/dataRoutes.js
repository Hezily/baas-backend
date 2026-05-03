const express = require('express');
const router = express.Router();

const apiKeyMiddleware = require('../middleware/apiKeyMiddleware');
const { createData, getData } = require('../controllers/dataController');

router.post('/', apiKeyMiddleware, createData);
router.get('/', apiKeyMiddleware, getData);

module.exports = router;