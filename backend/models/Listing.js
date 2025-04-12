const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Başlık zorunludur'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Kategori zorunludur'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Açıklama zorunludur'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Şehir zorunludur'],
    trim: true
  },
  condition: {
    type: String,
    required: [true, 'Ürün durumu zorunludur'],
    enum: ['Yeni', 'Yeni Gibi', 'İyi', 'Az Kullanılmış', 'Yıpranmış'],
    default: 'İyi'
  },
  images: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted', 'traded'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Listing', listingSchema); 