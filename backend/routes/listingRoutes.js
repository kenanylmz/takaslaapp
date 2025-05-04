const express = require('express');
const router = express.Router();
const {protect} = require('../middlewares/authMiddleware');
const {
  getListings,
  getMyListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  deleteImage,
  searchListings,
} = require('../controllers/listingController');
const multer = require('multer');
const path = require('path');

// Dosya yükleme ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/listings/');
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

// Public rotalar
router.get('/', getListings);
router.get('/search', searchListings);
router.get('/:id', getListingById);

// Private rotalar
router.get('/my/listings', protect, getMyListings);
router.post('/', protect, upload.array('images', 5), createListing);
router.put('/:id', protect, upload.array('images', 5), updateListing);
router.delete('/:id', protect, deleteListing);
router.delete('/:id/image/:imageName', protect, deleteImage);

module.exports = router;
