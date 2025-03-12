
const express = require('express');
const router = express.Router();
const {
  createRental,
  getUserRentals,
  getRentalById,
  updateRentalStatus,
  getAllRentals,
} = require('../controllers/rentalController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createRental);
router.get('/user', protect, getUserRentals);
router.get('/:id', protect, getRentalById);
router.put('/:id', protect, updateRentalStatus);
router.get('/', protect, admin, getAllRentals);

module.exports = router;
