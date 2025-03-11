
const express = require('express');
const router = express.Router();
const {
  createRental,
  getUserRentals,
  getRentalById,
  getAllRentals,
  updateRentalStatus,
} = require('../controllers/rentalController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createRental)
  .get(protect, admin, getAllRentals);
  
router.route('/user').get(protect, getUserRentals);

router.route('/:id')
  .get(protect, getRentalById)
  .put(protect, updateRentalStatus);

module.exports = router;
