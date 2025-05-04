const Listing = require('../models/Listing');
const fs = require('fs');
const path = require('path');

// @desc    Tüm ilanları getir
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res) => {
  try {
    const listings = await Listing.find({status: 'active'}).sort({
      createdAt: -1,
    });

    res.json(listings);
  } catch (error) {
    res.status(500).json({message: 'Sunucu hatası', error: error.message});
  }
};

// @desc    Kullanıcının kendi ilanlarını getir
// @route   GET /api/listings/mylistings
// @access  Private
const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({
      user: req.user._id,
      status: {$ne: 'deleted'},
    }).sort({createdAt: -1});

    res.json(listings);
  } catch (error) {
    res.status(500).json({message: 'Sunucu hatası', error: error.message});
  }
};

// @desc    Belirli ID'ye sahip ilanı getir
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate({
      path: 'user',
      select: 'name profileImage createdAt',
    });

    if (!listing) {
      return res.status(404).json({message: 'İlan bulunamadı'});
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({message: 'Sunucu hatası', error: error.message});
  }
};

// @desc    Yeni ilan oluştur
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res) => {
  try {
    const {title, category, description, city, condition} = req.body;

    // İlan oluştur
    const listing = await Listing.create({
      user: req.user._id,
      title,
      category,
      description,
      city,
      condition,
      images: req.files ? req.files.map(file => file.filename) : [],
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({message: 'Sunucu hatası', error: error.message});
  }
};

// @desc    İlan güncelle
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = async (req, res) => {
  try {
    const {title, category, description, city, condition} = req.body;

    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({message: 'İlan bulunamadı'});
    }

    // İlanın sahibi olup olmadığını kontrol et
    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({message: 'Bu işlem için yetkiniz yok'});
    }

    // Güncellenecek alanlar
    const updatedFields = {
      title,
      category,
      description,
      city,
      condition,
    };

    // Eğer yeni resimler eklendiyse
    if (req.files && req.files.length > 0) {
      updatedFields.images = [
        ...listing.images,
        ...req.files.map(file => file.filename),
      ];
    }

    listing = await Listing.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
    });

    res.json(listing);
  } catch (error) {
    res.status(500).json({message: 'Sunucu hatası', error: error.message});
  }
};

// @desc    İlanı sil
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({message: 'İlan bulunamadı'});
    }

    // İlanın sahibi olup olmadığını kontrol et
    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({message: 'Bu işlem için yetkiniz yok'});
    }

    // İlanı tamamen sil
    await Listing.findByIdAndDelete(req.params.id);

    res.json({message: 'İlan başarıyla silindi'});
  } catch (error) {
    res.status(500).json({message: 'Sunucu hatası', error: error.message});
  }
};

// @desc    İlan resmini sil
// @route   DELETE /api/listings/:id/image/:imageName
// @access  Private
const deleteImage = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({message: 'İlan bulunamadı'});
    }

    // İlanın sahibi olup olmadığını kontrol et
    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({message: 'Bu işlem için yetkiniz yok'});
    }

    const imageName = req.params.imageName;

    // Resim listeden çıkarılıyor
    const updatedImages = listing.images.filter(img => img !== imageName);

    // İlan güncelleniyor
    await Listing.findByIdAndUpdate(req.params.id, {images: updatedImages});

    // Dosya sisteminden silme işlemi
    try {
      const imagePath = path.join(
        __dirname,
        '../../uploads/listings/',
        imageName,
      );
      fs.unlinkSync(imagePath);
    } catch (err) {
      console.error('Dosya silinirken hata:', err);
    }

    res.json({message: 'Resim başarıyla silindi'});
  } catch (error) {
    res.status(500).json({message: 'Sunucu hatası', error: error.message});
  }
};

// @desc    İlanları kategoriye ve arama terimine göre filtrele
// @route   GET /api/listings/search
// @access  Public
const searchListings = async (req, res) => {
  try {
    const {category, search, city, page = 1, limit = 10} = req.query;
    const skip = (page - 1) * limit;

    // Filtreleme için sorgu oluştur
    const query = {status: 'active'};

    // Kullanıcı giriş yapmışsa kendi ilanlarını gösterme
    if (req.user) {
      query.user = {$ne: req.user._id};
    }

    // Kategori filtresi
    if (category && category !== 'Tümü') {
      query.category = category;
    }

    // Şehir filtresi
    if (city) {
      query.city = city;
    }

    // Arama filtresi (başlık veya açıklamada)
    if (search) {
      query.$or = [
        {title: {$regex: search, $options: 'i'}},
        {description: {$regex: search, $options: 'i'}},
      ];
    }

    // Toplam ilan sayısını al
    const total = await Listing.countDocuments(query);

    // İlanları getir
    const listings = await Listing.find(query)
      .sort({createdAt: -1})
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name profileImage');

    res.json({
      listings,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    res.status(500).json({message: 'Sunucu hatası', error: error.message});
  }
};

module.exports = {
  getListings,
  getMyListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  deleteImage,
  searchListings,
};
