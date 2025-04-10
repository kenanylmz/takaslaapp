const express = require('express');
const router = express.Router();
const {protect} = require('../middlewares/authMiddleware');
const {
  getProfile,
  updateProfile,
  uploadProfileImage,
} = require('../controllers/profileController');
const multer = require('multer');
const path = require('path');

// Dosya yükleme ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '')}`);
  },
});

// Sadece görsel dosyalarını kabul et
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyaları yüklenebilir!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {fileSize: 1024 * 1024 * 5}, // 5MB
});

// Profile routes - tüm rotalar korumalı
router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.post(
  '/upload-image',
  protect,
  upload.single('profileImage'),
  uploadProfileImage,
);

module.exports = router;
