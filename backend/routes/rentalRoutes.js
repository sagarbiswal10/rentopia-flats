
const express = require('express');
const router = express.Router();
const {
  createRental,
  getUserRentals,
  getRentalById,
  updateRentalStatus,
  getAllRentals,
  getPropertyOwnersRentals,
  cancelRental,
  payMonthlyRent,
  addExtraServices,
  downloadAgreement,
  uploadSignedAgreement
} = require('../controllers/rentalController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads/agreements';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-signed-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.post('/', protect, createRental);
router.get('/user', protect, getUserRentals);
router.get('/property-owners', protect, getPropertyOwnersRentals);
router.get('/:id', protect, getRentalById);
router.put('/:id', protect, updateRentalStatus);
router.delete('/:id', protect, cancelRental);
router.get('/', protect, admin, getAllRentals);

// New routes for monthly payments and services
router.post('/:id/pay-rent', protect, payMonthlyRent);
router.post('/:id/services', protect, addExtraServices);
router.get('/:id/agreement', protect, downloadAgreement);
router.post('/:id/agreement', protect, upload.single('signedAgreement'), uploadSignedAgreement);

module.exports = router;
