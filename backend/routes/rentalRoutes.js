
const express = require('express');
const router = express.Router();
const {
  createRental,
  getUserRentals,
  getRentalById,
} = require('../controllers/rentalController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createRental);
router.route('/user').get(protect, getUserRentals);
router.route('/:id').get(protect, getRentalById);

module.exports = router;
