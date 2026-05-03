const express = require('express');
const router = express.Router();

const apiKeyMiddleware = require('../middleware/apiKeyMiddleware');

const {
  createData,
  getData,
  updateData,
  deleteData
} = require('../controllers/dataController');

// 📦 COLLECTION ROUTES

// ➕ Create
router.post('/:collection', apiKeyMiddleware, createData);

// 📥 Read (with optional filter)
router.get('/:collection', apiKeyMiddleware, getData);

// ✏️ Update
router.put('/:collection/:id', apiKeyMiddleware, updateData);

// ❌ Delete
router.delete('/:collection/:id', apiKeyMiddleware, deleteData);

module.exports = router;