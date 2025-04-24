const express = require('express');
const router = express.Router();
const {protect} = require('../middlewares/authMiddleware');
const {
  getListingSuggestions,
  getNewListingSuggestions,
} = require('../controllers/suggestionController');

// Yeni ilan için takas önerileri
router.post('/', protect, getNewListingSuggestions);

// Mevcut ilan için takas önerileri
router.get('/:id', protect, getListingSuggestions);

module.exports = router;
